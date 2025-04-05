import { StateManager } from '../../core/stateManager/StateManager';
import { gameReceive } from '../overlays/scenes/pong-game/Game'
import { setTourId, updatePrizePool, change_button } from '../overlays/divs/tour_join';
// import { showAvailableTournaments } from '../overlays/divs/tour_join'
// TODO
import {getUserID} from './utils'

export class Socket {
	constructor(){
		console.log("constructr");
		if (Socket.instance)
			return Socket.instance
		this.msgQueue = [];  // Ensure msgQueue is initialized
		this.init();
		Socket.instance = this;
	}
	async init(){
		console.log("init");
		this.userID = await getUserID();
		console.log("user id is ...", this.userID)
		this.msgQueue = [];
		this.socket = new WebSocket(`ws://localhost:8003/ws/${this.userID}/`);
		this.socket.onopen = this.myOpen.bind(this);
		this.socket.onclose = this.myClose.bind(this);
		this.socket.onmessage = (event)=>{
			const data = JSON.parse(event.data);
			console.log("Data: ", data);
			if (!data)
				return ;
			if (data.type == "game update")
				gameReceive(data);
			else if (data.type == "tour.updates" && data.display == "tournament")
			{
				if (data.action == "update display")
				{
					if (data.button == "join")
					{
						console.log("receiveing .... !");
						let stateManager = new StateManager();
						if (stateManager.states[3].currentSubstateIndex == 0 || stateManager.states[3].currentSubstateIndex == 1)
							stateManager.states[3].changeSubstate(stateManager.states[3].currentSubstateIndex + 2)
						stateManager.states[3].startIndex = 2;
						updatePrizePool(100);
						setTourId(data["tourId"]);
					}
					else if (data.button = "subscribed")
						change_button("subscribed");
				}
				if (data.action == "update info"){
					if (data["prizePool"])
						updatePrizePool(data["prizePool"])
				}
			}
		}
	}
	myOpen(){
		console.log("websocket opening");
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

