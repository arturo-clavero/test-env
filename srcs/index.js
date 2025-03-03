import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube setup
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

let planeGeo = new THREE.PlaneGeometry(25, 20);
let planeMat1 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
let planeMat2 = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
let planeMat3 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
let floor = new THREE.Mesh(planeGeo, planeMat1);
let back =  new THREE.Mesh(planeGeo, planeMat2);
let left =  new THREE.Mesh(planeGeo, planeMat3);
let right =  new THREE.Mesh(planeGeo, planeMat3);
floor.position.y = -2
floor.position.z = -15
floor.rotation.x = - Math.PI / 2.5;
scene.add(floor);
back.position.z = -20
back.position.y = 5
scene.add(back);
left.rotation.y = Math.PI / 2;
left.position.x = - 10
left.position.z = -20
scene.add(left);

// Set camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cube for animation
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
