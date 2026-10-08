
from django.urls import path
from .views import (
    add_to_cart,
    get_cart,
    update_cart_quantity,
    remove_from_cart,
)

urlpatterns = [
    path("", add_to_cart, name="add-to-cart"),

    path("my-cart/", get_cart, name="get-cart"),

    path(
        "update/<int:item_id>/",
        update_cart_quantity,
        name="update-cart-quantity"
    ),

    path(
        "remove/<int:item_id>/",
        remove_from_cart,
        name="remove-from-cart"
    ),
]
