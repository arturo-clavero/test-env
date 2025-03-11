import * as THREE from 'three';
// import { Shape } from './utils/CustomShapes';
import { Model , Component} from './utils/CustomModel';


// //test 1 A: symetrical
// // const comp1 = new Shape([[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]);
// //test 1 B: asymetrical

// const comp1 = new Component([[1], [1]], 2);
 
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../assets/image1.jpg', 
	() => {
	 // console.log('Texture loaded successfully');
	},
	undefined,
	(error) => {
	  console.error('Error loading texture:', error);
	}
  );// //test 2 A: group  material
const textureMat =   new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
const materialsgroup = [
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	textureMat,
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
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	1,
	textureMat
);

const mod1 = new Model(comp1);
comp2.self.scale.set(0.5, 0.5, 0.5);


const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

let x = 2;
comp1.get_borders([x], lineBasicMaterial);
mod1.add_component(0.5, 0.5, 0, x, comp2)

function onClickMod(){
	console.log("clicked model");
}
mod1.add_onclick(onClickMod);

let test1lay = mod1.self;

const test2lay = 2;
// const geometry = new THREE.BoxGeometry(1, 1, 1);  // 1x1x1 Cube
// test1lay = new THREE.Mesh(geometry, textureMat);
// mod1.self.rotateOnAxis()
// console.log("c4",comp2.self);
export {test1lay, test2lay}