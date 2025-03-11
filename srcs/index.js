import * as THREE from 'three';
import { MainEngine } from './mainSetUp';
import { backBox } from './objects/background/backBox';


const engine = new MainEngine();

engine.add(backBox, false);

function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}

animate();
