import * as THREE from 'three';
// import { Shape } from './utils/CustomShapes';
import { Model , Component} from './utils/CustomModel';


// //test 1 A: symetrical
// // const comp1 = new Shape([[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]);
// //test 1 B: asymetrical

// const comp1 = new Component([[1], [1]], 2);

// //test 2 A: group  material
const materialsgroup = [
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
];
const comp1 = new Component(
	[[0, 0, 3], [0, 1, 3], [1, 1, 3], [1, 0, 3]], 
	[[1, 0, 2], [1, 1, 2], [2, 1, 2], [2, 0, 2]],
	materialsgroup
);

const comp2 = new Component(
	[[0, 0, 3], [0, 1, 3], [1, 1, 3], [1, 0, 3]], 
	[[0, 0, 2], [0, 1, 2], [1, 1, 2], [1, 0, 2]],
	materialsgroup[0]
);

// //test 2 B: single material
// const singMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
// comp1.add_material(singMaterial);
// comp1.add_material(materialsgroup[0]);
// //test 3: borders

// //test 4: onclick 

// //optional positions for vidsualizing


// // const test1lay = comp1;
// // test Model hierarchy
// // const test1lay = new Model(comp1);

// // const test1lay = new THREE.Group();
// // // test1lay.add(comp1.self);
// // test1lay.add(comp1.get_borders([1, 1, 1, 1, 1, 1], lineBasicMaterial));
// // test1lay.position.z = 1;
// // test1lay.position.x = 0;
// // test1lay.position.y = 1;

// const shape = new THREE.Shape();
// shape.moveTo(0, 0);
// shape.lineTo(1, 0);
// shape.lineTo(1, 1);
// shape.lineTo(0, 1);
// shape.closePath(); // Close the path to complete the shape

// // Create a geometry from the shape's path
// // const geometry = new THREE.BufferGeometry().setFromPoints(shape.getPoints());
// const geometry = new THREE.ShapeGeometry(shape);

// // Create a material for the lines
// const material = new THREE.LineBasicMaterial({ color: 0x0000ff , linewidth: 5});

// // Create a line object from the geometry and material
// // const test1lay = new THREE.LineLoop(geometry, material);
// // const test1lay = new THREE.Mesh(geometry, material);

// let map = [];
// for (let i = 0; i < comp1.shapeParts.length; i++)
// 	map.push(1);

// map = [0, 1, 0, 0, 0, 0];
// comp1.get_borders(map, material);

// // comp2.self.scale.set(0.5, 0.5, 0.5);
// comp1.self.updateMatrixWorld(true);
// let pos2 = new THREE.Vector3();
// comp1.self.children[1].getWorldPosition(pos2);
// console.log("child pos:", pos2);

// comp1.self.position.x += 1;

// const index = 1;


//  pos2 = new THREE.Vector3();
//  comp1.self.updateMatrixWorld(true);
// comp1.self.children[index].getWorldPosition(pos2);
// console.log("child pos:", pos2);
// let localPosition = comp1.self.worldToLocal(pos2);
// console.log("local pos", localPosition);
// comp1.shapeParts[index].self.updateMatrixWorld();

// let bbox = new THREE.Box3().setFromObject(comp1.shapeParts[index].self);
// console.log(bbox.max);
// console.log(bbox.min);
// // comp2.self.position.set(pos2.x, pos2.y, pos2.z + 1);

// comp2.self.updateMatrixWorld();
// bbox = new THREE.Box3().setFromObject(comp2.self);
// console.log(bbox.max);
// console.log(bbox.min);
// console.log("comp2 pos", comp2.self.position);
// comp2.self.position.x += 0.5; 
// console.log("comp2 pos", comp2.self.position);


// let test1lay = comp1.self;
// comp1.self.add(comp2.self);
// comp2.shapeParts.push(comp2);

// comp2.self.updateMatrixWorld();
// bbox = new THREE.Box3().setFromObject(comp2.self);
// console.log(bbox.max);
// console.log(bbox.min);

// let test2lay = comp1.self;





const mod1 = new Model(comp1);
comp2.self.scale.set(0.5, 0.5, 0.5);


const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

let x = 3;
comp1.get_borders([x], lineBasicMaterial);
mod1.add_component(0.5, 0.5, 0, x, comp2)

const test1lay = mod1.self;

const test2lay = 2;
// mod1.self.rotateOnAxis()

export {test1lay, test2lay}