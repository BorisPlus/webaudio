import datetime
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RecordConsumer(AsyncWebsocketConsumer):
    name = None

    async def connect(self):
        self.name = datetime.datetime.utcnow()
        # Join room group
        await self.channel_layer.group_add(
            "same",
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            "same",
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, bytes_data=None, **_):
        if not bytes_data:
            return

        with open(f'./files/{self.name}.mp3', 'ab+') as f:
            f.write(bytes_data)

        # Send message to room group
        await self.channel_layer.group_send(
            "same",
            {
                'type': 'chat_message',
                'message': "data was recieved"
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
