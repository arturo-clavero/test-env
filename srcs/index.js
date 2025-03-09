import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Modern import path for modules
import { backBox } from './backBox';
// import { arcadeMachine } from './arcadeMachine';
import { Shape } from './utils/CustomShapes';
import { Model , Component} from './utils/CustomModel';
import { test1lay, test2lay } from './test';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;  // Enable shadow maps on the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Optional: For softer shadows

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);  // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.SpotLight(0x0053f9, 50);  // White light
directionalLight.position.set(0, 6, 2);  // Position the light
directionalLight.castShadow = true;  // Enable shadow casting
scene.add(directionalLight);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

scene.add(backBox);
//scene.add(arcadeMachine);
console.log(test1lay);
scene.add(test1lay);
// scene.add(test2lay);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
	controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function getCameraSettings() {
	const settings = {
	  position: {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z
	  },
	  rotation: {
		x: camera.rotation.x,
		y: camera.rotation.y,
		z: camera.rotation.z
	  },
	  fov: camera.fov,
	  near: camera.near,
	  far: camera.far,
	  target: {
		x: controls.target.x,
		y: controls.target.y,
		z: controls.target.z
	  }
	};
  
	return settings;
  }

  // Add an event listener for keydown event
document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);  // event.key gives the name of the key (e.g., 'a', 'Enter')
    if (event.key === 'c' || event.key == 'C') {
		console.log(getCameraSettings());
    }
    // if (event.key === 'Enter') {
    //     console.log('Enter key was pressed!');
    // }
});
