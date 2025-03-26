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
//STATES: waiting, playing, error, completed
export class Game {
	constructor(){
		this.state = "0";
		this.engine = new Engine(window, document.getElementById('gameCanvas'));
		this.middleBars = new MiddleBars("hide", this.engine);
		this.ball = new Ball("hide", this.engine);
		this.paddles = new PaddleGroup("hide", this.engine);
		this.socket = new Socket();
		this.key = new KeyControls(this.paddles, this.socket);
		this.header = new Header(this.engine);
		this.body = new Font(this.engine);
		this.end = false;
		window.addEventListener("resize", (e) => this.resize(e));
		this.animationFrameId = null;
		this.animate = this.animate.bind(this);
		this.animate_state = () => {};
		this.animate();
	}

	new(gameID, userID, player_mode)
	{
		console.log(gameID, userID);
		this.gameID = gameID;
		this.mode = player_mode;
		this.socket.new(gameID, userID, this.updatesFromBackend.bind(this));
		this.socket.send({
			request: "start game",
			game_id: this.gameID,
			boundaries: { x: this.paddles.collisionPos(this.ball), y: this.engine.boundaryY },
			left_paddle_type: this.mode === "AI" ? "local" : (this.mode === "player2" ? "X" : this.mode),
			right_paddle_type: this.mode === "player1" ? "X" : this.mode,
			paddle_half_len: this.paddles.paddles[0].halfLen,
		});
		if (this.mode == "player1" || this.mode == "player2")
			this.waiting();
	}
	
	updatesFromBackend(event){
		const data = JSON.parse(event.data);
		if (!data || data.type != "game update")
			return {};
		// console.log("received : ", data);
		if (data.updates.state == "countdown")
		{
			if (this.state != "countdown")
				this.countdown();
			let num = data.updates.num == 1 ? "|" : data.updates.num;
			this.body.new(num, "thin", 0, 0, 0, 1.5, 1, this.engine);
		}
		if (data.updates.state == "playing")
		{
			if (this.state != "playing")
				this.playing();
			this.paddles.paddles[0].object.position.y = data.updates.paddle_left;
			this.paddles.paddles[1].object.position.y = data.updates.paddle_right;
			this.ball.object.position.x = data.updates.ball.x;
			this.ball.object.position.y = data.updates.ball.y;
			this.header.updateScores(data.updates.score1, data.updates.score2, this.engine);
		}
		else
			console.log("updates -> ", data.updates.state);
		if (data.updates.state == "game end")
		{
			console.log("game end received in front end")
			console.log("this state :", this.state);
			if (this.state != "completed")
				this.completed();
		}
		if (data.updates.state == "error")
		{
			if (this.state != "error")
				this.completed(data.updates.info);
		}
		if (data.updates.state == "player names")
			this.header.new("hide", data.updates.name1, data.updates.name2, this.engine);
	}
//maybe delete?
	waiting(){
		this.state = "waiting";
		this.paddles.hide();
		this.ball.object.position.z = 7;
		this.ball.object.position.y = -0.06;
		this.body.new("waiting for players...", "thick", 0, 0.3, 0, 50, 1.5, this.engine);
	}
	countdown(){
		this.body.delete();
		this.state = "countdown";
		this.ball.hide();
		this.paddles.hide();
	}

	playing(){
		this.state = "playing";
		this.ball.object.position.set(0, 0, 0);
		this.body.delete();
		this.middleBars.show();
		this.ball.show();
		this.paddles.show(this.mode);
		this.header.show();
	}

	completed(msg){
		console.log("completed...");
		this.state = "completed";
		this.ball.hide();
		this.paddles.hide();
		this.middleBars.hide();
		if (msg)
		{
			this.body.new("game over", "thick", 0, 0.15, 0, 15, 1.5, this.engine);
			let info = new Font(this.engine);
			info.new(msg, "thick", 0, -.15, 0, 80, 1.5, this.engine);
		}
		else
		{
			this.body.new("game over", "thick", 0, 0, 0, 15, 1.5, this.engine);
		}
		new StateManager().currentState.changeSubstate();
		this.clean();
	}

	animate() {
		console.log("animate game");
		if (this.end == true)
		{
			return ;
		}
		this.animate_state(this);
		if (this.state == "waiting")
			this.ball.rotate();
	}

	resize(e) {
		console.log("resize game");
		this.body.initPositions(this.engine);
		this.engine.camera.aspect = window.innerWidth / window.innerHeight;
		this.engine.camera.updateProjectionMatrix();
		this.engine.setRendererSize(window);
		this.ball.initPositions(this.engine);
		this.paddles.initPositions(this.engine);
		this.header.initPositions(this.engine);
		this.socket.send({
			"boundaries" : {
				"x" : this.paddles.collisionPos(this.ball),
				"y" : this.engine.boundaryY,
			},
			})
	}

	clean(){
		this.end = true;
		window.removeEventListener("keydown", (e) => this.key.handleKeyDown(e));
		window.removeEventListener("keyup", (e) => this.key.handleKeyUp(e));
		window.removeEventListener("resize", (e) => this.resize(e));
		this.engine.scene.traverse(object => {dispose_object(object)});
		//this.socket.socket.close();
	}
}
