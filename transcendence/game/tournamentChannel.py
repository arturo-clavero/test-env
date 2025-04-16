import json, asyncio, time, math, random
from channels.layers import get_channel_layer
from rest_framework.test import APIRequestFactory
from uuid import uuid4, uuid1
from django.utils import timezone
from django.core.cache import cache

#constants
waitTime = 15
notificationTime = 5
entry_price = 100
max_players = 1024
min_players = 2

_token = object()

#plaeholder TODO
def get_alias(user):
	print("aslias for ", user)
	return ("alias 0")

class TournamentManager:	
	_instance = None
	_auth_token = _token

	def __new__(cls):
		if cls._instance is None:
			cls._instance = super(TournamentManager, cls).__new__(cls)
			cls._instance._tournaments = {}
		return cls._instance

	def _check_access(self, token):
		if token is not self._auth_token:
			raise PermissionError("Unauthorized access to TournamentManager.")

	def get(self):
		return self._tournaments

	def get_tournament(self, tournament_id = None):
		print("get tournametn: ", tournament_id)
		if tournament_id == None:
			return None
		return self._tournaments[tournament_id]

	def add_tournament(self, tournament_obj, token = None):
		self._check_access(token)
		self._tournaments[tournament_obj.tour_id] = tournament_obj

	def remove_tournament(self, tournament_id, token = None):
		self._check_access(token)
		del self._tournaments[tournament_id]

class TournamentChannel():
	def __init__(self, consumer):
		global waitTime, _token

		self.prize_pool = 0
		self.tour_id = str(uuid4())
		self.registeredRoom = f"registered_tour_{self.tour_id}"
		self.remainingRoom = f"remaining_tour_{self.tour_id}"
		self.status = "open"
		self.registered_players = []
		self.remaining_players = []
		self.remaining_room_confirmed = 0
		cache.set("pending_tournament", self.tour_id)
		TournamentManager().add_tournament(self, _token)
		self.start_time = timezone.now() + timezone.timedelta(seconds=waitTime)

	async def join(self, consumer):
		global max_players

		if len(self.registered_players) < max_players:
			await consumer.send_self({"type" : "tour.updates",
			"update_display" : "pay", "tour_id" : self.tour_id})
		else:
			await get_channel_layer().group_send("all", {"type" : "tour.updates",
			"update_tour_registration" : "join", "button" : "full"})
	
	async def confirm_payment(self, consumer):
		global entry_price, max_players

		print("appending this man ", consumer.user_id)
		print("to ", self.tour_id)
		print("registered plaeyrs before; ", len(self.registered_players))
		self.registered_players.append(consumer)
		print("registered plaeyrs after; ", len(self.registered_players))
		self.prize_pool += entry_price * 0.95
		await consumer.send_self({ "type" : "tour.updates",
			"update_tour_registration" : "join", "button" : "subscribed", "id":self.tour_id})
		if len(self.registered_players) < max_players:
			await get_channel_layer().group_send("all", {"type" : "tour.updates",
			"update_tour_registration" : "join", "prize_pool": self.prize_pool})
		else:
			await get_channel_layer().group_send("all", {"type" : "tour.updates",
			"update_tour_registration" : "join",  "button" : "full", "prize_pool": self.prize_pool})
		await consumer.join_channel(self.registeredRoom)
		consumer.update_self_tournament(self.tour_id)
	
	async def notify_start(self):
		global waitTime, notificationTime

		await asyncio.sleep(waitTime - notificationTime)
		self.status = "locked"
		if len(self.registered_players) > 0:
			await get_channel_layer().group_send(f"{self.registeredRoom}", {"type" : "tour.updates",
				"notification" : "start", "length" : notificationTime})
		await get_channel_layer().group_send("all", {"type" : "tour.updates",
			"update_tour_registration" : "join", "button" : "locked"})
	
	async def start(self):
		global waitTime, min_players, _token

		await asyncio.sleep(waitTime)
		active_users = cache.get('active_users')
		if active_users == None:
			active_users = []
		print("active users in start tour" , active_users)
		cache.delete("pending_tournament")
		await get_channel_layer().group_send("all", {"type" : "tour.updates",
			"update_tour_registration" : "create", "button" : "create"})
		for user in self.registered_players:
			print("checking user ", user)
			if user.user_id in active_users:
				print("user in active_users")
				self.remaining_players.append(user)
				await user.join_channel(self.remainingRoom)
			else:
				print("user not in active users")
				print("active users: ", active_users)
		if len(self.remaining_players) == 1:
			await self.remaining_players[0].send_self({"type" : "tour.updates",
				"update_display" : "refund", "reason" : "insufficient players"})
			await self.remaining_players[0].remove_channel(self.remainingRoom)
		if len(self.remaining_players) <= 1:
			TournamentManager().remove_tournament(self.tour_id, _token)
			return
		self.status = "active"
		random.shuffle(self.remaining_players)
		self.current_round = 0
		self.max_rounds = math.ceil(math.log2(len(self.remaining_players)))
		await self.matchmake()
	
	async def matchmake(self):
		print("mathmake!!")
		print("mathmake!!")
		print("mathmake!!")
		print("mathmake!!")
		print("mathmake!!")
		print("mathmake!!")
		print("mathmake!!")
		self.current_round += 1
		self.now_playing = {}
		self.total_matches = len(self.remaining_players) // 2 #+ len(self.remaining_players % 2)
		players = [get_alias(user) for user in self.remaining_players]
		await get_channel_layer().group_send(f"{self.remainingRoom}", {
			"type" : "tour.updates",
			"update_display" : "matchmaking rounds",
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : players
		})
		await asyncio.sleep(15)
		print("end matchmake")
		while len(self.remaining_players) >= 2:
			await self.start_remote_game(self.remaining_players.pop(), self.remaining_players.pop())
		if len(self.remaining_players) == 1 : # and self.total_matches > 1:
			await self.remaining_players[0].send_self({"type": "tour.updates",
			"update_display" : 'waiting'})
		# elif len(self.remaining_players) == 1:
		# 	#send message players disconnected ? TODO
		# 	await self.remaining_players[0].send_self({
		# 			"type":"tour.updates",
		# 			"update_display":"end game",
		# 			"title":"CHAMPION!",
		# 			"prize":self.prize_pool,
		# 			"button":"exit",
		# 		})
		# 	await self.finish(self.remaining_players[0])

	async def start_remote_game(self, player1, player2):
		from .playLog import new_game
		self.now_playing[player1.user_id] = player1
		self.now_playing[player2.user_id] = player2
		print("start remote game")
		await new_game({
			"type": "remote", 
			"userID1": player1.user_id,
			"userID2": player2.user_id,
			"tour_id": self.tour_id,
		})

	async def end_remote_game(self, data):
		print("end remote game")
		winner = self.now_playing[data["winner"]]
		self.remaining_players.append(winner)
		looser = self.now_playing[data["looser"]]
		await looser.remove_channel(self.remainingRoom)
		looser.tournament = None
		#looser remove from player_alias
		self.total_matches -= 1
		await looser.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":f"You have lost round {self.current_round}",
					"button":"exit",
				})
		if self.total_matches == 0 and len(self.remaining_players) == 1:
				self.state = "end"
				await winner.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":"CHAMPION!",
					"prize":self.prize_pool,
					"button":"exit",
				})
				await self.finish(winner)
				#blockhain send him payment! of self.prize_pool
				return
		else :
			await winner.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":f"won round {self.current_round}",
					"button":"wait",
				})
		if self.total_matches == 0 :
			await self.matchmake()

	async def finish(self, winner):
		global _token

		print("finish 0")
		results = {
			"winner" : winner.user_id,
			"participants" : self.registered_players,
			"prize pool" : self.prize_pool,
		}
		print("finish 1")
		# store_tournament_results(results)
		winner.remove_channel(self.remainingRoom)
		print("finish 2")
		winner.update_self_tournament(None)
		print("finish 3")
		self.state == "end"
		print("manager remove...")
		TournamentManager().remove_tournament(self.tour_id, _token)
		print("finish 4")

	async def disconnect(self, consumer):
		if self.status == "active":
			if consumer in self.remaining_players:
				self.remaining_players.remove(consumer)
			await consumer.remove_channel(self.remainingRoom)
			consumer.update_self_tournament(None)