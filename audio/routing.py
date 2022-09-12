from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/example002/$', consumers.RecordConsumer.as_asgi()),
]
