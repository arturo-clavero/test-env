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
import * as THREE from 'three';

//STATES: waiting, playing, error, completed

	let state = "0";
	let engine = new Engine(window);
	let middleBars = new MiddleBars(false, engine);
	let ball = new Ball(false, engine);
	let paddles = new PaddleGroup(false, engine);
	let socket = new GameSocket();
	let key = new KeyControls(paddles, socket);
	let header = new Header(false, engine);
	let content_body = new Font(false, engine);
	let end = false;
	let round = 0;
	let gameID, mode, num;

export	function startPongGame(type = "local"){
		const brutdata = {type: type, userID1: socket.socket.userID, userID2: socket.socket.userID, alias1: "player one", alias2: "player two"};
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
			new_round(data["gameID"], data["userID"], "local");
			})
			.catch(error => {
				console.error('Error creating game:', error);
			});
		}
	function	new_round(gameID_input, userID, player_mode)
	{
		round++;
		console.log("called new: ", gameID_input, userID, player_mode);
		window.addEventListener("keydown", key.handleKeyDown);
		window.addEventListener("keyup", key.handleKeyUp);
		gameID = gameID_input;
		mode = player_mode;
		console.log("MODE:", player_mode);
		console.log("connecting websokcet .... ")
		// socket.new(gameID, userID, (event)=>{updatesFromBackend(event);});
		socket.socket.send({
			"consumer-type": "game",
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
	if (!data || data.type != "game update")
		return {};
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
		console.log("update positions: ", data.updates.ball.x, data.updates.ball.y);
		paddles.paddles[0].object.position.y = data.updates.paddle_left;
		paddles.paddles[1].object.position.y = data.updates.paddle_right;
		ball.object.position.x = data.updates.ball.x;
		ball.object.position.y = data.updates.ball.y;
		header.updateScores(data.updates.score1, data.updates.score2, engine);
	}
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

function	countdown(){
	state = "countdown";
	content_body.show();
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
	console.log("completed...");
	state = "completed";
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
	clean();
	new StateManager().currentState.changeSubstate();
}


function	clean(){
		window.removeEventListener("keydown", key.handleKeyDown);
		window.removeEventListener("keyup", key.handleKeyUp);
		ball.hide();
		paddles.hide();
		middleBars.hide();
		content_body.hide();
		header.hide();
		// socket.socket.socket.close();
		end = true;
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
	socket.socket.send({
		"consumer-type": "game",
		"boundaries" : {
			"x" : paddles.collisionPos(ball),
			"y" : engine.boundaryY,
		},
		})
}


function exit(){
	if (end == false){
		console.log("tesssssssssst");
		const userConfirmed = confirm("Game is running!\n Are you sure you want to exit? \nYou will automatically lose...");
		if (userConfirmed) {
			clean();
		}
		else
		{
			console.log("should not exit");
			return "forbidden";
		}
	}
	console.log("not running....");
}

const renderTarget = createRenderTarget();
const renderMaterial = createScreenMaterial(renderTarget);
	
export	const pongGame = {
		"renderMaterial" : renderMaterial,
		"renderTarget" : renderTarget,
		"scene" : engine.scene,
		"camera" : engine.camera,
		"resize":resize,
		"exit": exit,
	}
export const gameReceive = (event)=>{updatesFromBackend(event);}
