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
import { friendState, background_friends } from './friendsState';
import { MainEngine } from '../utils/MainEngine';
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
	scale_points(points, 30, 10), 
	2,
	[
		new THREE.MeshStandardMaterial({ color: 0x800080, side: THREE.DoubleSide }), // Purple
	  ]
	  );
const mainSceneObj = new Object(part_test);
mainSceneObj.self.position.x = 0;
mainSceneObj.self.position.y = 0;
mainSceneObj.self.position.z = 0;
mainSceneObj.self.rotation.x += Math.PI/2

mainSceneObj.add_object(0.31, 0.6, [0, 1], localMachineObj, [0, 1, 0], -1)
localMachineObj.self.rotation.y -= Math.PI/2
localMachineObj.self.rotation.z += Math.PI/2
localMachineObj.self.position.z -= 2
localMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})

mainSceneObj.add_object(0.4, 0.7, [0, 1], aiMachineObj, [0, 1, 0], -1)
aiMachineObj.self.rotation.z += Math.PI/2
aiMachineObj.self.rotation.y -= Math.PI/2

aiMachineObj.add_onclick(()=>{ new StateManager().changeState(2);})
let d = 1.1
aiMachineObj.self.scale.set(d, d, 1)
aiMachineObj.self.position.z -= 2.3

mainSceneObj.add_object(0.55, 0.7, [0, 1], tourMachineObj, [0, 1, 0], -1)
tourMachineObj.self.rotation.y -= Math.PI/2
tourMachineObj.self.rotation.z += Math.PI/2
tourMachineObj.self.position.z -= 3
tourMachineObj.add_onclick(()=>{ new StateManager().changeState(3);})
let f = 1.35
tourMachineObj.self.scale.set(f, f, f * 1.25)
tourMachineObj.self.position.y += 1

mainSceneObj.add_object(0.8, 0.3, [0, 0], friends_machine, [0, 1, 0], 1)
friends_machine.self.rotation.x += Math.PI/2
friends_machine.self.position.y += 6
friends_machine.self.position.z -= 4
// friends_machine.self.rotation.y -= Math.PI/2
// friends_machine.self.rotation.z -= Math.PI/2
friends_machine.add_onclick(()=>{ new StateManager().changeState(4);})
new MainEngine().clickableObjects.push(localMachineObj.self, aiMachineObj.self, tourMachineObj.self, friends_machine.self)

const baseY = friends_machine.self.position.y;
const delta = 0.2
let dir = 1
let floatTime = 0;
const mainSub = new SubState(
	"main controls", 
	null,
	-1,
	null,
	null,
	null, 
	null, 
	null,
	()=>{
		if (background_friends)
		{
			floatTime += 0.06;
			const pulse = 1 + Math.sin(floatTime * 0.5) * 0.025;
			friends_machine.self.scale.set(pulse, pulse, pulse);
		}
	}
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