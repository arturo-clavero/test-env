import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/mainSetUp';
import { backBox } from './mainScene/objects/background/backBox';
import { cube } from './mainScene/experiments/test';

const engine = new MainEngine();

engine.add(backBox, false);
engine.add(cube, false);

function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}

animate();
