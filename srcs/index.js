import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/MainEngine';
import { stateManager } from './mainScene/states/mainMenuState';

import { backBox } from './mainScene/objects/background/backBox';
import { localMachineObj } from './mainScene/objects/machines/localMachineObj';
import { aiMachineObj } from './mainScene/objects/machines/aiMachineObj';
import { tourMachineObj } from './mainScene/objects/machines/tournamentMachineObj';
import { StateManager } from './core/stateManager/StateManager';

import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { screenSurface } from './mainScene/objects/machines/aiMachineObj';

import { arcadeMachine } from './mainScene/objects/arcadeMachine';
import { Socket } from './mainScene/utils/Socket';

document.addEventListener('keydown', (event) => {
	if (event.key == "i")
	{
		const stateManager = new StateManager();
		console.log("Now: ", stateManager.currentState.name);
		stateManager.states.forEach(state=>
		{
			console.log("state ", state.name, "substate: ", state.currentSubstate.name);
		}
		)
	}
});

const engine = new MainEngine();

engine.add(backBox, false);
engine.add(localMachineObj, true);
engine.add(aiMachineObj, true);
engine.add(tourMachineObj, true);

engine.stateManager = stateManager;
new Socket()
//shakeCamera(engine.camera);
function animate() {
	requestAnimationFrame(animate);
	engine.animate();
}


animate();
