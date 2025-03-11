import * as THREE from 'three';

const camera_global = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export { camera_global }