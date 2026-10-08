from rest_framework import serializers
from .models import Category, Product, ProductImage, Review


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = Review
        fields = [
            'id',
            'username',
            'rating',
            'comment',
            'image',
            'created_at'
        ]


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(
        source='category.name',
        read_only=True
    )

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    reviews = ReviewSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'material',
            'fit',
            'care',
            'stock',
            'main_image',
            'is_featured',
            'is_new_arrival',
            'images',
            'reviews',
            'created_at'
        ]