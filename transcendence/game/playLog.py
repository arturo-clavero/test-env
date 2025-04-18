
from rest_framework.decorators import api_view
from rest_framework.response import Response
from uuid import uuid4, uuid1
from django.core.cache import cache
from .tournamentChannel import TournamentManager
from channels.layers import get_channel_layer

async def new_game(data):
	print("new game log")
	log = create_new_log()
	log['type'] = data.get('type')
	log['players']['max'] = 1 if log['type'] in ['local', 'AI'] else 2
	log['players']['1'] = create_new_player(data, data.get('userID1'), 1)				
	log['players']['2'] = create_new_player(data, data.get('userID2', 'userID1'), 2)
	player_mode = log["type"]
	if log["type"] == 'remote':
		log["tour_id"] = data.get('tour_id')

	cache.set(f"game_log:{log['gameID']}", log)
	print("first player...")
	await get_channel_layer().group_send(f"{data.get('userID1')}", {
		"type" : "game.updates",
		"update_display" : "start game",
		"gameID" : log["gameID"],
		"userID" : data["userID1"],
		"game-type" : log["type"] if log["type"] != "remote" else "player1",
	})
	if data.get('userID2'):
		print("second playe")
		await get_channel_layer().group_send(f"{data.get('userID2')}", {
			"type" : "game.updates",
			"update_display" : "start game",
			"gameID" : log["gameID"],
			"userID" : data["userID2"],
			"game-type" : "player2",
		})

async def store_game_results(results):
	log = cache.get(f"game_log:{results['gameID']}")
	if log == None:
		return

	if "error" in results:
		log["error"] = results["error"]
		log["start_time"] = results["start_time"]
		if "winner" in results:
			if results["winner"] == log["players"]["1"]["id"]:
				log["players"]["1"]["result"] = "win"
				log["players"]["1"]["score"] = 0
				log["players"]["2"]["result"] = "loose"
				log["players"]["2"]["score"] = -1
			elif results["winner"] == log["players"]["2"]["id"]:
				log["players"]["1"]["result"] = "loose"
				log["players"]["1"]["score"] = -1
				log["players"]["2"]["result"] = "win"
				log["players"]["2"]["score"] = 0
		elif "looser" in results:
			if results["looser"] == log["players"]["1"]["id"]:
				log["players"]["1"]["result"] = "loose"
				log["players"]["1"]["score"] = -1
				log["players"]["2"]["result"] = "win"
				log["players"]["2"]["score"] = 0
			elif results["looser"] == log["players"]["2"]["id"]:
				log["players"]["1"]["result"] = "win"
				log["players"]["1"]["score"] = 0
				log["players"]["2"]["result"] = "loose"
				log["players"]["2"]["score"] = -1
		if results["score1"] and results["score2"]:
			log["players"]["1"]["score"] = results["score1"]
			log["players"]["2"]["score"] = results["score2"]

	else:	
		log['start_time'] = results["start_time"]
		log['players']['1']['score'] = results["score1"]
		log['players']['2']['score'] = results["score2"]
		if (results["score1"] > results["score2"]):
			log['players']['1']["result"] = "win"
			log['players']['2']["result"] = "loose"
		elif (results["score1"] < results["score2"]):
			log['players']['1']["result"] = "loose"
			log['players']['2']["result"] = "win"
		else:
			log['players']['1']["result"] = "draw"
			log['players']['2']["result"] = "draw"
	# print("results: ", results)
	# print("log: ", log)
	print("store game results")
	if log["type"] == "remote":
		tour = TournamentManager().get_tournament(log["tour_id"])
		if tour :
			await tour.end_remote_game({
				"players" :  [log['players']['1'], log['players']['2']],
				"error" : results.get("error", "")
			})

	# store log in data base ... TODO
	cache.delete(f"game_log:{results['gameID']}")


def create_new_log():
	return {
		"gameID": str(uuid4()),
		"type": "",
		"players": {
			"1": {},
			"2": {},
			"max": 2
		},
		"start_time": "",
		"error": "",
		"full" : False,
	}

def create_new_player(data, userID, n):
	player={
		"id": "", 
		"username": "",
		"alias": "",
		"score": 0,
		"result": ""
	}
	player["id"] = userID
	player["username"] = data.get("username")
	if n == 2 and data.get('type') == "AI":
		player["alias"] = "Computer"
	elif n == 2 and data.get('type') == "local":
		player["alias"] = "Oponent"
	else:
		#TODO! fetch actual alias
		player["alias"] = "alias0"
	return player

def	get_max_players(gameID):
	log = cache.get(f"game_log:{gameID}")
	return log["players"]["max"] if log else None

def get_paddle_type(gameID, side):
	log = cache.get(f"game_log:{gameID}")
	if log:
		if log["type"] == "AI" and side == 1:
			return "AI"
		if log["type"] == "remote" and side == -1:
			return "player1"
		if log["type"] == "remote" and side == 1:
			return "player2"
	return "local"

def	get_player_alias(gameID):
	log = cache.get(f"game_log:{gameID}")
	return [log["players"]["1"]["alias"], log["players"]["2"]["alias"]] if log else None
