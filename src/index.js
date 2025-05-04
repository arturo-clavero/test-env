import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/MainEngine';
import { stateManager, mainSceneObj } from './mainScene/states/mainMenuState';

import { backBox } from './mainScene/objects/background/backBox';
import { StateManager } from './core/stateManager/StateManager';

import { Socket } from './mainScene/utils/Socket';
import {animateBalls, test} from './mainScene/objects/machines/friends'
import { wheel_scroll_animations } from './core/stateManager/cameraMovement';
// import { create_redirection_alert } from './mainScene/overlays/alerts/redirection_warning';
import { Object } from './core/objectFactory/Object';
import { Part } from './core/objectFactory/Part';
const engine = new MainEngine();

let isAnimating = false;
let firstFrame = 0;
// console.log("TEST PART");

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
	//console.log("pre enter")
	new Socket();
	init_scene_state();
	if (!engine.sceneInitialized) {	
	//	console.log("add to engine...")
		engine.add(test, false);
		engine.add(backBox, false);
		engine.add(mainSceneObj, false);
		engine.stateManager = stateManager;
		engine.sceneInitialized = true;
	}
	if (!engine.stateManager)
		engine.stateManager = stateManager
	engine.addContainerWrapper(app_container);
}

export function uponEnter(){
	//console.log("upon enter")
	
	window.addEventListener('popstate', popstate);
	window.addEventListener("wheel", wheel_scroll_animations);
	window.addEventListener('resize', onResize);
	window.addEventListener('click', onClick);
	document.body.addEventListener('keydown', key_events);
	//console.log(engine.camera.position)
	//engine.resize()
	isAnimating = true;
	// engine.stateManager.currentState.currentSubstate.resize()
	window.dispatchEvent(new Event("resize"));
	firstFrame = 0;
	window.dispatchEvent(new Event("resize"));
	if (engine.stateManager.currentState == null)
		{
			//console.log(engine.camera.position)
			//console.log("entering main state")
			engine.stateManager.changeState(0, true, 1);
			//console.log(engine.camera.position)
	
	
		}
	animate();
	window.dispatchEvent(new Event("resize"));
	engine.stateManager.currentState.currentSubstate.resize()

	// document.body.focus()
	// engine.container.focus()
	// engine.container.parentElement.focus()
}

export function animate() {
	if (!isAnimating) return ;
	
	// test.self.rotation.z += 0.001

	//console.log("animate");
	requestAnimationFrame(animate);
	animateBalls()
	engine.animate();
	if (firstFrame < 2)
	{
		// console.log("hey!!!")
		window.dispatchEvent(new Event("resize"));
		firstFrame++;
	}
}

//exitScene is called in beforeUnmount() or onBeforeUnmount().
function exitScene(){
	isAnimating = false;
	engine.removeContainerWrapper();
	window.removeEventListener('popstate', popstate);
	window.removeEventListener("wheel", wheel_scroll_animations);
	window.removeEventListener('resize', onResize);
	window.removeEventListener('click', onClick);
	document.body.removeEventListener("keydown", key_events)
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

function key_events(event){
	// console.log("clicked key!")
	stateManager.handleKeyPress(event)
}

function init_scene_state(){
	//console.log("init scene...")
	let stateFromURL = window.location.pathname;
	//console.log("state from url", stateFromURL)
	if (stateFromURL){ 
		const path = stateFromURL.slice(1); // "lobby"
		for (let i = 1; i < stateManager.states.length; i++)
		{
			if (stateManager.states[i].name == path)
			{
				// console.log("switching to state ", i)
				stateManager.changeState(i, true, -1);
				return;
			}
		}
	}
	stateManager.currentState = null;
	engine.camera.position.copy(stateManager.states[0].get_camera_position());
	engine.camera.position.z += 20;
}