from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('example001.html', views.example001, name='example001'),
    path('example002.html', views.example002, name='example002'),
    path('save', views.save, name='save'),
]
