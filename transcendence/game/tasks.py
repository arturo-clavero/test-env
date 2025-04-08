from celery import shared_task

@shared_task
def start(tour_id):
	from .tournamentChannel import ongoing_tournaments
	ongoing_tournaments[tour_id].start()

@shared_task
def notify_start(tour_id):
	from .tournamentChannel import ongoing_tournaments
	ongoing_tournaments[tour_id].notify_start()
    