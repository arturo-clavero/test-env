
import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenSurface } from '../objects/machines/tournamentMachineObj'
import { StartScreen } from '../overlays/divs/start'
import { Form1 } from '../overlays/divs/form1';
import { scene1 } from '../overlays/scenes/scene1';
import { End } from '../overlays/divs/end';

// CREATE MODEL


//CREATE SUBSTATES

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

const divForm = new Form1();
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

const tourMachineState = new State(
	"local game screen", 
	{
		pos: [-2,2,5],
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



export { tourMachineState}