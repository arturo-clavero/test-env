import { StateManager } from '../../core/stateManager/StateManager';
import { gameReceive } from '../overlays/scenes/pong-game/Game'
import {getUserID} from './utils'
import { end } from '../overlays/divs/tour_end';
import { matchmake } from '../overlays/divs/tour_matchamake';
import { create_join_alert } from '../overlays/alerts/join_tour_alert';
import { join } from '../overlays/divs/tour_join';

export class Socket {
	constructor(){
		if (Socket.instance)
			return Socket.instance
		this.msgQueue = [];
		this.init();
		Socket.instance = this;
	}
	async init(){
		this.userID = await getUserID();
		this.msgQueue = [];
		this.socket = new WebSocket(`ws://localhost:8003/ws/${this.userID}/`);
		this.socket.onopen = this.myOpen.bind(this);
		this.socket.onclose = this.myClose.bind(this);
		this.socket.onmessage = (event)=>{
			const data = JSON.parse(event.data);
			if (!data)
				return ;
			if (data.type == "game update")
				gameReceive(data);
			else if (data.type == "tour.updates")
			{
				console.log("1");
				if ("button" in data) this.updateTourRegistration(data);
				else if ("update_display" in data) this.updateTourSubState(data);
				else if ("notification" in data) this.notification(data);
			}
		}
	}
	notification(data){
		console.log("1.3");
		create_join_alert();
	}
	updateTourSubState(data){
		console.log("1.2");
		if (data.update_display== "pay")
		{
			new StateManager().currentState.changeSubstate();
			new StateManager().currentState.currentSubstate.data["tour_id"] = data["tour_id"];
		}
		else if (data.update_display == "refund")
		{
			new StateManager().currentState.changeSubstate(7);
		}
		else if (data.update_display == "matchmaking rounds")
		{
			matchmake["dynamic-content"](data);
			new StateManager().currentState.changeSubstate(8);
		}
		else if (data.update_display == "start game")
		{
			new_round(data["gameID"], data["userID"], data["game-type"]);
			new StateManager().currentState.changeSubstate(9);
		}
		else if (data.update_display == "end game")
		{
			end["dynamic-content"](data);
			setTimeout(() => {
				new StateManager().currentState.changeSubstate(10);
			}, 3000);
		}
	}
	updateTourRegistration(data){
		console.log("1.1")
		console.log(data);
		if (data.button == "join" || data.button == "full" || data.button == "subscribed")
		{
			console.log("1.1.1");
			new StateManager().states[3].update_start_index(4);
			join["dynamic_content"](data);
			if (data.button == "subscribe")
				new StateManager().states[3].data["subscribed"] = true;
		}
		else if (data.button == "create")
		{
			console.log("1.1.2");
			console.log(new StateManager().states[3]);
			new StateManager().states[3].update_start_index(2, ()=>{
				if ("subscribed" in new StateManager().states[3].data)
					return false;
				if (new StateManager().states[3].currentState > 5)
					return false;
				return true;
			});
			// new StateManager().states[3].update_start_index(2);
			console.log(new StateManager().states[3]);

		}
	}
	myOpen(){
		this.msgQueue.forEach(msg => {
			this.send(msg)});
		this.msgQueue = [];
	}
	myClose(event){
		this.socket = null;
		Socket.instance = null;
	}
	send(obj){
		if (this.socket && this.socket.readyState == WebSocket.OPEN)
				this.socket.send(JSON.stringify(obj));
		else
			this.msgQueue.push(obj);
	}
}

