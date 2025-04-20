from .registration import get_expected_players, store_game_results
import json, asyncio, time
from .logic_main import GameLogic
from channels.layers import get_channel_layer
import asyncio

class GameManager:
	_instance = None

	def __new__(cls):
		if cls._instance is None:
			cls._instance = super(GameManager, cls).__new__(cls)
			cls._instance._active_games = []
			cls._instance._finished_games = []
			cls._instance._new_games = []
			cls._instance._new_games_lock = asyncio.Lock()
			cls._instance._finished_games_lock = asyncio.Lock()
			asyncio.create_task(cls._instance._routine())
			print("start task routine")
		return cls._instance

	def get_game(self, game_id=None):
		for game in self._active_games:
			if game.id == game_id:
				return game
		return None

	async def add_game(self, game):
		async with self._new_games_lock:
			self._new_games.append(game)

	async def delete_game(self, game):
		async with self._finished_games_lock:
			self._finished_games.append(game)
		print("deleted game!")

	async def _routine(self):
		print("start routine")
		while True:
			try:
				async with self._new_games_lock:
					# add new games to active
					if self._new_games:
						self._active_games.extend(self._new_games)
						self._new_games.clear()

				async with self._finished_games_lock:
					# remove finished games from active
					for game in self._finished_games:
						print("attempt to delete")
						if game in self._active_games:
							print("Delete!")
							self._active_games.remove(game)
					self._finished_games.clear()


				# check active
				for game in self._active_games:
					if game.status == "pending":
						await game.check_pending()
					elif game.status == "active":
						await game.logic_updates()

				await asyncio.sleep(0.016) #breathing room 

			except Exception as e:
				print(f"Error in game loop: {e}")
				break

class GameChannel():
	def __init__(self, consumer, game_id):
		game_exists = GameManager().get_game(game_id)
		if game_exists:
			if game_exists.join(consumer):
				return game_exists
			return None
		self.game_id = game_id
		self.room = f"game_{game_id}"
		self.active_players = []
		self.disconnected_players = []
		self.expected_players_id = get_expected_players(game_id, "id")
		self.names = get_expected_players(game_id, "alias")
		print(self.expected_players_id)
		print(self.names)
		self.status = "pending"
		self.start_time = None
		self.logic = None

	async def join(self, consumer):
		print("wants to join")
		if self.status == "finished":
			print("wrong status")
			return False
		if int(consumer.user_id) not in [int(x) for x in self.expected_players_id]:
			print("wrogn user id")			
			return False
		print("can join")
		#get start time for pending tracking:
		if self.start_time == None:
			self.start_time = time.time()
		#add player:
		self.active_players.append(consumer.user_id)
		await consumer.join_channel(self.room)
		consumer.update_user_data({"action":"set", "key":"game", "value":self.game_id})
		#check to start game
		if len(self.active_players) == len(self.expected_players_id) and self.status == "pending":
			await self.start_game()
		return True
	
	async def check_pending(self):
		global max_pending_time

		if self.start_time - time.time() > max_pending_time:
			self.error_end("player did not join")
	
	async def start_game(self):
		self.status = "active"
		await get_channel_layer().group_send(self.room, {"type": "game.updates", 
			"state" : "player names", 
			"name1" : self.names[0], 
			"name2" : self.names[1],
		})
		self.logic = GameLogic(self.game_id)
		print("cehck?")
		await GameManager().add_game(self)

	async def logic_updates(self):
		updates = self.logic.update_state()
		if updates:
			# print("updates: ", updates)
			await get_channel_layer().group_send(self.room, {"type" : "game.updates",
			"updates" : updates})
			if updates["state"] == "game end":
				print("GAME END")
				store_game_results({
					"score1":updates["score1"],
					"score2":updates["score2"],
					"start_time" : self.logic.start_time,
					"gameID" : self.game_id,
					"connected" : self.active_players,
					"error" : updates.get("error", ""),
				})
				await self.finish()

	async def finish(self):
		if self.status == "finished":
			print("already finished in finsih...")
			return
		self.status = "finished"
		await GameManager().delete_game(self)
		await get_channel_layer().group_send(self.room, {"type" : "game.updates",
		"action" : "delete game"})
	
	async def disconnect(self, consumer):
		if self.status == "finished":
			return
		self.active_players.remove(consumer.user_id)
		await consumer.remove_channel(self.room)
		self.disconnected_players.append(consumer.user_id)
		await self.error_end("player disconnected")

	async def error_end(self, error):
		if self.status == "finished":
			print("already finished in error")
			return
		store_game_results({
				"error": error,
				"gameID" : self.game_id,
				"start_time" : self.logic.start_time,
				"looser" : self.disconnected_players[0],
				"score1" : "",
				"score2" : "",
			})
		await get_channel_layer().group_send(self.room, {"type" : "game.updates",
			"error" : error,
			"game end" : True,
		})
		await self.finish()


