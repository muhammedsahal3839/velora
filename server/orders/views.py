
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from cart.models import Cart
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):

    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response(
            {'error': 'Cart is empty'},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_items = cart.items.select_related('product').all()

    if not cart_items.exists():
        return Response(
            {'error': 'Cart is empty'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check stock before creating the order
    for item in cart_items:
        if item.quantity > item.product.stock:
            return Response(
                {
                    'error': f'Not enough stock for {item.product.name}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    with transaction.atomic():

        order = Order.objects.create(
            user=request.user,
            total_amount=0
        )

        total = 0

        for item in cart_items:
            product = item.product
            subtotal = product.price * item.quantity
            total += subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=product.price,
                quantity=item.quantity
            )

            product.stock -= item.quantity
            product.save()

        order.total_amount = total
        order.save()

        cart.items.all().delete()

    serializer = OrderSerializer(order)

    return Response(
        {
            'message': 'Order placed successfully',
            'order': serializer.data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):

    with transaction.atomic():

        try:
            order = Order.objects.select_for_update().get(
                id=order_id,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status == 'Cancelled':
            return Response(
                {'error': 'Order is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Restore stock for all products in this order
        for item in order.items.all():
            if item.product_id:
                Product.objects.filter(
                    id=item.product_id
                ).update(
                    stock=models.F('stock') + item.quantity
                )

        order.status = 'Cancelled'
        order.save(update_fields=['status'])

    serializer = OrderSerializer(order)

    return Response(
        {
            'message': 'Order cancelled successfully',
            'order': serializer.data
        },
        status=status.HTTP_200_OK
    )
