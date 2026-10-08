
from django.urls import path
from .views import checkout, get_orders, cancel_order

urlpatterns = [
    path("checkout/", checkout, name="checkout"),
    path("", get_orders, name="get-orders"),
    path(
        "cancel/<int:order_id>/",
        cancel_order,
        name="cancel-order"
    ),
]
