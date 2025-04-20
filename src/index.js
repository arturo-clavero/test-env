import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/MainEngine';
import { stateManager, mainSceneObj } from './mainScene/states/mainMenuState';

import { backBox } from './mainScene/objects/background/backBox';
import { localMachineObj } from './mainScene/objects/machines/localMachineObj';
import { aiMachineObj } from './mainScene/objects/machines/aiMachineObj';
import { tourMachineObj } from './mainScene/objects/machines/tournamentMachineObj';
import { StateManager } from './core/stateManager/StateManager';

import { Socket } from './mainScene/utils/Socket';

import { wheel_scroll_animations } from './core/stateManager/cameraMovement';
// import { create_redirection_alert } from './mainScene/overlays/alerts/redirection_warning';

const engine = new MainEngine();

let isAnimating = false;

//developent:
document.addEventListener('keydown', (event) => {
	if (event.key == "i")
	{
		const stateManager = new StateManager();
		console.log("Now: ", stateManager.currentState.name);
		stateManager.states.forEach(state=>
			{
				console.log("state ", state.name, "substate: ", state.currentSubstate.name);
			}
		)
	}
});


// enterScene is called in mounted() or onMounted().
export function preEnterScene(app_container){
	console.log("pre enter")
	new Socket();
	init_scene_state();
	if (!engine.sceneInitialized) {	
		console.log("add to engine...")
		engine.add(backBox, false);
		engine.add(mainSceneObj, true);
		engine.stateManager = stateManager;
		engine.sceneInitialized = true;
	}
	if (!engine.stateManager)
		engine.stateManager = stateManager
	engine.addContainerWrapper(app_container);
}

export function uponEnter(){
	console.log("upon enter")
	if (engine.stateManager.currentState == null)
		engine.stateManager.changeState(0, true, 1);
	window.addEventListener('popstate', popstate);
	window.addEventListener("wheel", wheel_scroll_animations);
	window.addEventListener('resize', onResize);
	window.addEventListener('click', onClick);
	console.log(engine.camera.position)
	engine.resize()
	isAnimating = true;
	animate();
	window.dispatchEvent(new Event("resize"));
}

export function animate() {
	if (!isAnimating) return ;
	//console.log("animate");
	requestAnimationFrame(animate);
	engine.animate();
}

//exitScene is called in beforeUnmount() or onBeforeUnmount().
function exitScene(){
	isAnimating = false;
	engine.removeContainerWrapper();
	window.removeEventListener('popstate', popstate);
	window.removeEventListener("wheel", wheel_scroll_animations);
	window.removeEventListener('resize', onResize);
	window.removeEventListener('click', onClick);
}

function popstate(event){
	if (event.state)
		new StateManager().changeState(event.state.num, false);
}

function onResize() {
	engine.resize();
}

function onClick(event) {
	engine.click(event);
}

function init_scene_state(){
	console.log("init scene...")
	let stateFromURL = window.location.pathname;
	console.log("state from url", stateFromURL)
	if (stateFromURL && stateFromURL != "/lobby"){ 
		const path = stateFromURL.slice(1); // "lobby"
		for (let i = 0; i < stateManager.states.length; i++)
		{
			if (stateManager.states[i].name == path)
			{
				console.log("switching to state ", i)
				stateManager.changeState(i, true, -1);
				return;
			}
		}
	}
	stateManager.currentState = null;
	engine.camera.position.copy(stateManager.states[0].get_camera_position());
	engine.camera.position.z += 5;
}