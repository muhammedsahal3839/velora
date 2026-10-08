from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()

    category = request.GET.get('category')
    search = request.GET.get('search')
    featured = request.GET.get('featured')
    new_arrival = request.GET.get('new_arrival')

    if category:
        products = products.filter(
            category__name__iexact=category
        )

    if search:
        products = products.filter(
            name__icontains=search
        )

    if featured == 'true':
        products = products.filter(
            is_featured=True
        )

    if new_arrival == 'true':
        products = products.filter(
            is_new_arrival=True
        )

    serializer = ProductSerializer(
        products,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)
    products = Product.objects.all()
    serializer = ProductSerializer(
        products,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=404
        )

    serializer = ProductSerializer(
        product,
        context={'request': request}
    )

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, id):

    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():
        review = serializer.save(
            product=product,
            user=request.user
        )

        return Response(
            {
                'message': 'Review added successfully',
                'review': ReviewSerializer(
                    review,
                    context={'request': request}
                ).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )