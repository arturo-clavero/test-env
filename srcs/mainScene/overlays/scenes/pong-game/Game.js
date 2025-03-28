import { Engine } from './setUp/Engine';
import { MiddleBars } from "./objects/MiddleBars";
import { PaddleGroup } from './objects/Paddle';
import { Ball } from './objects/Ball';
import { Header } from './objects/Header';
import { Socket } from './setUp/Socket';
import { KeyControls } from './setUp/KeyControls';
import { Font } from '../../../../core/objectFactory/customFont3d';
import { dispose_object } from '../../../utils/utils';
import { StateManager } from '../../../../core/stateManager/StateManager';
import { createRenderTarget, createScreenMaterial } from '../utils';
import * as THREE from 'three';

//STATES: waiting, playing, error, completed

	let state = "0";
	let engine = new Engine(window);
	let middleBars = new MiddleBars("hide", engine);
	let ball = new Ball("hide", engine);
	let paddles = new PaddleGroup("hide", engine);
	let socket = new Socket();
	let key = new KeyControls(paddles, socket);
	let header = new Header(engine);
	let content_body = new Font(engine);
	let end = false;
	window.addEventListener("resize", (e) => {resize(e);});
	// let animationFrameId = null;
	let animate_state = () => {};
	animate();
	// }
	let gameID, mode;

export	function startPongGame(type){
		const brutdata = {type: "local", username: "user", alias1: "PLAyer_one", alias2: "player_two"};
			fetch('http://localhost:8003/new-game/', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(brutdata)
			})
			.then(response => response.json())
			.then(data => {
				if (data["error"])
				{
					alert(data["error"]);
					return;
				}
			console.log("data : ", data);
			// if (currentGame)
			// 	currentGame.clean();
		//	currentGame = new Game();
			// new_round(123, 456, type);
			new_round(data["gameID"], data["userID"], "local");
			})
			.catch(error => {
				console.error('Error creating game:', error);
			});
		}
	function	new_round(gameID_input, userID, player_mode)
	{
		console.log("called new: ", gameID_input, userID, player_mode);
		gameID = gameID_input;
		mode = player_mode;
		console.log("connecting websokcet .... ")
		socket.new(gameID, userID, (event)=>{updatesFromBackend(event);});
		socket.send({
			request: "start game",
			game_id: gameID,
			boundaries: { x: paddles.collisionPos(ball), y: engine.boundaryY },
			left_paddle_type: mode === "AI" ? "local" : (mode === "player2" ? "X" : mode),
			right_paddle_type: mode === "player1" ? "X" : mode,
			paddle_half_len: paddles.paddles[0].halfLen,
		});
		if (mode == "player1" || mode == "player2")
			waiting();
	}
	
	function	updatesFromBackend(event){
		const data = JSON.parse(event.data);
		console.log("hello?")
		if (!data )
			return {};
		console.log("there is data , received : ", data);
		if (data.type != "game update")
			return {};
		console.log("correct ....");
		if (data.updates.state == "countdown")
		{
			if (state != "countdown")
				countdown();
			num = data.updates.num == 1 ? "|" : data.updates.num;
			content_body.new(num, "thin", 0, 0, 0, 1.5, 1, engine);
		}
		if (data.updates.state == "playing")
		{
			if (state != "playing")
				playing();
			paddles.paddles[0].object.position.y = data.updates.paddle_left;
			paddles.paddles[1].object.position.y = data.updates.paddle_right;
			ball.object.position.x = data.updates.ball.x;
			ball.object.position.y = data.updates.ball.y;
			header.updateScores(data.updates.score1, data.updates.score2, engine);
		}
		else
			console.log("updates -> ", data.updates.state);
		if (data.updates.state == "game end")
		{
			console.log("game end received in front end")
			console.log(" state :", state);
			if (state != "completed")
				completed();
		}
		if (data.updates.state == "error")
		{
			if (state != "error")
				completed(data.updates.info);
		}
		if (data.updates.state == "player names")
			header.new("hide", data.updates.name1, data.updates.name2, engine);
	}
//maybe delete?
function	waiting(){
		state = "waiting";
		//paddles.hide();
		ball.object.position.z = 7;
		ball.object.position.y = -0.06;
		content_body.new("waiting for players...", "thick", 0, 0.3, 0, 50, 1.5, engine);
	}
	function	countdown(){
		content_body.delete();
		state = "countdown";
		//ball.hide();
		//paddles.hide();
	}

	function	playing(){
		state = "playing";
		ball.object.position.set(0, 0, 0);
		content_body.delete();
		middleBars.show();
		ball.show();
		paddles.show(mode);
		header.show();
	}

	function completed(msg){
		console.log("completed...");
		state = "completed";
		///ball.hide();
		//paddles.hide();
		//middleBars.hide();
		if (msg)
		{
			content_body.new("game over", "thick", 0, 0.15, 0, 15, 1.5, engine);
			let info = new Font(engine);
			info.new(msg, "thick", 0, -.15, 0, 80, 1.5, engine);
		}
		else
		{
			content_body.new("game over", "thick", 0, 0, 0, 15, 1.5, engine);
		}
		new StateManager().currentState.changeSubstate();
		clean();
	}
	const geometry = new THREE.SphereGeometry(1);
	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	const test = new THREE.Mesh(geometry, material);
// engine.scene.add(test);
	function	animate() {
		// console.log("animate game");
		if (end == true)
		{
			return ;
		}
		animate_state();
		if (state == "waiting")
			ball.rotate();
	}

	function	resize(e) {
		console.log("resize game");
		content_body.initPositions(engine);
		engine.camera.aspect = window.innerWidth / window.innerHeight;
		engine.camera.updateProjectionMatrix();
		engine.setRendererSize(window);
		ball.initPositions(engine);
		paddles.initPositions(engine);
		header.initPositions(engine);
		socket.send({
			"boundaries" : {
				"x" : paddles.collisionPos(ball),
				"y" : engine.boundaryY,
			},
			})
	}

function	clean(){
		end = true;
		window.removeEventListener("keydown", (e) => key.handleKeyDown(e));
		window.removeEventListener("keyup", (e)=>(key.handleKeyUp(e)));
		window.removeEventListener("resize", (e) => {resize(e)});
		engine.scene.traverse(object => {dispose_object(object)});
		socket.socket.close();
	}

const renderTarget = createRenderTarget();
const renderMaterial = createScreenMaterial(renderTarget);
	
export	const pongGame = {
		"renderMaterial" : renderMaterial,
		"renderTarget" : renderTarget,
		"animate" : ()=>{animate();},
		"scene" : engine.scene,
		"camera" : engine.camera,
		"keyHandler" : null,
	}
	
// export class Game {
// 	constructor(){
// 		if (!Game.instance)
// 		{
// 			console.log("new instance!\n\n");
// 			this.state = "0";
// 			this.engine = new Engine(window);
// 			this.middleBars = new MiddleBars("hide", this.engine);
// 			this.ball = new Ball("hide", this.engine);
// 			this.paddles = new PaddleGroup("hide", this.engine);
// 			this.socket = new Socket();
// 			this.key = new KeyControls(this.paddles, this.socket);
// 			this.header = new Header(this.engine);
// 			this.body = new Font(this.engine);
// 			this.end = false;
// 			window.addEventListener("resize", (e) => this.onWindowResize(e));
// 			this.animationFrameId = null;
// 			this.animate = this.animate.bind(this);
// 			this.animate_state = () => {};
// 			this.animate();
// 			Game.instance = this;
// 		}
// 		return Game.instance;
// 	}

// 	new_match(gameID, userID, player_mode)
// 	{
// 		console.log(gameID, userID);
// 		this.gameID = gameID;
// 		this.mode = player_mode;
// 		this.socket.new(gameID, userID, this.updatesFromBackend.bind(this));
// 		this.socket.send({
// 			request: "start game",
// 			game_id: this.gameID,
// 			boundaries: { x: this.paddles.collisionPos(this.ball), y: this.engine.boundaryY },
// 			left_paddle_type: this.mode === "AI" ? "local" : (this.mode === "player2" ? "X" : this.mode),
// 			right_paddle_type: this.mode === "player1" ? "X" : this.mode,
// 			paddle_half_len: this.paddles.paddles[0].halfLen,
// 		});
// 		if (this.mode == "player1" || this.mode == "player2")
// 			this.waiting();
// 	}
	
// 	updatesFromBackend(event){
// 		const data = JSON.parse(event.data);
// 		if (!data || data.type != "game update")
// 			return {};
// 		// console.log("received : ", data);
// 		if (data.updates.state == "countdown")
// 		{
// 			if (this.state != "countdown")
// 				this.countdown();
// 			let num = data.updates.num == 1 ? "|" : data.updates.num;
// 			this.body.new(num, "thin", 0, 0, 0, 1.5, 1, this.engine);
// 		}
// 		if (data.updates.state == "playing")
// 		{
// 			if (this.state != "playing")
// 				this.playing();
// 			this.paddles.paddles[0].object.position.y = data.updates.paddle_left;
// 			this.paddles.paddles[1].object.position.y = data.updates.paddle_right;
// 			this.ball.object.position.x = data.updates.ball.x;
// 			this.ball.object.position.y = data.updates.ball.y;
// 			this.header.updateScores(data.updates.score1, data.updates.score2, this.engine);
// 		}
// 		// else
// 		// 	console.log("updates -> ", data.updates.state);
// 		if (data.updates.state == "game end")
// 		{
// 			console.log("game end received in front end")
// 			console.log("this state :", this.state);
// 			if (this.state != "completed")
// 				this.completed();
// 		}
// 		if (data.updates.state == "error")
// 		{
// 			if (this.state != "error")
// 				this.completed(data.updates.info);
// 		}
// 		if (data.updates.state == "player names")
// 			this.header.new("hide", data.updates.name1, data.updates.name2, this.engine);
// 	}

// 	waiting(){
// 		this.state = "waiting";
// 		this.paddles.hide();
// 		this.ball.object.position.z = 7;
// 		this.ball.object.position.y = -0.06;
// 		this.body.new("waiting for players...", "thick", 0, 0.3, 0, 50, 1.5, this.engine);
// 	}
// 	countdown(){
// 		this.body.delete();
// 		this.state = "countdown";
// 		this.ball.hide();
// 		this.paddles.hide();
// 		// this.animate_state = ()=>{// 	// };
// 	}

// 	playing(){
// 		this.state = "playing";
// 		this.ball.object.position.set(0, 0, 0);
// 		this.body.delete();
// 		this.middleBars.show();
// 		this.ball.show();
// 		this.paddles.show(this.mode);
// 		this.header.show();
// 		// this.animate_state = ()=>{// };
// 	}

// 	completed(msg){
// 		console.log("completed...");
// 		this.state = "completed";
// 		this.ball.hide();
// 		this.paddles.hide();
// 		this.middleBars.hide();
// 		// this.header.hide();
// 		if (msg)
// 		{
// 			this.body.new("game over", "thick", 0, 0.15, 0, 15, 1.5, this.engine);
// 			let info = new Font(this.engine);
// 		initPositions	info.new(msg, "thick", 0, -.15, 0, 80, 1.5, this.engine);
// 		}
// 		else
// 		{
// 			console.log("just game over...");
// 			this.body.new("game over", "thick", 0, 0, 0, 15, 1.5, this.engine);
// 		}
// 		window.addEventListener("keydown",(event) => {
// 			if (event.key === "Enter") {
// 				this.clean();
// 				window.location.href = "/";
// 			}
// 		});
// 		new StateManager().currentState.changeSubstate();
// 		this.clean();
// 	}
// 	animate() {
// 		if (this.end == true)
// 		{
// 			cancelAnimationFrame(this.animationFrameId);
// 			return ;
// 		}
// 		//this.animate_state(this);
// 		if (this.state == "waiting")
// 			this.ball.rotate();
// 		this.animationFrameId = requestAnimationFrame(this.animate);
// 		// this.engine.renderer.render(this.engine.scene, this.engine.camera);
// 	}

// 	onWindowResize(e) {
// 		this.body.initPositions(this.engine);
// 		this.engine.camera.aspect = window.innerWidth / window.innerHeight;
// 		this.engine.camera.updateProjectionMatrix();
// 		this.engine.setRendererSize(window);
// 		this.ball.initPositions(this.engine);
// 		this.paddles.initPositions(this.engine);
// 		this.header.initPositions(this.engine);
// 		this.socket.send({
// 			"boundaries" : {
// 				"x" : this.paddles.collisionPos(this.ball),
// 				"y" : this.engine.boundaryY,
// 			},
// 			})
// 	}

// 	clean(){
// 		this.end = true;
// 		this.engine.scene.traverse(object => {dispose_object(object)});
// 		//this.engine.renderer.dispose();
// 		this.socket.socket.close();
// 		window.removeEventListener("keydown", (e) => this.key.handleKeyDown(e));
// 		window.removeEventListener("keyup", (e) => this.key.handleKeyUp(e));
// 		window.removeEventListener("resize", (e) => this.onWindowResize(e));
// 		console.log("cleaning");
// 		Game.instance = null;
// 	}
// }

// export function startPongGame(type){
// 			const brutdata = {type: "local", username: "user", alias1: "PLAyer_one", alias2: "player_two"};
// 				fetch('http://localhost:8003/new-game/', {
// 					method: 'POST',
// 					headers: {'Content-Type': 'application/json'},
// 					body: JSON.stringify(brutdata)
// 				})
// 				.then(response => response.json())
// 				.then(data => {
// 					if (data["error"])
// 					{
// 						alert(data["error"]);
// 						return;
// 					}
// 				console.log("data : ", data);
// 				// if (currentGame)
// 				// 	currentGame.clean();
// 			//	currentGame = new Game();
// 				// new_round(123, 456, type);
// 				new Game().new_match(data["gameID"], data["userID"], "local");
// 				})
// 				.catch(error => {
// 					console.error('Error creating game:', error);
// 				});
// 			}

// // 	const renderTarget = createRenderTarget();
// // 	const renderMaterial = createScreenMaterial(renderTarget);
	
// // 	export const pongGame = {
// // 		"renderMaterial" : renderMaterial,
// // 		"renderTarget" : renderTarget,
// // 		"animate" : ()=>{new Game().animate();},
// // 		"