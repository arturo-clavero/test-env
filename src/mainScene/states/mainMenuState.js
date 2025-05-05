import { StateManager } from '../../core/stateManager/StateManager';
import { State } from '../../core/stateManager/States';
import { SubState } from '../../core/stateManager/SubStates';
import { localMachineState } from "./localMachineState";
import { aiMachineState } from './aiMachineState';
import { tourMachineState } from './tournamentMachineState';
import { localMachineObj } from '../objects/arcadeMachines/localMachineObj';
import { aiMachineObj } from '../objects/arcadeMachines/aiMachineObj';
import { tourMachineObj } from '../objects/arcadeMachines/tournamentMachineObj';
import * as THREE from 'three';
import { Part } from '../../core/objectFactory/Part';
import { Object } from '../../core/objectFactory/Object';
import { friends_machine } from '../objects/friends/friendMachine';
import { friendState } from './friendsState';
const points = [
	[0, 0],         // [w[0], h[0]]
	[0, 1],         // [w[0], h[6]]
   [1, 1],
   [1, 0]
];

// Function to scale points
function scale_points(points, wFactor, hFactor) {
	return points.map(([x, y]) => [
		x * wFactor,   // Apply width factor
		y * hFactor    // Apply height factor
	]);
}

const part_test = new Part(
	scale_points(points, 20, 20), 
	3,
	[
		new THREE.MeshStandardMaterial({ color: 0x800080, side: THREE.DoubleSide }), // Purple
	  ]
	  );
const mainSceneObj = new Object(part_test);
mainSceneObj.self.position.x = 0;
mainSceneObj.self.position.y = 4;
mainSceneObj.self.position.z = -2;

mainSceneObj.add_object(0.2, 0.5, [0, 0], localMachineObj, [0, 1, 0], 1)
localMachineObj.self.rotation.y -= Math.PI/2
localMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})

mainSceneObj.add_object(0.4, 0.5, [0, 0], aiMachineObj, [0, 1, 0], 1)
aiMachineObj.self.rotation.y -= Math.PI/2
aiMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})

mainSceneObj.add_object(0.6, 0.5, [0, 0], tourMachineObj, [0, 1, 0], 1)
tourMachineObj.self.rotation.y -= Math.PI/2
tourMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})

mainSceneObj.add_object(0.8, 0.5, [0, 0], friends_machine, [0, 1, 0], 1)
friends_machine.self.rotation.x += Math.PI/2
// friends_machine.self.rotation.z -= Math.PI/2
friends_machine.add_onclick(()=>{ new StateManager().changeState(4);})
//friends_machine.self.position.z -= 4

const mainSub = new SubState(
	"main controls", 
	null,
	-1,
	null,
	null,
	null, 
	null, 
	null,
	null,
	mainSceneObj.self
)

const mainState = new State(
	"lobby",
	{
		pos: true, 
		duration: 2, 
		ease: "power2.inOut"
	}, 
	{
		pos: true, 
		duration: 5,
		ease: "power2.inOut"
	},
	[ mainSub ],
	null,
	null,
	[],
	// null,
	mainSceneObj.self,
	new THREE.Vector3(0, 0, -1),
	1.25,
);

const stateManager = new StateManager(
	[
		mainState, 
		localMachineState,
		aiMachineState,
		tourMachineState,
		friendState,
	],
);

export { stateManager, mainSceneObj}