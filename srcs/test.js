import * as THREE from 'three';
import { Model , Component} from './utils/CustomModel';


const comp1 = new Component("symmetrical", [[0, 0, 3], [0, 1, 3], [1, 1, 3], [1, 0, 3]], 2);
const materialsgroup = [
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
];
const singMaterial = 	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });

comp1.add_material(materialsgroup);
comp1.self.position.x = 0;
console.log(comp1);

// const test1lay = comp1;
const test1lay = new Model(comp1);

export {test1lay}