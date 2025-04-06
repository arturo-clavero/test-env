import json, asyncio, time, math
from channels.layers import get_channel_layer
from rest_framework.test import APIRequestFactory
from uuid import uuid4, uuid1

ongoing_tournaments = {}
pending_tournament = None
class TournamentManager():
	def __init__(self):
		self.channel_layer = get_channel_layer()
		self.running_tasks = set()

	async def monitor_tournaments(self):
		while True:
			try:
				for tournamentID, tour in ongoing_tournaments.items():
					if tour.state == "pending":
						if time.time() - tour.create_time >= tour.start_time:
							tour.start()
							await self.channel_layer.group_send(f"tour_{tour.tour_ID}", {"type": "live.tournament", "current": tour})
					# elif tour.state == "active":
					# 	tour.matchmake()
				await asyncio.sleep(0.032)
			except Exception as e:
				print(f"error in tour loopL {e}")
				break

tournamentManager = TournamentManager()
player_alias = {}
entry_price = 100
class TournamentChannel():
	def __init__(self, consumer):
		global pending_tournament

		self.start_time = 15 * 60
		self.create_time = time.time()

		self.entry_price = 100
		self.prize_pool = 0

		self.tour_id = str(uuid4())
		self.room = f"tour_{self.tour_id}"
		self.status = "open"

		self.all_players = {}
		self.total_players = 0
		self.max_players = 1024

		pending_tournament = self
		print("created torunament ", self.tour_id)

	async def join(self, consumer):
		print("joined...")
		if self.total_players < self.max_players:
			self.total_players += 1
			#start timer for calling free spot
		else:
			await consumer.send_channel("all", {
				"type" : "tour.updates",
				"button" : "full",
			})
			self.status = "full"

	
	async def confirm_payment(self, consumer, alias):
		print("payment confirmed")
		self.all_players[consumer.user_id] = {
			"alias" : alias,
			"consumer" : consumer
		}
		self.prize_pool += self.entry_price
		consumer.tournament = self
		print("joined tournament ", self.tour_id)
		print("players: ", len(self.all_players))
		await consumer.join_channel(self.room)
		await consumer.send_self({
			"type" : "tour.updates",
			"button" : "subscribed",
		})
		if self.status == "full" and len(all_players) == self.max_players:
			self.status = "locked"
			pending_tournament = None
			await consumer.send_channel("all", {
				"type" : "display-tournament",
				"display" : "create",
			})
		else :
			await consumer.send_channel(self.room, {
			"type" : "tour.updates",
			"display" : "tournament",
			"action" : "update info",
			"prize_pool": self.prize_pool * .9,
		})
		#cancel timer for free spot?
	
	async def free_spot(self, consumer):
		if consumer.user_id not in all_players:
			total_players -= 1
			if self.status == "full":
				await consumer.send_channel("all", {
					"type" : "display-tournament",
					"display" : "tournament",
					"button" : "join",
				})
				self.status = "open"
	
	async def start(self):
		from .consumers import active_users
		ongoing_tournaments[self.tour_id] = self
		self.state = "start"
		self.price_pool *= 0.9
		self.remaining_players = [key for key in self.all_players if key in active_users]
		random.shuffle(self.remaining_players)
		self.current_round = 0
		self.max_rounds = math.log2(len(self.remaining_players))
		await self.matchmake()

	async def matchmake(self):
		self.current_round += 1
		self.total_matches = len(self.remaining_players) / 2 #+ len(self.remaining_players % 2)
		await self.consumer.group_send(self.room, 	{
			"type" : "matchmaking rounds",
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : [self.all_players[key]["alias"] for key in self.remaining_players if key in self.all_players]
		})
		print("before sleep...")
		await asyncio.sleep(5)
		print('after sleep...')
		while len(remaining_players) > 1:
			await self.start_remote_game(self.remaining_players.pop(), self.remaining_players.pop())

	async def start_remote_game(self, player1, player2):
		from .playLog import new_game
		request = APIRequestFactory().post("/api/new_game/", {
			"type": "remote", 
			"userID1": player1,
			"userID2": player2,
			"alias1": player_alias[player1],
			"alias2": player_alias[player2]
			}, format='json')
		response = new_game(request)
		self.all_players[player1].consumer.self_send(room, {
			"request" : "start tournament game",
			"gameID" : response["gameID"],
			"userID" : response["userID"],
			"type" : "player1",
			})
		self.all_players[player2].consumer.self_send(room, {
			"request" : "start tournament game",
			"gameID" : response["gameID"],
			"userID" : response["userID"],
			"type" : "player2",
			})

	async def end_remote_game(self, data):
		self.remaining_players.append(data["winner"])
		self.total_matches -= 1
		if self.total_matches == 0:
			if len(self.remaining_players) == 1:
				self.state = "end"
				await self.finish(data["winner"])
			else :
				await self.matchmake()

	async def finish(self, winner):
		results = {
			"winner" : winner,
			"participants" : self.all_players_alias,
			"prize pool" : self.prize_pool
		}
		# store_tournament_results(results)
		if self.status == "active":
			remaining_players.remove(self.consumer.user_id)
		self.state == "end"
		del ongoing_tournaments[self.tour_id]
		await self.consumer.remove_channel(self.room)

	async def disconnect(self):
		if self.status == "active":
			remaining_players.remove(self.consumer.user_id)
			await self.consumer.remove_channel(self.room)



		

