import * as THREE from 'three';
import { scene1 } from './scene1'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { Shape } from './utils/CustomShapes';
import { Model , Component} from './utils/CustomModel';
import { main_camera } from './utils/camera';


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
// const comp1 = new Component(
// 	[[0, 0, 3], [0, 1, 3], [1, 1, 3], [1, 0, 3]], 
// 	[[1, 0, 2], [1, 1, 2], [2, 1, 2], [2, 0, 2]],
// 	materialsgroup
// );

const comp2 = new Component(
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	1,
	materialsgroup
);

// const mod1 = new Model(comp1);
comp2.self.scale.set(0.5, 0.5, 0.5);


const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

// let x = 2;
// comp1.add_borders([x], lineBasicMaterial);
// mod1.add_component(0.5, 0.5, 0, x, comp2)

function onClickMod(){
	console.log("clicked model");
}
// mod1.add_onclick(onClickMod);

// let test1lay = mod1.self;

const test2lay = 2;
// Create 3D text geometry
comp2.add_borders([0], lineBasicMaterial);
const mod2 = new Model(comp2);

// const loader = new FontLoader();
// let textMesh1, textMesh2;
// loader.load('https://threejs.org/examples/fonts/optimer_regular.typeface.json', (font) => {
//     const textGeometry1 = new TextGeometry('ALIAS:', {
//         font: font,
//         size: 0.06,
//         height: 0.04,
// 		depth: 0.01,
//     });
// 	const textGeometry2 = new TextGeometry('OPONNENT\'s ALIAS:', {
//         font: font,
//         size: 0.04,
//         height: 0.04,
// 		depth: 0.01,
//     });
// 	console.log(textGeometry1);

// 	// textGeometry.center();
// 	// const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff});
//     const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff , wireframe:true});

//     textMesh1 = new THREE.Mesh(textGeometry1, textMaterial);
// 	comp2.add_object(0.2, 0.6, 0, textMesh1, [0, 0, 1]);
// 	textMesh2 = new THREE.Mesh(textGeometry2, textMaterial);
// 	comp2.add_object(0.2, 0.3, 0, textMesh2, [0, 0, 1]);
// });

comp2.self.position.z = 0;
const test1lay = comp2.self;
console.log(comp2.self.position);
comp2.self.position.z += 4;
comp2.shapeParts[0].add_material(scene1.renderMaterial);
export {test1lay, test2lay}