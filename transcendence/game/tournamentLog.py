max_players = 8
curr_players = 0
tour_id = str(uuid4())

@api_view(['POST'])
def	join_tournament(request):
	global max_players, curr_players
	if request.method == 'POST':
		curr_players += 1
		if curr_players > max_players:
			tour_id = str(uuid4())
			curr_players = 0
		return Response({
			"type" : "new tournament",
			"tour_id" : tour_id,
			}, status=201)

def next_tournament(full_id):
	if tour_id == full_id:
		tour_id = str(uuid4())
		curr_players = 0

def store_tournament_results(data):
	print("tournament final results: ", data)
