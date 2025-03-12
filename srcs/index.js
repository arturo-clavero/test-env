import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/mainSetUp';
import { backBox } from './mainScene/objects/background/backBox';
import { cube } from './mainScene/experiments/test';
import { scene1 } from './mainScene/experiments/scene1';

const engine = new MainEngine();

engine.add(backBox, false);
engine.add(cube, false);

const mat = new THREE.MeshStandardMaterial(0x0000ff);
// cube.self.scale.x = 2;

function animate() {
	// console.log("main animate");
	requestAnimationFrame(animate);
	engine.animate();
	scene1.animate();
}

scene1.updateSize(2000, 1000);

animate();
