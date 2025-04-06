

import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';
import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, center, object, partIndex, surfaceIndex } from '../objects/machines/localMachineObj';
import { StartScreen } from '../overlays/divs/start'
import { Form2 } from '../overlays/divs/form2';
import { End } from '../overlays/divs/end';
	import { pongGame, startPongGame } from '../overlays/scenes/pong-game/Game';		


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
	(event)=> { return divStart.keyHandler(event);},
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

const divForm = new Form2("white");
const formScreen = new CssSubState(
	"form",
	object,
	partIndex,
	surfaceIndex,
	divForm.div,
	0,
	()=>{divForm.enter();},
	null,
	()=>{divForm.exit();},
	()=>{divForm.resize()},
	(event)=> { return divForm.keyHandler(event);},
	()=>{divForm.animate()},
)

const fakeGameScreen = new MeshSubState(
	"rest", 
	screenSurface,
	pongGame,
	1,
	()=>{startPongGame("local")},
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
	"local game screen", 
	{
		pos: [center.x,center.y,center.z],
		duration: 2,
		ease: "power2.inOut"
	}, 
	[
		restScreen,
		startScreen, 
		formScreen,
		fakeGameScreen,
		endScreen
	],
	(self)=>{
		self.changeSubstate();
	},
	(self)=>{
		if (self.currentSubstate.exit() == "cancelled")
			return "cancelled";
		self.changeSubstate(0);
	},
	[
		screenMaterial,
		pongGame.renderMaterial,
	],
)

export {localMachineState}