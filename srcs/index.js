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

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = 0;
document.body.appendChild(cssRenderer.domElement);


//MAKE DOM ELEMENT EXAMPLE
const div = document.createElement("div");
div.style.display = 'flex';
div.style.justifyContent = 'center';
div.style.alignItems = 'center';
div.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
div.style.border= "5px dashed white";
const inner_div = document.createElement("div");
inner_div.style.display = "flex";
inner_div.style.justifyContent = "center";
inner_div.style.alignItems = "center";
inner_div.style.flexDirection = "column";
inner_div.style.width = "100%";
inner_div.style.height = "100%";
div.appendChild(inner_div);
const text = document.createElement("label");
text.textContent = "Hello, CSS3D!";
text.style.color = "white";
text.style.fontSize = "100px";
inner_div.appendChild(text);

//MAKE 3D OBJECT AND ADD TO SURFACE
const label = new CSS3DObject(div);
label.position.set(0, 0, 0);
aiMachineObj.add_part(0.5, 0.5, 0, 0, label, [0, 0, 1]);

//RESIZE!
const boundingBox = new THREE.Box3().setFromObject(screenSurface.self);
const worldSize = new THREE.Vector3();
boundingBox.getSize(worldSize);
const topLeft = new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z);
const bottomRight = new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z);
const toScreenPosition = (pos, camera) => {
    const vector = pos.clone().project(camera);
    return {
        x: (vector.x * 0.5 + 0.5) * window.innerWidth,
        y: (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight
    };
};
const screenTopLeft = toScreenPosition(topLeft, engine.camera);
const screenBottomRight = toScreenPosition(bottomRight, engine.camera);
const pixelWidth = Math.abs(screenBottomRight.x - screenTopLeft.x);
const pixelHeight = Math.abs(screenBottomRight.y - screenTopLeft.y);
const scaleX = pixelWidth / worldSize.x;
const scaleY = pixelHeight / worldSize.y;
const scaleFactor = 1 / Math.min(scaleX, scaleY);
div.style.width = `${pixelWidth}px`;
div.style.height = `${pixelHeight}px`;
label.scale.set(scaleFactor, scaleFactor, scaleFactor);


function animate() {
	requestAnimationFrame(animate);
	engine.animate();
	cssRenderer.render(engine.scene, engine.camera);
}

animate();

window.addEventListener("resize", () => {
	cssRenderer.setSize(window.innerWidth, window.innerHeight);
});
