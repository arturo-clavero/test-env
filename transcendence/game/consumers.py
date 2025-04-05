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
from .tournamentChannel import TournamentChannel, tournamentManager, ongoing_tournaments, pending_tournament

# from .tournamentChannel import TournamentChannel
import numpy as np

# active_users = []

class MainConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		global gameManager
		print("websocket connected!")
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		await self.accept()
		self.gameChannel = None
		if not gameManager.running_tasks:
			gameManager.running_tasks.add(asyncio.create_task(gameManager.broadcast_game_state()))
		self.tournament = None
		if not tournamentManager.running_tasks:
			tournamentManager.running_tasks.add(asyncio.create_task(tournamentManager.monitor_tournaments()))
		# active_users.append(self.user_id)
		self.join_channel("all")


	
	async def disconnect(self, code=None):
		if self.gameChannel and self.gameChannel.status == "on":
			await self.gameChannel.finish()
		if self.tournament and self.tournament.status != "end":
			await self.tournament.disconnect()
		# active_users.remove(self.user_id)
		await self.remove_channel("all")
		print("WEBOSCKET DISCONNECTED!!!!!")

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data["channel"] == "game":
			await self.gameChannel.receive(self, data)
		elif data["channel"] == "tournament":
			if data["action"] == "join":
				await ongoing_tournaments[data["tour_id"]].join()
			elif data["action"] == "create" and pending_tournament == None:
				print("create called")
				TournamentChannel(self)
				await self.send_self({
							"type" : "updates",
							"display" : "tournament",
							"button" : "join",
						})
					
	async def join_channel(self, room):
		await self.channel_layer.group_add(room, self.channel_name)

	async def remove_channel(self, room):
		await self.channel_layer.group_discard(room, self.channel_name)
	
	async def send_channel(self, room, message):
		await self.channel_layer.group_send(room, message)
	
	async def send_self(self, message):
		await self.send(text_data=json.dumps(message))
	
	async def game_updates(self, event):
		await self.gameChannel.game_updates(event)

	async def updates(self, event):
	    await self.send(text_data=json.dumps(event))
	
	def live_tournament(self, event):
		self.tournament = event.current
			


