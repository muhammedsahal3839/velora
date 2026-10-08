from django.urls import path
from .views import create_contact_message

urlpatterns = [
    path("", create_contact_message, name="create-contact-message"),
]