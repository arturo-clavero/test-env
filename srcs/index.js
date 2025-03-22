import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/MainEngine';
import { backBox } from './mainScene/objects/background/backBox';
import { stateManager } from './mainScene/states/mainMenuState';
import { localMachineObj } from './mainScene/objects/machines/localMachineObj';
// import { cube, stateManager } from './mainScene/experiments/test-basic';



const engine = new MainEngine();

engine.add(backBox, false);
engine.add(localMachineObj, false);

engine.stateManager = stateManager;
// state.which();


function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}

// scene1.updateSize(2000, 1000);

animate();
