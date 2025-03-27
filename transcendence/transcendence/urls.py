from django.urls import path
from game import consumers
from game import playLog

from django.http import HttpResponse

urlpatterns = [
	path('new-game/', playLog.new_game, name='new-game'),
]

ws_urlpatterns = [
	path("ws/game/<str:game_id>/<str:user_id>/", consumers.GameConsumer.as_asgi()),
]
