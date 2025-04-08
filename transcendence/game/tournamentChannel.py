import json, asyncio, time, math
from channels.layers import get_channel_layer
from rest_framework.test import APIRequestFactory
from uuid import uuid4, uuid1
from .channels import send_message

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
#self statuses:
	#open -> can register, has not started
	#full -> can not register, has not started
	#active -> has started

class TournamentChannel():
	def __init__(self, consumer):
		global pending_tournament

		self.start_time = 15 * 60
		self.create_time = time.time()
		self.entry_price = 100
		self.prize_pool = 0
		self.tour_id = str(uuid4())
		self.room = f"registered_{self.tour_id}"
		self.activeRoom = f"tournament_{self.tour_id}"
		self.status = "open"
		self.registered_user = None
		self.confirmed_players = []
		self.total_players = 0
		self.max_players = 1024
		pending_tournament = self

	async def close_registration(self):
		global pending_tournament
		if self.status == "closed":
			return
		self.status = "closed"
		pending_tournament = None
		await consumer.send_channel("all", {
			"type" : "tour.updates",
			"button" : "create",
		})

	async def join(self, consumer):
		if self.total_players < self.max_players:
			await consumer.send_self({
				"type" : "tour.updates",
				"update_display" : "pay",
			})
		else:
			await self.close_registration()
	
	async def confirm_payment(self, consumer):
		self.total_players += 1
		self.prize_pool += self.entry_price * 0.95
		consumer.tournament = self
		await consumer.send_self({
			"type" : "tour.updates",
			"button" : "subscribed",
		})
		if self.total_players < self.max_players:
			await consumer.send_channel("all", {
				"type" : "tour.updates",
				"prize_pool": self.prize_pool,
			})
		else:
			await self.close_registration()
		if self.registered_user == None:
			self.registered_user = consumer
		await consumer.join_channel(self.room)
	
	async def notify_start(self):
		await self.close_registration()
		await self.registered_user.send_channel(self.room, {
			"type" : "tour.updates",
			"notification" : "start",
		})
	
	async def confirm_participation(self, consumer):
		self.confirmed_players.append(consumer)
		await consumer.join_channel(self.activeRoom)
	
	async def start(self):
		from .consumers import active_users
		if len(self.confirmed_players) == 0:
			return
		if len(self.confirmed_players) == 1:
			confirmed_players[0].send_message({
				"type" : "tour.updates"
				"update_display" : "refund"
				"reason" : "insufficient players"
			})
			return
		ongoing_tournaments[self.tour_id] = self
		self.state = "active"
		self.remaining_players = self.confirmed_players.copy()
		random.shuffle(self.remaining_players)
		self.current_round = 0
		self.max_rounds = math.log2(len(self.remaining_players))
		await self.matchmake()

	async def matchmake(self):
		self.current_round += 1
		self.total_matches = len(self.remaining_players) / 2 #+ len(self.remaining_players % 2)
		await self.consumer.group_send(self.activeRoom, 	{
			"type" : "tour.updates"
			"update_display" : "matchmaking rounds",
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : [self.confirmed_players[key]["alias"] for key in self.remaining_players if key in self.confirmed_players]
		})
		print("before sleep...")
		await asyncio.sleep(5)
		print('after sleep...')
		while len(remaining_players) > 1:
			await self.start_remote_game(self.remaining_players.pop(), self.remaining_players.pop())

	async def start_remote_game(self, player1, player2):
		from .playLog import new_game
		response = new_game(APIRequestFactory().post("/api/new_game/", {
			"type": "remote", 
			"userID1": player1,
			"userID2": player2,
			"alias1": player_alias[player1],
			"alias2": player_alias[player2]
			}, format='json'))
		self.confirmed_players[player1].consumer.self_send({
			"type" : "tour.updates"
			"update_display" : "start game",
			"gameID" : response["gameID"],
			"userID" : response["userID1"],
			"game-type" : "player1",
			})
		self.confirmed_players[player2].consumer.self_send({
			"type" : "tour.updates"
			"update_display" : "start game",
			"gameID" : response["gameID"],
			"userID" : response["userID2"],
			"game-type" : "player2",
			})

	async def end_remote_game(self, data):
		self.remaining_players.append(data["winner"])
		confirmed_players[data["looser"]].consumer.remove_channel(self.activeRoom)
		self.total_matches -= 1
		confirmed_players[data["looser"]].consumer.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":f"You have lost round {self.current_round}"
					"button":"exit"
				})
		if self.total_matches == 0 and len(self.remaining_players) == 1:
				self.state = "end"
				await self.finish(data["winner"])
				confirmed_players[data["winner"]].consumer.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":"You have won the tournament",
					"prize":self.prize_pool,
					"button":"exit"
				})
				#blockhain send him payment! of self.prize_pool
				return
		else
			confirmed_players[data["winner"]].consumer.send_self({
					"type":"tour.updates",
					"update_display":"end game",
					"title":f"You have won round {self.current_round}"
					"button":"wait"
				})
		if self.total_matches == 0  :
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



		

