

import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenSurface, center } from '../objects/machines/localMachineObj'
import { StartScreen } from '../overlays/divs/start'
import { Form2 } from '../overlays/divs/form2';
import { scene1 } from '../overlays/scenes/scene1';
import { End } from '../overlays/divs/end';

const divStart = new StartScreen('rgba(255, 0, 0, 0.2)');
const startScreen = new CssSubState(
	"start",
	screenSurface,
	divStart.div,
	()=>{divStart.enter()},
	()=>{divStart.exit()},
	()=>{divStart.resize()},
	(event)=> { return divStart.keyHandler(event);},
	()=>{divStart.animate()},
)

const divForm = new Form2();
const formScreen = new CssSubState(
	"form",
	screenSurface,
	divForm.div,
	()=>{divForm.enter()},
	()=>{divForm.exit()},
	()=>{divForm.resize()},
	(event)=> { return divForm.keyHandler(event);},
	()=>{divForm.animate()},
)

const restScreen = new MeshSubState(
	"rest", 
	screenSurface,
	scene1,
	null,
	null,
	null,
	(event)=>{ 
		if (event.key === 'Enter')
			return {change : "substate"};
	}
)

const divEnd = new End();
const endScreen = new CssSubState(
	"end", 
	screenSurface,
	divEnd.div,
	()=>{divEnd.enter()},
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
		startScreen, 
		formScreen, 
		restScreen, 
		endScreen
	]
)



export { localMachineState}