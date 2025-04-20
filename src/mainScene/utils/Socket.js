import {getUserID} from './utils'
import { msgRouter } from './BackendMsg';
import { stateManager } from '../states/mainMenuState';
import { StateManager } from '../../core/stateManager/StateManager';
import { uponEnter } from '../..';
//OPTION RAINBOW
// import axios from 'axios';

export class Socket {
	constructor(){
		if (Socket.instance)
			return Socket.instance
		this.msgQueue = [];
		this.firstLoad = null;
		this.ready = false;
		//this.textures_ready = false;
		this.init();
		Socket.instance = this;
	}
	init_scene(newPage){
		this.firstLoad = newPage;
		if (this.ready == true)
			this.switch_pages()
	}
	switch_pages(){
		console.log("switch pages");
		//RAINBOW:
			//this.firstLoad = true;
			//TEST ENV:
			document.getElementById("loading-screen").style.display = "none";
			document.getElementById("app-container").style.display = "block";
			uponEnter();
	}
	async init(){
			// OPTION RAINBOW
		// const response = await axios.get('api/profiles/me/')
		// this.userID = response.data.id
			// OPTION TEST
		this.userID = await getUserID()
			///end
		try {
					// OPTION RAINBOW
			// this.socket = new WebSocket(`ws://localhost:8000/ws/${this.userID}/`);
				// OPTION TEST
			this.socket = new WebSocket(`ws://localhost:8004/ws/${this.userID}/`);
				//end
			this.socket.onerror = this.myError.bind(this);
			this.socket.onopen = this.myOpen.bind(this);
			this.socket.onclose = this.myClose.bind(this);
			this.socket.onmessage = (event) => msgRouter(event, this);
		}
		catch(err){
			this.myError(err)
		}
	}
	myError(err){
		console.error("WebSocket error:", err);		
		//this.myRetry();		
	}
	myOpen(){
		this.msgQueue.forEach(msg => {
			this.send(msg)});
		this.msgQueue = [];
	}
	myRetry(){
		this.socket = null;
		Socket.instance = null;
		setTimeout(() => {
			new Socket();
		}, 1000);
	}
	myClose(){
		console.log("close...");
		this.socket = null;
		Socket.instance = null;
		this.ready = false;
	}
	send(obj){
		if (this.socket && this.socket.readyState == WebSocket.OPEN)
				this.socket.send(JSON.stringify(obj));
		else
			this.msgQueue.push(obj);
	}
}
