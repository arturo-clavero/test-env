import { StateManager } from '../../../core/stateManager/StateManager';
import * as THREE from 'three';
import { make_arcade_machine, add_controls } from './arcadeMachineTemplate';

const machine = make_arcade_machine({
	width: 6,
	height: 3, 
	thick: 2.5,
	screenBorderThick: 0.3,
	sideThick: 0.001,
	material: new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
	border: new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 5 }),
})

const localMachineObj = machine.object;
// add_controls(1, "handle", localMachineObj)

localMachineObj.self.position.z = 3;
localMachineObj.self.position.x = -4;
localMachineObj.self.position.y = 2.8;
localMachineObj.self.rotation.y -= Math.PI / 2;
localMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})

const partIndex = machine.partIndex;
const surfaceIndex = machine.surfaceIndex;
const screenSurface = machine.screenSurface;

const center = localMachineObj.self.position.clone();
center.z += 2;

export {localMachineObj, screenSurface, center, partIndex, surfaceIndex}