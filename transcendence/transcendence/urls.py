from django.urls import path
from game import consumers, playLog, utils
from django.http import HttpResponse

urlpatterns = [
	path('new-game/', playLog.new_game, name='new-game'),
	path('get-userID/', utils.get_userID, name='get-userID'),
]

ws_urlpatterns = [
	path("ws/<str:user_id>/", consumers.MainConsumer.as_asgi()),
]
