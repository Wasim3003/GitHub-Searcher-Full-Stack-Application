from django.urls import path
from .views import *

urlpatterns = [
    path("search/", search_github),
    path("clear-cache/", clear_cache),
]
