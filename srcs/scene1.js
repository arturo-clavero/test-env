import * as THREE from 'three';
import {main_renderer} from './utils/camera.js';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const secondaryScene = new THREE.Scene();
const secondaryCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
secondaryScene.add(cube);

const renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

const texture = renderTarget1.texture;

const renderMaterial = new THREE.MeshBasicMaterial({
    map: texture,
});

secondaryCamera.position.z = 5;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube in the secondary scene
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the secondary scene to the texture
	main_renderer.setRenderTarget(renderTarget1);
    main_renderer.render(secondaryScene, secondaryCamera);
    main_renderer.setRenderTarget(null); // Reset to the default render target (the screen)
}

animate();

const scene1 = {
	"renderMaterial" : renderMaterial,
	"animate" : animate(),
	"renderTarget" : renderTarget1,
	"scene" : secondaryScene,
	"camera" : secondaryCamera,
}

export { scene1 };
