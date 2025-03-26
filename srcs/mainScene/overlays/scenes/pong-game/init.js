
import { createRenderTarget, createScreenMaterial } from '../utils';
import { Game } from './Game';

let currentGame = new Game();

export function getCurrGame(){
	if (currentGame && currentGame.end == true)
		currentGame = null;
	return currentGame;
}

export function startPongGame(type){
		fetch('/api/game/new-game/', {
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
		if (currentGame)
			currentGame.clean();
		currentGame = new Game();
		currentGame.new(123, 456, type);
		// currentGame.new(data["gameID"], data["userID"], "local");
		})
		.catch(error => {
			console.error('Error creating game:', error);
		});
	}


	const renderTarget = createRenderTarget();
	const renderMaterial = createScreenMaterial(renderTarget);
	
	const pongGame = {
		"renderMaterial" : renderMaterial,
		"renderTarget" : renderTarget,
		"animate" : ()=>{getCurrGame().animate();},
		"scene" : getCurrGame().engine.scene,
		"camera" : getCurrGame().engine.camera,
		"keyHandler" : null,
	}
	
	export { pongGame }