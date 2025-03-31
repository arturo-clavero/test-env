import { gameReceive } from '../overlays/scenes/pong-game/Game'
// TODO
import {getUserID} from './utils'

export class Socket {
	constructor(){
		if (Socket.instance)
			return Socket.instance
		this.init();
		Socket.instance = this;
	}
	async init(){
		this.userID = await getUserID();
		console.log("user id is ...", this.userID)
		this.msgQueue = [];
		this.socket = new WebSocket(`ws://localhost:8003/ws/${this.userID}/`);
		this.socket.onopen = this.myOpen.bind(this);
		this.socket.onclose = this.myClose.bind(this);
		this.socket.onmessage = (event)=>{
			//IF DATA IS GAME.
			gameReceive(event);
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
