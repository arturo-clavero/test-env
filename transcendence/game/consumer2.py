import random

all_players = {}
remaining_players = {}
remaining_rounds = {}
active_tournaments = {}

class TourManager():
	def __init__(self):
		self.channel_layer = get_channel_layer()
		self.running_tasks = set()

	async def matchmaking(self):
		while True:
			try:
				

				await asyncio.sleep(0.016)  # ~60 updates per second
			except Exception as e:
				print(f"Error in tour loop: {e}")
				break

tourManager = TourManager()
queue = []
max_players = 8

active_tournaments = {}
class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		global active_tournaments
		self.tour_id = self.scope['url_route']['kwargs']['tour_id']
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		self.alias = self.scope['url_route']['kwargs']['alias']
		self.tournament = active_tournaments.get(self.tour_id, Tournament[self.tour_id])
		if self.tournament.add_player(self.user_id, self) == "full":
			next_tournament(self.tour_id)
			return
		await self.channel_layer.group_add(f"tournament_{self.tour_id}", self.channel_name)
		accept()

	async def disconnect(self):
		if self.tournament.status == "pending":
			self.tournament.all_players.remove(self.user_id)
		elif self.tournament.status == "active":
			self.tournament.remaining_players.remove(self.user_id)
		self.tournament.sockets.pop(self)

class Tournament():
	def __init__(self, tour_id):
		self.id = tour_id
		self.all_players = []
		self.remaining_players = []
		self.state = "pending"
		self.sockets = {}
		self.total_matches = 0
		self.current_round = 0
		self.max_rounds = 3
		self.immunity

	def add_player(self, user_id, socket):
		global max_players
		if self.all_players + 1 > max_players:
			if self.status == "pending":
				self.start()
			return "full"
		self.all_players.append(user_id)
		self.sockets[user_id] = socket
		if self.all_players + 1 == max_players:
			self.start()

	def start(self):
		self.state = "active"
		self.remaining_players = self.all_players.copy()
		await self.matchmaking()

	def matchmaking():
		random.shuffle(self.remaining_players)
		self.total_matches = len(self.remaining_players) + len(self.remaining_players % 2)
		self.current_round += 1
		self.socket[0].channel_layer.group_send(f"tour_"{self.tour_id}, {
			"type" : "matchmaking rounds"
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : self.remaining_players,
		})
		#now wait 5 seconds
		while len(self.remaining_players) > 0:
			player1_id = self.remaining_players.pop()
			player1_alias = self.sockets[player1_id].alias
			if len(self.remaining_players ) == 1:
				player2_id = player1_id
				player2_alias = "AI"
				match_type = "AI"
			else : 
				player2_id = self.remaining_players.pop()
				player2_alias = self.sockets[player2_id].alias
				match_type = "remote"
			game_id = log_match(player1_id, player2_id, player1_alias, player2_alias, match_type)
			self.sockets[player1_id].send({
				"type" : "start match",
				"game type": match_type,
				"user alias" : player1_alias,
				"opponent" : player2_alias,
			})
			self.sockets[player2_id].send({
				"type" : "start match",
				"game type": match_type,
				"user alias" : player2_alias,
				"opponent" : player1_alias,
			})
	
	def match_output(data):
		winner = data.get("winner")
		self.remaining_players.append(winner)
		if (data.get("match_type") == "AI" )
			
		self.total_matches -= 1

	async def matchmake(self):
		global remaining_players, remaining_rounds
		random.shuffle(remaining_players[self.tour_id])
		remaining_rounds[self.tour_id] = len(remaining_players) + len(remaining_players) % 2
		async def broadcast_next_rounds()
		# wait 5 seconds
		while (remaining_players)

	async def receive(self, text_data):

	

	async def receive(self, text_data):
		data = json.loads(text_data)
		print("data received: ", data)
		if "boundaries" in data:
			self.dimensions = data["boundaries"]
		if "request" in data:
			if data["request"] == "start game":
				await self.start_game()
			if data["request"] == "update paddles":
				active_sessions[self.gameID].update_paddles(data)

	async def start_game(self):
		players[self.gameID]["ready"] += 1
		if self.reconnected == True:
			active_sessions[self.gameID] = self.old_game
			active_connections[self.user_id] = self
			ready_connections[self.gameID] += 1
		if players[self.gameID]["ready"] == self.max_players:
			active_sessions[self.gameID] = Game(self.gameID)
			names = get_player_alias(self.gameID)
			await self.channel_layer.group_send(f"game_{self.gameID}", {"type": "game.updates", "updates": {"state" : "player names", "name1" : names[0], "name2" : names[1]}})
		else:
			pending_sessions[self.gameID] = time.time()
		
	async def game_updates(self, event):
		updates = event["updates"]
		if (updates["state"] == "error"):
			await self.send(text_data=json.dumps({
							"type": "game update",
							"updates": {"state" : updates["state"], "info" : updates["info"]}
						}))
			store_game_results({"error":updates["info"], "winner": self.user_id, "gameID":self.gameID, "score1" : updates["score1"], "score2" : updates["score2"], "start_time": updates["start_time"]})
			self.disconnect
		elif (updates["state"] == "playing" or updates["state"] == "game end"):
			await self.send(text_data=json.dumps({
							"type": "game update",
							"updates": {
								"ball" : {
									"x" : updates["x"][0]  * self.dimensions["x"], 
									"y" : updates["y"][0] * self.dimensions["y"],
								},
								"paddle_left" : updates["y"][1] * self.dimensions["y"],
								"paddle_right" : updates["y"][2] * self.dimensions["y"],
								"score1" : updates["score1"],
								"score2" : updates["score2"],
								"state" : updates["state"],
							}
						}))
			if (updates["state"] == "game end"):
				self.disconnect
		else:
			await self.send(text_data=json.dumps({
							"type": "game update",
							"updates": updates,
						}))
