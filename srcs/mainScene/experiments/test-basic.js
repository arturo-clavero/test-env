import * as THREE from 'three';
import { Object } from '../objects/Object'
import { materialsgroup, singleMaterial, lineBasicMaterial,
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from './simpleAssets';
import { scene1 } from './scene1';
import { form1 } from './div1';
import { State } from '../state/States';
import { MeshSubState , CssSubState} from '../state/SubStatesExtends';
import { StateManager } from '../state/StateManager';
import { SubState } from '../state/SubStates';

// console.log("h");
const obj1 = new Object(part_sym_3d);
obj1.self.position.z = 3;
// console.log("h");
console.log(" 3D... ", part_sym_2d.shapes[0].vertex3d);
console.log(" 	2D... ", part_sym_2d.shapes[0].vertex2d);
console.log(part_sym_2d.self.position, part_sym_2d.self.scale, part_sym_2d.self.rotation);
const obj2 = part_sym_2d;
obj2.self.scale.set(0.5, 0.5, 0.5);
// let box = new THREE.Box3().setFromObject(obj2.self); // Compute bounding box for group
//     let center = new THREE.Vector3();
// 	console.log("centerL ", center);
//     box.getCenter(center); // Get the center of the bounding box

//     // Move the group to center it at (0, 0, 0)
// obj2.self.children.forEach(child => {
//         child.position.sub(center);
//     });

// obj2.self.scale.set(0.5, 0.5, 0.5);
console.log(" 3D... ", part_sym_3d.shapes[0].vertex3d);
console.log(" 	2D... ", part_sym_3d.shapes[0].vertex2d);
console.log(part_sym_3d.self.position, part_sym_3d.self.scale, part_sym_3d.self.rotation);

//2 is incorrect normal  ! not caught
//1 is incorrect normal  ! not caught ////
let index = 0;
part_sym_3d.add_borders([index], lineBasicMaterial);
obj1.add_part(0.5, 0.5, 0, index, obj2);
const cube = obj1;

const main = new State("main view", {pos: [0,0,5], duration: 4, ease: "power2.inOut"}, []);
const stateManager = new StateManager([main]);

export { cube, stateManager }