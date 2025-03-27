export class Socket {
	constructor(){

		this.socket = null;
		this.msgQueue = [];
	
		// this.myReceive = myReceive;
		// this.onconnect = myConnect;
	}
	new (gameID, userID, myReceive) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close();
		  }
		this.socket = new WebSocket(`ws://localhost:8003/ws/game/${gameID}/${userID}/`);
		this.socket.onopen = this.myOpen.bind(this);
		this.socket.onclose = this.myClose.bind(this);
		this.socket.onmessage = myReceive;
	}
	myOpen(){
		console.log("websocket opening");
		this.msgQueue.forEach(msg => {
			this.send(msg)});
		this.msgQueue = [];
	}
	myClose(event){
		this.socket = null;
	}
	send(obj){
		if (this.socket && this.socket.readyState == WebSocket.OPEN)
			{
				console.log("sending message...");
				this.socket.send(JSON.stringify(obj));
			}else{
			this.msgQueue.push(obj);
			console.log("queing socket message...");
			console.log("this socket ready state: ", this.socket.readyState);

		}
	}
	movePaddle(side, direction) {
		socket.send(JSON.stringify({ action: "move_paddle", side, direction }));
	}
	setGameParams(halfLen, boundaryX, boundaryY) {
		socket.send(JSON.stringify({
			action: "set_game_params",
			halfLen,
			boundaryX,
			boundaryY
		}));
	}
}
