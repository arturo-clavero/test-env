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
		await self.join_channel("all")
		await self.update_tournament_display()

	async def disconnect(self, code=None):
		if self.gameChannel and self.gameChannel.status == "on":
			await self.gameChannel.finish()
		if self.tournament and self.tournament.status != "end":
			await self.tournament.disconnect()
		await self.remove_channel("all")
		print("WEBOSCKET DISCONNECTED!!!!!")

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data["channel"] == "game":
			await self.gameChannel.receive(self, data)

		elif data["channel"] == "tournament":
			from .tournamentChannel import pending_tournament

			if data["action"] == "join" and self.tournament == None:
				await pending_tournament.join(self)

			elif data["action"] == "succesfull payment" and self.tournament == None:
				await pending_tournament.confirm_payment(self, "alias...")

			elif data["action"] == "create" and pending_tournament == None:
				newTour = TournamentChannel(self)
				await self.send_channel("all", {
							"type" : "tour.updates",
							"button" : "join",
							"prize_pool" : newTour.prize_pool * .9,
							"tourId" :  newTour.tour_id,
						})

	async def update_tournament_display(self):
		print("updating the display....")
		from .tournamentChannel import pending_tournament
		if pending_tournament == None:
			print('create')
			await self.send_self({
				"type" : "tour.updates",
				"button" : "create",
			})
		#paying
		elif self.user_id in pending_tournament.all_players:
			print('subscribe')
			await self.send_self({
				"type" : "tour.updates",
				"button" : "subscribed",
				"prize_pool" : pending_tournament.prize_pool * .9,

			})
		elif pending_tournament.total_players >= pending_tournament.max_players:
			print('full')
			await self.send_self({
				"type" : "tour.updates",
				"button" : "full",
				"prize_pool" : pending_tournament.prize_pool * .9,
			})
		else :
			print('join')
			await self.send_self({
				"type" : "tour.updates",
				"button" : "join",
				"prize_pool" : pending_tournament.prize_pool * .9,
				"tourId" :  pending_tournament.tour_id,
			})


	async def join_channel(self, room):
		print(f"Joining group {room} with channel name: {self.channel_name}")
		await self.channel_layer.group_add(room, self.channel_name)

	async def remove_channel(self, room):
		await self.channel_layer.group_discard(room, self.channel_name)

	async def send_channel(self, room, message):
		print('send channel, message: ', message)
		await self.channel_layer.group_send(room, message)

	async def send_self(self, message):
		await self.send(text_data=json.dumps(message))
	
	async def game_updates(self, event):
		await self.gameChannel.game_updates(event)

	async def tour_updates(self, event):
		print("updates!")
		await self.send(text_data=json.dumps(event))
	
	def live_tournament(self, event):
		self.tournament = event.current
			


