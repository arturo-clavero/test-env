import { StateManager } from '../../core/stateManager/StateManager';
import { State } from '../../core/stateManager/States';
import { SubState } from '../../core/stateManager/SubStates';
import { aiMachineState } from './aiMachineState';
import { localMachineState } from "./localMachineState";
import { tourMachineState } from './tournamentMachineState';

const mainSub = new SubState(
	"main controls", 
	()=>{
	}, 
	()=>{
	}, 
	null, 
	()=>{
		localMachineState.substates[0].resize();
		aiMachineState.substates[0].resize();
		tourMachineState.substates[0].resize();
	}, 
	(event)=>{
		if (event.key === 'x')
			return{change : "state", index : 0};
	},
	()=>{
		localMachineState.substates[0].animate();
		aiMachineState.substates[0].animate();
		tourMachineState.substates[0].animate();
		//here animate the start screens!
	}
)
const mainState = new State(
	"main view",
	{
		pos: [0,0,10], 
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