import * as THREE from 'three';
import { Object } from '../objects/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from './simpleAssets'

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;
const cube = obj1;

//div registration
//div scene
//div material

console.log(cube);
export {cube}