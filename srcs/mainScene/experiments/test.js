import * as THREE from 'three';
import { Object } from '../objects/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from './simpleAssets';
import { scene1 } from './scene1';

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;

//ADD A SCENE TO DIV
// obj1.basePart.shapes[0].add_material(scene1.renderMaterial);


const cube = obj1;

//div registration
//div scene
//div material

console.log(cube);
export {cube}