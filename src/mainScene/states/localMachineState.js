

import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';
import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, object, partIndex, surfaceIndex, localMachineObj } from '../objects/machines/localMachineObj';
import { StartScreen } from '../overlays/divs/start'
import { End } from '../overlays/divs/end';
	import { pongGame, startPongGame } from '../overlays/scenes/pong-game/Game';		
import { StateManager } from '../../core/stateManager/StateManager';
import { create_exit_alert } from '../overlays/alerts/exit_warning';
import { AlertManager } from '../overlays/alerts/Alerts';
import { controls } from '../overlays/divs/controls';
import * as THREE from 'three';

const divStart = new StartScreen('white', "START GAME");

const restScreen = new CssSubState(
	"rest",
	object,
	partIndex,
	surfaceIndex,
	divStart.div,
	0,
	()=>{
		divStart.enter();
		divStart.enterButton.element.style.visibility = "hidden";
	},
	null,
	null,
	()=>{ divStart.resize();},
	null,
	null,
)

const startScreen = new CssSubState(
	"start",
	object,
	partIndex,
	surfaceIndex,
	divStart.div,
	0,
	null,
	()=>{
		divStart.enterButton.element.style.visibility = "visible";
	},
	()=>{ divStart.exit();},
	()=>{ divStart.resize();},
	(event)=> { return divStart.keyHandler(event);},
	()=>{divStart.animate()},
)

const divControls = controls;
const controlScreen = new CssSubState(
	"controls", 
	object,
	partIndex,
	surfaceIndex,
	divControls.div,
	0,
	()=>{
		divControls['show-buttons']();
		divControls["enter"]("local");
	},
	null,
	()=>{
		divControls['hide-buttons']();
		divControls["exit"]()
	},
	()=>{divControls["resize"]()},
	(event)=>{return divControls["keyHandler"](event)},
	null
)

const gameScreen = new MeshSubState(
	"game", 
	screenSurface,
	pongGame,
	1,
	()=>{startPongGame("local")
		pongGame["enter"]()

	},
	()=>{
		new AlertManager().remove_latest_alert("exit alert");
		pongGame["exit"]()
	}
)

const divEnd = new End("white");
const endScreen = new CssSubState(
	"end", 
	object,
	partIndex,
	surfaceIndex,
	divEnd.div,
	0,
	()=>{divEnd.enter()},
	null,
	()=>{divEnd.exit()},
	()=>{divEnd.resize()},
	(event)=> { return divEnd.keyHandler(event);},
	()=>{divEnd.animate()},
)

const localMachineState = new State(
	"classic-game", 
	{
		pos: true,
		duration: 2,
		ease: "power2.inOut"
	}, 
	null,
	[
		restScreen,
		startScreen,
		controlScreen,
		gameScreen,//3
		endScreen
	],
	null,
	()=>{
		if (new StateManager().currentState.currentSubstate.name == "game")
			{
				console.log("tryong to exit game ... ")
				if (create_exit_alert() == "cancelled")
				{
					console.log("cancelled exit ....");
					return ("cancelled");
				}
			}
	},
	[
		screenMaterial,
		pongGame.renderMaterial,
	],
	// null,
	localMachineObj.self,
	new THREE.Vector3(0, 0, -1),
	1.5
)

export {localMachineState}