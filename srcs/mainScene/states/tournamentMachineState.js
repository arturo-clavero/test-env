
import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, center } from '../objects/machines/tournamentMachineObj';
import { scene1 } from '../overlays/scenes/scene1';
import { StartScreen } from '../overlays/divs/start'
import { Form1 } from '../overlays/divs/form1';
import { fakeGame } from '../overlays/scenes/fakeGame';
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
	},
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


const divForm = new Form1("white");
const formScreen = new CssSubState(
	"form",
	screenSurface,
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



const tourMachineRestScreen = restScreen;

export { tourMachineState, tourMachineRestScreen}