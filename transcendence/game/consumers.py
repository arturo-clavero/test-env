import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import Game
import asyncio
import time
from channels.layers import get_channel_layer
from .playLog import get_max_players
from .playLog import get_player_alias
from .playLog import store_game_results
import numpy as np

import logging

logger = logging.getLogger(__name__)


active_sessions = {}
pending_sessions = {}
active_connections = {}
players = {}
loop_running = False

class GameManager():
	def __init__(self):
		self.channel_layer = get_channel_layer()
		self.pending_timeout = 100

	async def broadcast_game_state(self):
		while True:
			try:
				for gameID, game in active_sessions.items():
					updates = game.update_state()
					if updates:
						await self.channel_layer.group_send(f"game_{gameID}", {"type": "game.updates", "updates": updates})
						if updates["state"] == "game end":
							store_game_results({"score1" : updates["score1"], "score2" : updates["score2"], "start_time" : game.start_time, "gameID" : gameID,})
							del active_sessions[gameID]
							if gameID in active_sessions:
								del pending_sessions[gameID]
							break
				for gameID, start_time in pending_sessions.items():
					if gameID in active_sessions:
						del pending_sessions[gameID]
						break
					if time.time() - start_time > self.pending_timeout:
						await self.channel_layer.group_send(f"game_{gameID}", {"type": "game.updates", "updates": {"state" : "error", "info" : "oponent did not join the game", "score1":"", "score2":"", "start_time": start_time}})
						del pending_sessions[gameID]
						break 

				await asyncio.sleep(0.016)  # ~60 updates per second
			except Exception as e:
				print(f"Error in game loop: {e}")
				break

gameManager = GameManager()

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		global loop_running, gameManager
		print("websocket connected!")
		self.gameID = self.scope['url_route']['kwargs']['game_id']
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		self.reconnected = False
		self.initdata = {}
		self.manage_user_multitab()
		self.dimensions = {"x" : 0, "y": 0}
		await self.channel_layer.group_add(f"game_{self.gameID}", self.channel_name)
		await self.accept()
		await self.verify_user()
		print("loop running? ", loop_running)
		if loop_running == False:
			self.game_state_task = asyncio.create_task(gameManager.broadcast_game_state())
			loop_running = True

	async def verify_user(self):
		if self.gameID not in players:
			players[self.gameID] = {"connected" : 0, "ready" : 0}
		self.max_players = get_max_players(self.gameID)
		players[self.gameID]["connected"] += 1
		if players[self.gameID]["connected"] > self.max_players:
			self.disconnect()
		
	async def manage_user_multitab(self):
		if self.user_id in active_connections:
			old_connection = active_connections[self.user_id]
			if self.gameID in active_sessions:
				self.old_game = active_sessions[self.gameID]
				self.reconnected = True
			await old_connection.close()
		else:
			active_connections[self.user_id] = self

	async def disconnect(self, code):
		# print("disconnect")
		if self.user_id in active_connections:
			del active_connections[self.user_id]
		if self.gameID in active_sessions:
			if active_sessions[self.gameID].active == True:
				await self.channel_layer.group_send(f"game_{self.gameID}", {"type": "game.updates", "updates": {"state" : "error", "info" : "player disconnected from game", "score1" : active_sessions[self.gameID].paddles[-1].score, "score2":active_sessions[self.gameID].paddles[1].score, "start_time":active_sessions[self.gameID].start_time}})
			del active_sessions[self.gameID]
			if self.gameID in pending_sessions:
				del pending_sessions[self.gameID]
		elif self.gameID in pending_sessions:
			store_game_results({"error":"player disconnected in waiting room", "looser": self.user_id, "gameID":self.gameID, "score1" : "", "score2" : "", "start_time": pending_sessions[self.gameID]})
			del pending_sessions[self.gameID]
		players[self.gameID]["connected"] -= 1
		players[self.gameID]["ready"] -= 1
		if players[self.gameID]["connected"] == 0:
			del players[self.gameID]
		await self.channel_layer.group_discard(f"game_{self.gameID}", self.channel_name)

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
