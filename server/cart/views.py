
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer


# =========================
# ADD TO CART
# =========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if not product_id:
        return Response(
            {"error": "Product ID is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return Response(
            {"error": "Quantity must be at least 1"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if quantity > product.stock:
        return Response(
            {"error": "Not enough stock available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, created = Cart.objects.get_or_create(
        user=request.user
    )

    cart_item, item_created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity}
    )

    if not item_created:
        new_quantity = cart_item.quantity + quantity

        if new_quantity > product.stock:
            return Response(
                {"error": "Not enough stock available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = new_quantity
        cart_item.save()

    serializer = CartSerializer(
        cart,
        context={"request": request}
    )

    return Response({
        "message": "Product added to cart",
        "cart": serializer.data
    })


# =========================
# GET CART
# =========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(
        user=request.user
    )

    serializer = CartSerializer(
        cart,
        context={"request": request}
    )

    return Response(serializer.data)


# =========================
# UPDATE QUANTITY
# =========================

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request, item_id):

    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    quantity = request.data.get("quantity")

    try:
        quantity = int(quantity)

        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return Response(
            {"error": "Quantity must be at least 1"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if quantity > cart_item.product.stock:
        return Response(
            {"error": "Not enough stock available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_item.quantity = quantity
    cart_item.save()

    serializer = CartSerializer(
        cart_item.cart,
        context={"request": request}
    )

    return Response({
        "message": "Cart quantity updated",
        "cart": serializer.data
    })


# =========================
# REMOVE FROM CART
# =========================

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):

    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    cart_item.delete()

    return Response(
        {"message": "Product removed from cart"},
        status=status.HTTP_200_OK
    )
