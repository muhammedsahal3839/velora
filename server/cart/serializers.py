from rest_framework import serializers

from .models import Cart, CartItem
from products.models import Product


# =========================
# PRODUCT DETAILS FOR CART
# =========================

class CartProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "category",
            "main_image",
            "stock",
        ]


# =========================
# CART ITEM
# =========================

class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
        ]


# =========================
# CART
# =========================

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
        ]