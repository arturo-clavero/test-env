import json, asyncio, time, logging
import numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .playLog import get_max_players, get_player_alias, store_game_results
from .game import Game

logger = logging.getLogger(__name__)

# player_sesions = {}
# tournament_sesions = {}
# loop_running = False
# gameManager = GameManager()

# def register_player(user, gameID= None, tournamentID = None):
# 	if user not in player_sesions:
# 		player_sesions[user] = {}
# 	if game_id is not None:
# 		player_sesions[user]["gameID"] = gameID
# 	if tournament_id is not None:
# 		player_sesions[user]["tournamentID"] = tournamentID

# def remove_player(user):
# 	player_data = player_sesions.pop(user, None)
# 	if player_data is not None:
#     if "gameID" in player_data:
#         game_session = game_sessions.get(player_data["gameID"], None)
#         if session:
#             game_session.disconnect()
# 	if "tournamentID" in player_data:
#         tournament_sesion = tournament_sesions.get(player_data["gametournamentIDID"], None)
#         if tournament_sesion:
#             tournament_sesion.disconnect()

game_sessions = {}
game_channels = {}

async def game_consumer(data, socket, user, gameID):
	game_session = game_sessions[gameID, None]
	if "request" in data:
		if data["request"] == "start game":
			if game_session is None:
				game_session = GameSession(socket, gameID)
			game_session.register(socket, user)
			game_channels[user] = socket
		elif data["request"] == "update paddles":
			game_session.game_logic.update_paddles(data)
	elif "boundaries" in data:
		game_session.dimensions = data["boundaries"]
	
async def braodcast(message, channel)

async def send(message, user)

class GameSession(){
	async def __init__(self, socket, gameID):
		global loop_running, gameManager
		game_sessions[gameID] = self
		self.gameID = gameID
		self.max_players = get_max_players(gameID)
		self.players = []
		self.pending_start_time = time.time()
		self.dimensions = {"x" : 0, "y": 0}
		if loop_running == False:
			self.game_state_task = asyncio.create_task(gameManager.broadcast_game_state())
			loop_running = True
		await socket.channel_layer.group_add(f"game_{gameID}", socket.channel_name)
		self.channel_layer = socket.channel_layer
	
	def register(user):
		self.players.append(user)
		total_players = len(self.players)
		if total_players < self.max_players:
			self.status = "pending"
		elif total_players == self.max_players:
			self.status = "active"
			self.start_game(socket, user)
		elif total_players > self.max_players:
			self.disconnect(socket, user)

	async def disconnect(user):
		self.players.remove(user)
		self.end_game(user, "player disconnected from game")

	async def start_game(user):
		self.active_start_time = time.time() 
		self.game_logic = Game(self.gameID)
		names = get_player_alias(self.gameID)
		await self.channel_layer.group_send(f"game_{self.gameID}", 
		{
			"type": "game.updates", 
			"updates": {
				"state" : "player names", 
				"name1" : names[0], 
				"name2" : names[1]
			}
		})

	async def update(user):
		updates = self.game_logic.update_state()
		if updates:
			await self.channel_layer.group_send(f"game_{gameID}", 
			{
				"type": "game.updates", 
				"updates": updates
			})
			if updates["state"] == "game end":
				self.end_game()

	async def end_game(error):
		results = {
			"score1": self.game_logic.paddles[-1].score,
			"score2": self.game_logic.paddles[1].score,
			"start_time": self.active_start_time,
			"type": "game end",
			"error": error if error else None
		}
		if results["score1"] > results["score2"]:
			looser = self.game_logic.player1
			winner= self.game_logic.player2
		elif results["score2"] > results["score1"]:
			looser = self.game_logic.player2
			winner= self.game_logic.player1
		elif error 
			looser = user
			self.players.remove(user)
			winner = self.players[0]
		results.update({
			"looser": looser,
			"winner": winner
		})
		store_game_results({results})
		# await self.channel_layer.group_send(f"game_{self.gameID}",
		# {
		# 	"type": "game.updates",
		# 	"updates" : {results}
		# })
		# broadcast(results)
		del game_sessions[self.gameID]
}



class GameManager():
	def __init__(self):
		self.channel_layer = get_channel_layer()
		self.pending_timeout = 20

	async def broadcast_game_state(self):
		while True:
			try:
				for gameID, game_session in game_sessions:
					if game_session.status == "active":
						game_session.update()
					elif game_session.status == "pending":
						if time.time() - game_session.pending_start_time > self.pending_timeout:
							game_session.end_game()

				await asyncio.sleep(0.016)
			except Exception as e:
				print(f"Error in game loop: {e}")
				break

gameManager = GameManager()
asyncio.create_task(gameManager.broadcast_game_state())
