import { Engine } from './setUp/Engine';
import { MiddleBars } from "./objects/MiddleBars";
import { PaddleGroup } from './objects/Paddle';
import { Ball } from './objects/Ball';
import { Header } from './objects/Header';
import { GameSocket } from './setUp/GameSocket';
import { KeyControls } from './setUp/KeyControls';
import { Font } from '../../../../core/objectFactory/customFont3d';
import { dispose_object } from '../../../utils/utils';
import { StateManager } from '../../../../core/stateManager/StateManager';
import { createRenderTarget, createScreenMaterial } from '../utils';
import { OnLoad } from '../../../utils/OnLoad';
import * as THREE from 'three';
import { Socket } from '../../../utils/Socket';
//OPTION RAINBOW
// import axios from 'axios';
	let end = false;
	let state = "0";
	//shoudl send the wndow to engine really ? THINK
	let engine = new Engine(window);
	let middleBars = new MiddleBars(false, engine);
	let ball = new Ball(false, engine);
	let paddles = new PaddleGroup(false, engine);
	let socket = new GameSocket();
	let key = new KeyControls(paddles, socket);
	let header = new Header(false, engine);
	let content_body = new Font(false, engine);
	let mode, num;

export	function startPongGame(type = "local"){
	clean();
	console.log("new png game... ");
	if ( new OnLoad().reconnecting == false)
	{
		// OPTION RAINBOW
		// const response = await axios.get('api/profiles/me/')
		// let alias1 = response.data.display_name
		// OPTION TEST
		let alias1 = "alias0";
		let alias2 = type == "AI" ? "computer" : alias1 != "oponent" ? "oponent" : "player_2" ;
		new Socket().send({
			"channel" : "log",
			"type" : type,
			"userID1" : socket.socket.userID,
			"alias1" : alias1,
			"alias2" : alias2,
		})
	}
	else
	{
		mode = type;
		console.log("ADDING KEY LISTENERS...")
		document.addEventListener("keydown", key.handleKeyDown);
		document.addEventListener("keyup", key.handleKeyUp);
	}
}

	function	new_round(gameID, player_mode)
	{
		// print("player.mode. ", player_mode)
		// console.log("new round");
		console.log("ADDING KEY LISTENERS...")
		document.addEventListener("keydown", key.handleKeyDown);
		document.addEventListener("keyup", key.handleKeyUp);
		mode = player_mode;
		console.log('sending to game back end');
		socket.socket.send({
			"channel": "game",
			request: "start game",
			game_id: gameID,
			boundaries: { x: paddles.collisionPos(ball), y: engine.boundaryY },
			left_paddle_type: mode === "AI" ? "local" : (mode === "player2" ? "X" : mode),
			right_paddle_type: mode === "player1" ? "X" : mode,
			paddle_half_len: paddles.paddles[0].halfLen,
		});
		// if (mode == "player1" || mode == "player2")
			// waiting();
	}
	
function	updatesFromBackend(msg){
	const data = msg.updates|| msg;
	// console.log("data:", data)
	if (data.state == "countdown")
	{
		if (state != "countdown")
			countdown();
		num = data.num == 1 ? "|" : data.num;
		if (data.num == 0)
			content_body.new("GO", "thick", 0, 0, 0, 5.5, 1, engine);

		else
			content_body.new(num, "thin", 0, 0, 0, 1.5, 1, engine);
	}
	else if (data.state == "playing")
	{
		if (state != "playing")
			playing();
		paddles.paddles[0].object.position.y = data.paddle_left;
		paddles.paddles[1].object.position.y = data.paddle_right;
		ball.object.position.x = data.ball.x;
		ball.object.position.y = data.ball.y;
		header.updateScores(data.score1, data.score2, engine);
	}
	else if (data.state == "game end")
	{
		if (state != "completed")
			completed();
	}
	else if (data.state == "error")
	{
		if (state != "error")
			completed(data.info);
	}
	else if (data.state == "player names")
	{
		console.log("PLAYER NAMES!")
		console.log("player_names: ", data)
		header.new("hide", data.name1, data.name2, engine);
	}
}

function	countdown(){
	state = "countdown";
	content_body.show();
	ball.hide();
	paddles.hide();
	middleBars.hide();
	header.hide();
}

function	playing(){
	end = false;
	state = "playing";
	ball.object.position.set(0, 0, 0);
	content_body.delete();
	middleBars.show();
	ball.show();
	paddles.show(mode);
	header.show();
}

function completed(msg){
	state = "completed";
	ball.hide();
	paddles.hide();
	middleBars.hide();
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
	console.log("fame end ... mode", mode)
	clean();
	if (mode == "local" || mode == "AI")
		new StateManager().currentState.changeSubstate();
	// 	setTimeout(()=>{
	// 		clean();
	// 		new StateManager().currentState.changeSubstate();
	// }, 4000)
}


function	clean(){
		console.log("clean");
		// window.removeEventListener("keydown", key.handleKeyDown);
		// window.removeEventListener("keyup", key.handleKeyUp);
		ball.hide();
		paddles.hide();
		middleBars.hide();
		content_body.hide();
		header.hide();
		state = "0";
		// socket.socket.socket.close();
		end = true;
	}


function	resize(object_aspect) {
	content_body.initPositions(engine);
	//MAYBE HSOULD BE SCREEN ? THINK!
	engine.setRendererSize(object_aspect); //THINK
	ball.initPositions(engine);
	paddles.initPositions(engine);
	header.initPositions(engine);
	socket.socket.send({
		"channel": "game",
		"boundaries" : {
			"x" : paddles.collisionPos(ball),
			"y" : engine.boundaryY,
		},
	})
}


function exit(){
	//if (end == false){
		//const userConfirmed = confirm("Game is running!\n Are you sure you want to exit? \nYou will automatically lose...");
		// if (userConfirmed)
		document.removeEventListener("keydown", key.handleKeyDown);
		document.removeEventListener("keyup", key.handleKeyUp);
		console.log("exit sending to socket ")
		clean();
		new Socket().send({
			"channel": "game",
			"request": "game end",
		})
		// else
		// 	return "forbidden";
	//}
}

const renderTarget = createRenderTarget();
const renderMaterial = createScreenMaterial(renderTarget);
	
export	const pongGame = {
		"renderMaterial" : renderMaterial,
		"renderTarget" : renderTarget,
		"scene" : engine.scene,
		"camera" : engine.camera,
		"exit": exit,
		"receive" : (event)=>{updatesFromBackend(event);},
		"new-round" : new_round,
		"enter" : (object_aspect)=>{
			console.log("ENTER");
			resize(object_aspect);
			console.log("")
			// console.log("ADDING EVENT LISTENERES...")
			// window.addEventListener("keydown", key.handleKeyDown);
			// window.addEventListener("keyup", key.handleKeyUp);
		}
	}
