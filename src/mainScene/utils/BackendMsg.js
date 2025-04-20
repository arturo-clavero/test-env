import { StateManager } from '../../core/stateManager/StateManager';
import { pongGame} from '../overlays/scenes/pong-game/Game'
import { end } from '../overlays/divs/tour_end';
import { matchmake } from '../overlays/divs/tour_matchamake';
import { create_redirection_alert, delete_redirection_alert, fadeout_redirection_alert } from '../overlays/alerts/redirection_warning';
import { join } from '../overlays/divs/tour_join';
import { State } from '../../core/stateManager/States';

export function msgRouter(event){
	const data = JSON.parse(event.data);
	// console.log("data: ", data);
	if (!data)
		return ;
	if (data.type == "game.updates")
	{
		if ("update_display" in data && data["update_display"] == "start game")
		{
			pongGame["new-round"](data["gameID"], data["game-type"]);
			if (new StateManager().currentState.name == "tour game screen")
				new StateManager().currentState.changeSubstate(9);
		}
		else
			pongGame["receive"](data);
	}
	else if (data.type == "tour.updates" || data.type == "consumer.updates")
	{
		console.log("received: ", data)
		for (const key of Object.keys(tourActions)) {
			if (key in data)
			{
				let action = tourActions[key](data);
				if (action)
					action();
					break;
			}
		}
	}
}

const tourActions = {
	update_display: (data) => {
		const state = new StateManager().states[3];
		const actions = {
			"pay": () => {
				if (new StateManager().currentState == state)
				{
					state.changeSubstate();
					state.currentSubstate.data["tour_id"] = data["tour_id"];
				}
			},
			"refund": ()=> {
				console.log("refunding ...");
				new StateManager().changeState(3);
				state.changeSubstate(7);

			},
			"matchmaking rounds": () => {
				if (new StateManager().currentState == state)
				{
					matchmake["dynamic-content"](data);
					state.changeSubstate(8);
				}
			},
			"end game": () => {
				if (new StateManager().currentState == state)
				{
					end["dynamic-content"](data);
					state.changeSubstate(10);
				}
			},
			"waiting": () => {
				if (new StateManager().currentState == state)
				{
					console.log("update waiting...")
					state.changeSubstate(11)
				}
			},
		};
		return actions[data.update_display] ?? null;
	},

	update_tour_registration: (data) => {
		const registrationActions = {
			"create": () => {
				new StateManager().states[3].update_start_index(2, update_tour_registration_conditions);
			},
			"join": () => {
				join["dynamic-content"](data);
				if ("button" in data) {
					new StateManager().states[3].update_start_index(4);
				}
			},
			"exit redirection alert":()=>{
				console.log("delte redirection alert")
				delete_redirection_alert()
			},
		};
		return registrationActions[data.update_tour_registration] ?? null;
	},

	notification: (data) => {
		const notificationActions = {
			"start": () => create_redirection_alert(),
			"fadeOut": ()=> fadeout_redirection_alert(data["length"]),
		};
		return notificationActions[data.notification] ?? null;
	}
};

function update_tour_registration_conditions(){
	if (join['get-button-type']() == "Subscribed")
		return false;
	if (new StateManager().currentStateIndex == 3 &&
	new StateManager().currentState.currentSubstateIndx >= 6)
		return false;
	return true;
}