import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/MainEngine';
import { stateManager } from './mainScene/states/mainMenuState';

import { backBox } from './mainScene/objects/background/backBox';
import { localMachineObj } from './mainScene/objects/machines/localMachineObj';
import { aiMachineObj } from './mainScene/objects/machines/aiMachineObj';
import { tourMachineObj } from './mainScene/objects/machines/tournamentMachineObj';

// import { cube, stateManager } from './mainScene/experiments/test-basic';



const engine = new MainEngine();

engine.add(backBox, false);
engine.add(localMachineObj, false);
engine.add(aiMachineObj, false);
engine.add(tourMachineObj, false);


engine.stateManager = stateManager;
// state.which();


function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}

// scene1.updateSize(2000, 1000);

animate();
