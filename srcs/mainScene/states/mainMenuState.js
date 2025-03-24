import { StateManager } from '../../core/stateManager/StateManager';
import { State } from '../../core/stateManager/States';
import { SubState } from '../../core/stateManager/SubStates';
import { localMachineState, localMachineRestScreen } from "./localMachineState";
import { aiMachineState, aiMachineRestScreen } from './aiMachineState';
import { tourMachineState, tourMachineRestScreen } from './tournamentMachineState';

const mainSub = new SubState(
	"main controls", 
	null,
	()=>{
		localMachineRestScreen.enter();
		aiMachineRestScreen.enter();
		tourMachineRestScreen.enter();

	},
	null,
	()=>{

	}, 
	()=>{
		localMachineRestScreen.resize();
		aiMachineRestScreen.resize();
		tourMachineRestScreen.resize();
	}, 
	(event)=>{
		if (event.key === 'x')
			return{change : "state", index : 1};
		if (event.key === 'y')
			return{change : "state", index : 2};
		if (event.key === 'z')
			return{change : "state", index : 3};
	},
	()=>{
		aiMachineRestScreen.animate();
		aiMachineRestScreen.animate();
		tourMachineRestScreen.animate();
	}
)
const mainState = new State(
	"main view",
	{
		pos: [0,2,7], 
		duration: 4, 
		ease: "power2.inOut"
	}, 
	[ mainSub ]
);

const stateManager = new StateManager(
	[
		mainState, 
		localMachineState,
		aiMachineState,
		tourMachineState,
	]
);

export { stateManager }