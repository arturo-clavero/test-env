
import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, center, object, partIndex, surfaceIndex } from '../objects/machines/tournamentMachineObj';
import { scene1 } from '../overlays/scenes/scene1';
import { StartScreen } from '../overlays/divs/start'
import { Form1 } from '../overlays/divs/form1';
import { fakeGame } from '../overlays/scenes/fakeGame';
import { End } from '../overlays/divs/end';
import { pongGame, startPongGame } from '../overlays/scenes/pong-game/Game';		

const divStart = new StartScreen('white', "TOURNAMENT", 1);

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
	()=>{ divStart.exit();},
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
		divStart.enter();
		divStart.enterButton.element.style.visibility = "visible";
	},
	()=>{ divStart.exit();},
	()=>{ divStart.resize();},
	(event)=> { return divStart.keyHandler(event);},
	()=>{divStart.animate()},
)
const divForm = new Form1("white");
const formScreen = new CssSubState(
	"form",
	object,
	partIndex,
	surfaceIndex,
	divForm.div,
	0,
	()=>{divForm.enter()},
	null,
	()=>{divForm.exit()},
	()=>{divForm.resize()},
	(event)=> { return divForm.keyHandler(event);},
	()=>{divForm.animate()},
)

const fakeGameScreen = new MeshSubState(
	"rest", 
	screenSurface,
	fakeGame,
	2,
	null,
	null,
	null,
	null,
	(event)=> { return divForm.keyHandler(event);},
)

const divEnd = new End();
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

const tourMachineState = new State(
	"tour game screen", 
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
		endScreen,
	],
	(self)=>{
		if (self.currentSubstateIndex == 0)
			self.changeSubstate();
	},
	(self)=>{
		if (self.currentSubstateIndex != 2)
		{
			self.currentSubstate.exit();
			self.changeSubstate(0);
		}
	},
	[
		screenMaterial,
		scene1.renderMaterial,
		fakeGame.renderMaterial,
	],

)

export { tourMachineState}