

import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenSurface } from '../objects/machines/localMachineObj'
import { StartScreen } from '../overlays/divs/start'
import { form1 } from '../overlays/divs/form1';
import { scene1 } from '../overlays/scenes/scene1';
import { end } from '../overlays/divs/end';

// CREATE MODEL


//CREATE SUBSTATES
const div = new StartScreen('rgba(255, 0, 0, 0.2)');
const startScreen = new CssSubState(
	"start",
	screenSurface,
	div.div,
	()=>{div.enter()},
	()=>{div.exit()},
	()=>{div.resize()},
	(event)=> { return div.keyHandler(event);},
	()=>{div.animate()},
)

const formScreen = new CssSubState(
	"form",
	screenSurface,
	form1.div,
	form1.enter,
	form1.exit,
	form1.resize,
	(event)=> { return form1.keyHandler(event);},
	form1.animate,
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

const endScreen = new CssSubState(
	"end", 
	screenSurface,
	end.div,
	end.enter,
	end.exit,
	end.resize,
	(event)=>{
		end.keyHandler(event);
	}
)

const localMachineState = new State(
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



export { localMachineState}