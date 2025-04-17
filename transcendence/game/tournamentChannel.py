import json, asyncio, time, math, random
from channels.layers import get_channel_layer
from rest_framework.test import APIRequestFactory
from uuid import uuid4, uuid1
from django.utils import timezone
from django.core.cache import cache

#constants
waitTime = 30
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
		self.waiting_players = []
		self.remaining_players = {}
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
				self.remaining_players[user.user_id] = user
				self.waiting_players.append(user.user_id)
				await user.join_channel(self.remainingRoom)
			else:
				print("user not in active users")
				print("active users: ", active_users)
		if len(self.remaining_players) == 1:
			last = next(iter(self.remaining_players))
			await last.send_self({"type" : "tour.updates",
				"update_display" : "refund", "reason" : "insufficient players"})
			await last.remove_channel(self.remainingRoom)
		if len(self.remaining_players) <= 1:
			TournamentManager().remove_tournament(self.tour_id, _token)
			return
		self.status = "active"
		random.shuffle(self.waiting_players)
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
		self.status = "matchmake"
		self.current_round += 1
		self.now_playing = {}
		self.total_matches = len(self.waiting_players) // 2 #+ len(self.remaining_players % 2)
		players = [get_alias(user) for user in self.waiting_players]
		await get_channel_layer().group_send(f"{self.remainingRoom}", {
			"type" : "tour.updates",
			"update_display" : "matchmaking rounds",
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : players
		})
		await asyncio.sleep(7)
		print("end matchmake")
		while len(self.waiting_players) >= 2:
			await self.start_remote_game(self.waiting_players.pop(), self.waiting_players.pop())
		if len(self.waiting_players) == 1 and len(self.remaining_players > 1):
			await self.remaining_players[0].send_self({"type": "tour.updates",
			"update_display" : 'waiting'})
		elif len(self.waiting_players) == 1 and len(self.remaining_players <= 1):
			print("send message to win automatically")
			#send message players disconnected ? TODO
			await self.remaining_players[0].send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"error" : "player disconnected",
					"title":"CHAMPION!",
					"prize":self.prize_pool,
					"button":"exit",
				})
			await self.finish(self.remaining_players[0])
		self.status == "active"
	
	def _split_players(self, *players):
		connected = []
		disconnected = []
		for player in players:
			if player in self.remaining_players:
				connected.append(player)
			else:
				disconnected.append(player)
		return connected, disconnected

	async def start_remote_game(self, player1, player2):
		from .playLog import new_game
		connected, disconnected = self._split_players(player1, player2)

		if len(connected) == 2:
			print("start remote game")
			await new_game({
				"type": "remote", 
				"userID1": player1,
				"userID2": player2,
				"tour_id": self.tour_id,
			})
		else:
			await self.end_remote_game({
				"losers": disconnected,
				"winners": connected,
				"error": "Player disconnected",
			})

	async def end_remote_game(self, data):
		print("end remote game")
		#bye bye loosers
		for loser_id in data.get("losers", []):
			print("looser: ", loser_id)
			loser = self.remaining_players.get(loser_id)
			if not loser:
				continue
			print("looser confirmed")
			await loser.remove_channel(self.remainingRoom)
			loser.update_self_tournament(None)
			del self.remaining_players[loser_id]
			self.total_matches -= 1
			print("looser end game msg")
			await loser.send_self({
				"type": "tour.updates",
				"update_display": "end game",
				"title": f"You have lost round {self.current_round}",
				"button": "exit",
			})
		#is it final winner?
		if self.total_matches == 0 and len(self.remaining_players) == 1:
			print("final winner...")
			self.state = "end"
			remaining_winner = next(iter(self.remaining_players))
			await remaining_winner.send_self({
				"type": "tour.updates",
				"update_display": "end game",
				"title": "CHAMPION!",
				"error": data.get("error", ""),
				"prize": self.prize_pool,
				"button": "exit",
			})
			await self.finish(remaining_winner)
			# TODO: Send blockchain prize payment here
			return
		#false alarm still more rounds to go ...
		for winner_id in data.get("winners", []):
			winner = self.remaining_players.get(winner_id)
			if not winner:
				continue
			self.waiting_players.append(winner_id)
			await winner.send_self({
				"type": "tour.updates",
				"update_display": "end game",
				"title": f"won round {self.current_round}",
				"error": data.get("error", ""),
				"button": "wait",
			})
		#ready for next round?
		if self.total_matches == 0:
			await self.matchmake()

	async def finish(self, winner):
		global _token

		results = {
			"winner" : winner.user_id,
			"participants" : self.registered_players,
			"prize pool" : self.prize_pool,
		}
		# store_tournament_results(results)
		winner.remove_channel(self.remainingRoom)
		winner.update_self_tournament(None)
		self.status = "end"
		TournamentManager().remove_tournament(self.tour_id, _token)

	async def disconnect(self, consumer):
		print("touranment disconnect")
		# if self.status == "active":
		if consumer in self.remaining_players:
			self.remaining_players.remove(consumer)
		await consumer.remove_channel(self.remainingRoom)
		consumer.update_self_tournament(None)
		if self.status != "matchmake":
			self.waiting_players,remove(consumer.user_id)