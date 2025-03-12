import * as THREE from 'three';
import { Object } from '../objects/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from './simpleAssets';
import { scene1 } from './scene1';

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;
obj1.basePart.shapes[0].add_material(scene1.renderMaterial);
obj1.basePart.add_borders([0], new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 }));
const cube = obj1;

//div registration
//div scene
//div material

console.log(cube);
export {cube}