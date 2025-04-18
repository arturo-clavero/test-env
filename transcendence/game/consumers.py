import json, asyncio, numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer
from .gameChannel import GameChannel, gameManager
from .tournamentChannel import TournamentChannel, TournamentManager
from .playLog import new_game
from django.utils import timezone
from django.core.cache import cache

#LERA use online
def isUserOnline(user_id):
	active_users = cache.get('active_users')
	if active_users == None or user_id not in active_users:
		return False
	return True

class MainConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		print("websocket connected!")
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		await self.accept()
		self.gameChannel = GameChannel()
		if not gameManager.running_tasks:
			gameManager.running_tasks.add(asyncio.create_task(gameManager.broadcast_game_state()))
		active_users = cache.get('active_users')
		if active_users == None:
			active_users = []
		active_users.append(self.user_id)
		cache.set('active_users', active_users)
		self.user_data = cache.get(f"consumer_{self.user_id}")
		if self.user_data :
			print("retrieving consumer", self.user_data)
			tour_id = self.user_data.get("tournament")
			print("tour_id: ", tour_id)
			if tour_id is not None:
				self.tournament = TournamentManager().get_tournament(tour_id)
			else:
				self.tournament = None
			for room in self.user_data.get("rooms"):
				print("adding room: ", room)
				await self.join_channel(room, False)
		else :
			self.tournament = None
			self.user_data = {"rooms":[], "tournament":None}
			cache.set(f"consumer_{self.user_id}", self.user_data)
			await self.join_channel(f"{self.user_id}")
		await self.join_channel("all")
		await self.update_tournament_display()

	async def exit_live(self):
		if self.gameChannel and self.gameChannel.status == "on":
			print("end game")
			await self.gameChannel.finish()
		if self.tournament :
			print("end tournament")
			await self.tournament.remove_player(self.user_id)

	async def disconnect(self, code=None):
		global active_users
		
		await self.exit_live()
		await self.remove_channel("all")
		active_users = None
		active_users = cache.get('active_users')
		if active_users == None:
			active_users = []
		active_users.remove(self.user_id)
		cache.set('active_users', active_users)
		print("WEBOSCKET DISCONNECTED!!!!!")

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data["channel"] == "log":
			await new_game(data)
	
		if data["channel"] == "game":
			await self.gameChannel.receive(self, data)

		elif data["channel"] == "tournament":
			pending_tournament = TournamentManager().get_tournament(cache.get("pending_tournament"))
			if data["action"] == "exit live":
				print("exit live")
				await self.exit_live()

			elif data["action"] == "create":
				if pending_tournament == None:
					newTour = TournamentChannel(self)
					await self.send_channel("all", {
								"type" : "tour.updates",
								"update_tour_registration" : "join",
								"button" : "join",
								"prize_pool" : newTour.prize_pool,
								"now" : timezone.now().isoformat(),
								"start" : newTour.start_time.isoformat()
							})
					asyncio.create_task(newTour.notify_start())
					asyncio.create_task(newTour.fade_out_notification())
					asyncio.create_task(newTour.start())

				else : 
					await self.send_self({
								"type" : "tour.updates",
								"update_tour_registration" : "join",
								"button" : "join",
								"prize_pool" : pending_tournament.prize_pool,
								"now" : timezone.now().isoformat(),
								"start" : pending_tournament.start_time.isoformat(),
							})

			elif data["action"] == "join" and pending_tournament != None:
					await pending_tournament.join(self)
			elif data["action"] == "succesfull payment" and pending_tournament != None and data["tour_id"] == pending_tournament.tour_id:
					await pending_tournament.confirm_payment(self)

	async def update_tournament_display(self):
		pending_tournament = TournamentManager().get_tournament(cache.get("pending_tournament"))
		if self.tournament:
			if pending_tournament == None or self.tournament.tour_id == pending_tournament.tour_id:
				print("has self tournaemnt: ", self.tournament.status)
				if self.tournament.status == "open" or self.tournament.status == "locked":
					print("subscribed?")
					await self.send_self({
						"type" : "tour.updates",
						"update_tour_registration" : "join",
						"button" : "subscribed",
						"prize_pool" : pending_tournament.prize_pool,
						"now" : timezone.now().isoformat(),
						"start" : pending_tournament.start_time.isoformat()
					})
					if self.tournament.status == "locked" and self.tournament.fadeout == False:
						await self.send_self({"type" : "tour.updates",
						"notification" : "start"})
		if pending_tournament == None:
			print("create too...")
			await self.send_self({
				"type" : "tour.updates",
				"update_tour_registration" : "create",
				"button" : "create",
			})
		#paying
		elif pending_tournament.status == "locked" and self.tournament == None:
			await self.send_self({
				"type" : "tour.updates",
				"update_tour_registration" : "join",
				"button" : "locked",
				"prize_pool" : pending_tournament.prize_pool,
				"now" : timezone.now().isoformat(),
				"start" : pending_tournament.start_time.isoformat()
			})
		elif self.tournament == None:
			await self.send_self({
				"type" : "tour.updates",
				"update_tour_registration" : "join",
				"button" : "join",
				"prize_pool" : pending_tournament.prize_pool,
				"now" : timezone.now().isoformat(),
				"start" : pending_tournament.start_time.isoformat()
			})

	def update_user_data(self, data):
		user_data = cache.get(f"consumer_{self.user_id}")
		# print("current user data: ", user_data)
		# print("have to add : ", data)
		if data.get("action") == "set":
			user_data[ data.get("key")] = data.get("value")

		elif data.get("action") == "append":
			if data.get("key") not in user_data:
				user_data[data.get("key")] = []
			user_data[data.get("key")].append(data.get("value"))

		elif data.get("action") == "remove":
			if data.get("key") in user_data and data.get("value") in user_data[data.get("key")]:
				user_data[data.get("key")].remove(data.get("value"))

		# print("after user data: ", user_data)				
		cache.set(f"consumer_{self.user_id}", user_data)


	async def join_channel(self, room, update = True):
		await self.channel_layer.group_add(room, self.channel_name)
		if update:
			self.update_user_data({"action":"append", "key":"rooms", "value":room})

	async def remove_channel(self, room):
		await self.channel_layer.group_discard(room, self.channel_name)
		self.update_user_data({"action":"remove", "key":"rooms", "value": room})

	async def send_channel(self, room, message):
		await self.channel_layer.group_send(room, message)

	async def send_self(self, message):
		await self.send(text_data=json.dumps(message))
	
	async def game_updates(self, event):
		if ("update_display") in event:
			await self.send(text_data=json.dumps(event))
		else :
			await self.gameChannel.game_updates(event)

	async def tour_updates(self, event):
		await self.send(text_data=json.dumps(event))

			


