from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('contrib/<int:contrib_id>/', views.display_contributor, name = "display_contributor"),
    path('article/<slug:slug>/', views.display_article, name = "display_article")
]