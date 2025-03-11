import * as THREE from 'three';

const main_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const main_renderer = new THREE.WebGLRenderer();

export { main_camera, main_renderer }