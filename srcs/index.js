import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/mainSetUp';
import { backBox } from './mainScene/objects/background/backBox';
import { StateManager } from './mainScene/state/StateManager';
// import { cube } from './mainScene/experiments/test';
import { cube, stateManager } from './mainScene/experiments/test-basic';



const engine = new MainEngine();

engine.add(backBox, false);
engine.add(cube, false);

const state  = new StateManager();
engine.stateManager =state;
// state.which();


function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}

// scene1.updateSize(2000, 1000);

animate();
