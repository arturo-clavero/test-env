import * as THREE from 'three';
import { MainEngine } from "../utils/mainSetUp";

class State {
    constructor(name, cameraController, cameraPosition, substates = []) {
        this.name = name;
        this.cameraController = cameraController;
		this.cam = cameraPosition;
        this.substates = substates;
		if (this.substates.length > 0) this.changeSubstate(0);
		console.log("name...", this.name, "curr substate: ", this.currentSubstate.name)
    }
	addSubstate(substates){
		if (!(Array.isArray(substates)))
			this.substates.push(substates)
		else
		{
			for (let i = 0; i < substates.length; i++)
				this.substates.push(substates[i]);
		}
		if (! this.currentSubstate)
			this.changeSubstate(0);
	}
	changeSubstate(index = this.currentSubstateIndex + 1) {
        if (this.currentSubstate) this.currentSubstate.exit();
		if (index >= this.substates.length) index = 0;
        this.currentSubstateIndex = index;
        this.currentSubstate = this.substates[this.currentSubstateIndex];
        this.currentSubstate.enter();
		console.log("changed substate to ", index, this.currentSubstate.name);
    }
    enter() { 
		// this.cameraController.moveCamera();
		const engine = new MainEngine();
		engine.camera.position.set(this.cam[0], this.cam[1], this.cam[2]);
		this.currentSubstate?.enter();
	}
    exit() {
		this.currentSubstate?.exit();
		this.changeSubstate(0);

	}
	handleKeyPress(event) {
		console.log("handle key press - state ? ", this.name);
		const view = this.currentSubstate?.handleKeyPress(event);
		if (view == "next substate")
			this.changeSubstate();
		
    }
    resize() { this.currentSubstate?.resize(); }
	animate() { 
		//console.log("animate at state ", this.name); 
		this.currentSubstate?.animate(); }
	isActive() { return this.currentSubstate?.active; }
}

export { State }