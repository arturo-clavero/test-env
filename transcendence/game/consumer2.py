import random
import asyncio

from consumer2.py import new_game
from tournamentLog.py import next_tournament

all_players = {}
remaining_players = {}
active_tournaments = {}
queue = []
max_players = 8
active_tournaments = {}

class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		global active_tournaments
		self.tour_id = self.scope['url_route']['kwargs']['tour_id']
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		self.alias = self.scope['url_route']['kwargs']['alias']
		self.tournament = active_tournaments.get(self.tour_id, None)
		if not self.tournament:
			self.tournament = Tournament(self.tour_id)
			active_tournaments[self.tour_id] = self.tournament
		if self.tournament.add_player(self.user_id, self) == "full":
			next_tournament(self.tour_id)
			return
		await self.channel_layer.group_add(f"tournament_{self.tour_id}", self.channel_name)
		accept()

	async def disconnect(self, _):
		if self.tournament.status == "pending":
			self.tournament.all_players.remove(self.user_id)
		elif self.tournament.status == "active":
			self.tournament.remaining_players.remove(self.user_id)
		self.tournament.sockets.pop(self.user_id, None)

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
		self.immunity = {}

	def add_player(self, user_id, socket):
		global max_players
		if len(self.all_players) + 1 > max_players:
			if self.status == "pending":
				self.start()
			return "full"
		self.all_players.append(user_id)
		self.sockets[user_id] = socket
		if len(self.all_players) + 1 == max_players:
			self.start()

	async def start(self):
		self.state = "active"
		self.remaining_players = self.all_players.copy()
		await self.matchmaking()

	async def matchmaking(self):
		while True:
			random.shuffle(self.remaining_players)
			if len(self.remaining_players) % 2 == 0 or self.remaining_players[-1] not in self.immunity:
				break
		self.total_matches = len(self.remaining_players) / 2 + len(self.remaining_players % 2)
		self.current_round += 1
		await self.sockets[0].channel_layer.group_send(f"tour_"{self.tour_id}, {
			"type" : "matchmaking rounds"
			"total matches" : self.total_matches,
			"current round" : self.current_round,
			"max rounds" : self.max_rounds,
			"players" : self.remaining_players,
		})
		await asyncio.sleep(5)
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
			result = new_game({
				"type": match_type,
				"userID1": player1_id,
				"userID2": player2_id,
				"alias1" : player1_username,
				"alias2" : player2_username,
				})
			await self.sockets[player1_id].send({
				"type" : "start match",
				"game type": match_type,
				"user alias" : player1_alias,
				"opponent" : player2_alias,
				"game id": result.get("gameID")
			})
			await self.sockets[player2_id].send({
				"type" : "start match",
				"game type": match_type,
				"user alias" : player2_alias,
				"opponent" : player1_alias,
				"game id": result.get("gameID")
			})
	
	async def match_output(self, data):
		winner = data.get("winner")
		self.remaining_players.append(winner)
		if data.get("match_type") == "AI":
			if winner not in self.immunity:
				self.immunity[winner] = 1
			else:
				self.immunity[winner] += 1
		looser = data.get("looser")
		if looser in self.immunity:
			self.immunity[looser] -= 1
			if self.immunity[looser] == 0:
				del self.immunity[looser]
			self.remaining_players.append(looser)
		self.total_matches -= 1
		if self.total_matches == 0:
			if len(self.remaining_players) > 1:
				await self.matchmake()
			else:
				await self.end_tournament(self.sockets[self.remaining_players[0]])
	
	async def end_tournament(self, winner):
		await winner.send({
			"type" : "won tournament"
		})
		store_tournament_results({
			"tournament id" : self.tour_id,
			"players" : self.all_players,
			"winner" : self.remaining_players[0],
		})
		del active_tournaments[self.tour_id]
