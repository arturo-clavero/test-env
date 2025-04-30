import { Object } from '../../../core/objectFactory/Object'
import { Part } from '../../../core/objectFactory/Part';
import { StateManager } from '../../../core/stateManager/StateManager';
import { arcade_points, arcade_side_points, scale_points } from '../assets';
import { screenMaterial } from '../simpleAssets';
import * as THREE from 'three';

const base_part = new Part(
	scale_points(arcade_points, 2, 6), 
	2.5,
	[
		new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0xff7f00, side: THREE.DoubleSide }), // Orange
		new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide }), // Yellow
		new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }), // Green
		new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide }), // Blue
		new THREE.MeshStandardMaterial({ color: 0x800080, side: THREE.DoubleSide }), // Purple
		new THREE.MeshStandardMaterial({ color: 0xff1493, side: THREE.DoubleSide }), // Pink
		new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }), // Black
	  ]
);const sideFactor = 1;
const sideLpart = new Part(//should be on blue aka index 0
	scale_points(arcade_side_points, 2 * sideFactor, 6 * sideFactor), 
	0.01,
	[
		new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
		new THREE.MeshStandardMaterial({ color: 0xff7f00, side: THREE.DoubleSide }), // Orange
		new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide }), // Yellow
		new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }), // Green
		new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide }), // Blue
		new THREE.MeshStandardMaterial({ color: 0x800080, side: THREE.DoubleSide }), // Purple
		new THREE.MeshStandardMaterial({ color: 0xff1493, side: THREE.DoubleSide }), // Pink
		new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }), // Black
	  ]
);
sideLpart.self.position.set(0, 0, 0);
const sideRpart = new Part(	//shuld be on gree,aka index 1
	scale_points(arcade_points, 2 * sideFactor, 6 * sideFactor), 
0.3,
[
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }), // Red
	new THREE.MeshStandardMaterial({ color: 0xff7f00, side: THREE.DoubleSide }), // Orange
	new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide }), // Yellow
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide }), // Green
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide }), // Blue
	new THREE.MeshStandardMaterial({ color: 0x800080, side: THREE.DoubleSide }), // Purple
	new THREE.MeshStandardMaterial({ color: 0xff1493, side: THREE.DoubleSide }), // Pink
	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }), // Black
  ]
);
const object = new Object(base_part);
object.self.position.z = 3;
object.self.position.x = -4;
object.self.position.y = 2.8;
object.self.rotation.y -= Math.PI / 2;

const localMachineObj = object;
localMachineObj.add_onclick(()=>{ new StateManager().changeState(1);})
// sideLpart.self.rotation.y += Math.PI 
// localMachineObj.add_part(0.5, 0.5, 0, 0, sideLpart, [0, 1, 0])
console.log("")
console.log("")
console.log("ADD PART TEST START")
console.log("")
console.log("")
localMachineObj.add_part(0.5, 0.5, 0, 0, sideLpart, [0, 1, 0])
localMachineObj.add_part(0.5, 0.5, 0, 1, sideRpart, [0, 1, 0], -1)
console.log("")
console.log("")
console.log("ADD PART TEST END")
console.log("")
console.log("")
const partIndex = 0;
const surfaceIndex = 5;
const screenSurface = object.self.children[partIndex].children[surfaceIndex].userData.instance;
screenSurface.add_material( screenMaterial);
const center = object.self.position.clone();
center.z += 2;

export {localMachineObj, screenSurface, center, object, partIndex, surfaceIndex}