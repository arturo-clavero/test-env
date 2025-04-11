import { StateManager } from '../../core/stateManager/StateManager';
import { pongGame} from '../overlays/scenes/pong-game/Game'
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
		this.socket = new WebSocket(`ws://localhost:8004/ws/${this.userID}/`);
		this.socket.onopen = this.myOpen.bind(this);
		this.socket.onclose = this.myClose.bind(this);
		this.socket.onmessage = (event)=>{
			const data = JSON.parse(event.data);
			if (!data)
				return ;
			console.log("received: ", data);
			if (data.type == "game update")
			{
				console.log("game update...");
				pongGame["receive"](data);
			}
			else if (data.type == "tour.updates")
			{
				console.log("received: ", data);
				if ("update_tour_registration" in data) this.updateTourRegistration(data);
				else if ("update_display" in data) this.updateTourSubState(data);
				else if ("notification" in data) this.notification(data);
			}
		}
	}
	notification(data){
		console.log("1.3");
		if (data["notification"] == "start")
			create_join_alert(data["tour_id"]);
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
			console.log('matchmake ')
			matchmake["dynamic-content"](data);
			new StateManager().currentState.changeSubstate(8);
		}
		else if (data.update_display == "start game")
		{
			pongGame["new-round"](data["gameID"], data["userID"], data["game-type"]);
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
		console.log("update tour registration")
		console.log(data);
		if (data.update_tour_registration == "create")
		{
			console.log('create...');
			new StateManager().states[3].update_start_index(2, update_tour_registration_conditions);
		}
		else if (data.update_tour_registration == "join")
		{
			join["dynamic-content"](data);
			if ("button" in data)
			{
				new StateManager().states[3].update_start_index(4,);
				if (data.button == "subscribed")
				{
					console.log("SUCRIBE!")
					new StateManager().states[3].data["subscribed"] = true;
			}}
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

function update_tour_registration_conditions(){
	if (join['get-button-type']() == "Subscribed")
		{
			console.log("subscribed, can not go to create...");
			return false;
		}
		if (new StateManager().currentStateIndex == 3 &&
		new StateManager().currentState.currentSubstateIndx >= 6)
		{
			console.log("wrong state, can not go to create ...");
			return false;
		}
		console.log("create returns true");
		return true;
}