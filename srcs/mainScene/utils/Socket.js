import { StateManager } from '../../core/stateManager/StateManager';
import { gameReceive } from '../overlays/scenes/pong-game/Game'
import { setTourId, updatePrizePool, change_button } from '../overlays/divs/tour_join';
// import { showAvailableTournaments } from '../overlays/divs/tour_join'
// TODO
import {getUserID} from './utils'

export class Socket {
	constructor(){
		if (Socket.instance)
			return Socket.instance
		this.msgQueue = [];  // Ensure msgQueue is initialized
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
				if ("button" in data)
				{
					if (data.button == "join" || data.button == "full" || data.button == "subscribed")
					{
						new StateManager().states[3].update_start_index(4);
						if (data.button == "join")
							setTourId(data["tourId"]);
						change_button(data.button);
					}
					else if (data.button == "create")
						new StateManager().states[3].update_start_index(2);
				}
				if ("prize_pool" in data)
					updatePrizePool(data["prize_pool"])
			}
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

