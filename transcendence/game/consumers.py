import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from .game import Game
import asyncio
# import time
# from channels.layers import get_channel_layer
# from .playLog import get_max_players
# from .playLog import get_player_alias
# from .playLog import store_game_results
from .gameChannel import GameChannel, gameManager
#from .tournamentChannel import TournamentChannel
import numpy as np


class MainConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		global gameManager
		print("websocket connected!")
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		await self.accept()
		self.gameChannel = GameChannel()
		if not gameManager.running_tasks:
			gameManager.running_tasks.add(asyncio.create_task(gameManager.broadcast_game_state()))
		# self.tournamentChannel = None

	
	async def disconnect(self, code=None):
		if self.gameChannel.status == "on":
			await self.gameChannel.finish()
		# if self.tournamentChannel.status == "on":
		# 	await self.tournamentChannel.finish()
		print("WEBOSCKET DISCONNECTED!!!!!")

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data["channel"] == "game":
			await self.gameChannel.receive(self, data)
		# elif data["channel"] == "tournament":
		# 	await self.tournamentChannel.receive(self, data)
	
	async def join_channel(self, room):
		await self.channel_layer.group_add(room, self.channel_name)

	async def remove_channel(self, room):
		await self.channel_layer.group_discard(room, self.channel_name)
	
	async def send_channel(self, room, message):
		await self.channel_layer.group_send(room, message)
	
	async def send_self(self, message):
		await self.send(text_data=message)
	
	async def game_updates(self, event):
		await self.gameChannel.game_updates(event)
			


