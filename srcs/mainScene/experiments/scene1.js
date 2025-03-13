import * as THREE from 'three';
import {MainEngine} from '../utils/mainSetUp.js';

const engine = new MainEngine();

console.log("scene 1 loading");
const secondaryScene = new THREE.Scene();
const secondaryCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
secondaryScene.add(ambientLight);

const topLight = new THREE.SpotLight(0x0053f9, 50);
topLight.position.set(0, 6, 2);
topLight.castShadow = true;
secondaryScene.add(topLight);


const geo = new THREE.PlaneGeometry(100, 200);
const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(geo, mat);
secondaryScene.add(plane);
plane.position.z = -10;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
cube.castShadow = true;
secondaryScene.add(cube);

const renderTarget = new THREE.WebGLRenderTarget(1000, 1000);
const texture = renderTarget.texture;
const renderMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(1, 1, 1),
    emissiveMap: texture,
    emissiveIntensity: 10,
    roughness: 0.5,
    metalness: 0.5,
});
// const renderMaterial = new THREE.MeshBasicMaterial({
//     map: texture,
// });

secondaryCamera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	engine.renderer.setRenderTarget(renderTarget);
    engine.renderer.render(secondaryScene, secondaryCamera);
    engine.renderer.setRenderTarget(null);
}

function updateSize(width, height){
	secondaryCamera.aspect = width / height;
	secondaryCamera.updateProjectionMatrix();
	renderTarget.setSize(width, height);
}

document.addEventListener('keydown', function(event) {
    keyDown(event);
});

function keyDown(event){
	if (cube.material.color.g == 1)
		cube.material.color.set(0x0000ff);
	else if (cube.material.color.b == 1)
		cube.material.color.set(0xff0000);
	else
		cube.material.color.set(0x00ff00);
}

//how to mount a div  to 3d ... 

const scene1 = {
	"renderMaterial" : renderMaterial,
	"animate" : animate,
	"updateSize" : updateSize,
}

export { scene1 };
