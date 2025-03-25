

import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenSurface, center } from '../objects/machines/localMachineObj';
import { scene1 } from '../overlays/scenes/scene1';
import { StartScreen } from '../overlays/divs/start'
import { Form2 } from '../overlays/divs/form2';
import { fakeGame } from '../overlays/scenes/fakegame';
import { End } from '../overlays/divs/end';


const restScreen = new MeshSubState(
	"rest", 
	screenSurface,
	scene1,
	1,
	null,
	null,
	null,
	null,
	(event)=>{ 
		if (event.key === 'Enter')
			return {change : "substate"};
	}
)

const divStart = new StartScreen('black');
const startScreen = new CssSubState(
	"start",
	screenSurface,
	divStart.div,
	1,
	null,
	()=>{
		divStart.enter();
	},
	()=>{
		divStart.exit();
		restScreen.exit();
	},
	()=>{
		divStart.resize();
		restScreen.resize();
	},
	(event)=> {
		return (divStart.keyHandler(event) || restScreen.keyHandler(event));
	},
	()=>{
		divStart.animate();
		restScreen.animate();
	},
)

const divForm = new Form2("white");
const formScreen = new CssSubState(
	"form",
	screenSurface,
	divForm.div,
	0,
	()=>{divForm.enter();},
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

const divEnd = new End("white");
const endScreen = new CssSubState(
	"end", 
	screenSurface,
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
		self.currentSubstate.exit();
		self.changeSubstate(0);
	},
	[
		screenSurface.material,
		scene1.renderMaterial,
		fakeGame.renderMaterial,
	],
)

const localMachineRestScreen = restScreen;

export {localMachineState, localMachineRestScreen}