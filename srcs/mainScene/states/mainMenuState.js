import { StateManager } from '../../core/stateManager/StateManager';
import { State } from '../../core/stateManager/States';
import { SubState } from '../../core/stateManager/SubStates';
import { localMachineState } from "./localMachineState";

const mainSub = new SubState(
	"main controls", 
	()=>{
		// localMachineState.resize();
	}, 
	()=>{
		localMachineState.substates[0].resize();
		localMachineState.substates[0].enter();
	}, 
	null, 
	()=>{
		localMachineState.substates[0].resize();
	}, 
	(event)=>{
		if (event.key === 'x')
			return{change : "state", index : 0};
	},
	()=>{
		localMachineState.animate();
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
	]
);

export { stateManager }