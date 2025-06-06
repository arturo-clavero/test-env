import * as THREE from 'three';
import { StateManager } from './StateManager';
import { fitCameraToObject } from './cameraMovement';
import { MainEngine } from '../../mainScene/utils/MainEngine';

class SubState {
    constructor(name, surface = null, materialIndex, setup, postCamMoveSetUp, cleanup, updateSize, keyHandler, animation) {
        this.name = name;
		this.surface = surface;
		this.materialIndex = materialIndex;
		this.setup = setup || (() => {});
		this.postCamMoveSetUp = postCamMoveSetUp || (() => {});
        this.cleanup = cleanup || (() => {});
		this.updateSize = updateSize || (() => {});
		this.animation = animation || (() => {});
        this.keyHandler = keyHandler || (() => {});
		this.active = false;
		this.data = {}
    }
    enter() { this.setup();}
	postCamEnter() {this.postCamMoveSetUp();}
	// update() { this.postCamMoveSetUp(); }
    exit() { if (this.cleanup() == "cancelled" && new StateManager().forcedRedirect == false) return "cancelled"; }
    resize() {  
		this.updateSize(); 
	}
	animate() { this.animation(); }
    handleKeyPress(event) { return this.keyHandler(event); }
}

export { SubState };