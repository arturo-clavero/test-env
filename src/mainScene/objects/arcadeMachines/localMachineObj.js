import { StateManager } from '../../../core/stateManager/StateManager';
import * as THREE from 'three';
import { make_arcade_machine, add_controls } from './arcadeMachineTemplate';
import { MainEngine } from '../../utils/MainEngine';

const machine = make_arcade_machine({
	width: 6,
	height: 1, 
	thick: 2.5,
	// screenBorderThick: 0.3,
	sideThick: 0.01,
	material: new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
	// border: new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 }),
	border: new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
})

const localMachineObj = machine.object;
add_controls(1, "handle", localMachineObj)
const partIndex = machine.partIndex;
const surfaceIndex = machine.surfaceIndex;
const screenSurface = machine.screenSurface;

const center = localMachineObj.self.position.clone();
center.z += 2;

export {localMachineObj, screenSurface, center, partIndex, surfaceIndex}