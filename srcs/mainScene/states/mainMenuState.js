import { StateManager } from '../../core/stateManager/StateManager';
import { State } from '../../core/stateManager/States';
import { SubState } from '../../core/stateManager/SubStates';
import { localMachineState, localMachineRestScreen } from "./localMachineState";
import { aiMachineState, aiMachineRestScreen } from './aiMachineState';
import { tourMachineState, tourMachineRestScreen } from './tournamentMachineState';

const mainSub = new SubState(
	"main controls", 
	null,
	-1,
	null,
	null,
	null, 
	null, 
	(event)=>{
		if (event.key === 'x')
			return{change : "state", index : 1};
		if (event.key === 'y')
			return{change : "state", index : 2};
		if (event.key === 'z')
			return{change : "state", index : 3};
	},
	null,
)
const mainState = new State(
	"main view",
	{
		pos: [0,2,7], 
		duration: 4, 
		ease: "power2.inOut"
	}, 
	[ mainSub ],
	(self)=>{
		if (!self.currentSubstate)
			self.changeSubstate(0);
	},
	()=>{},
	[],
);

const stateManager = new StateManager(
	[
		mainState, 
		localMachineState,
		aiMachineState,
		tourMachineState,
	],
);

export { stateManager }