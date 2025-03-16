import * as THREE from 'three';
import { moveCamera } from '../utils/cameraMovement';
class State {
    constructor(name, cameraMovement, substates = []) {
        this.name = name;
		this.cameraMovement = cameraMovement;
        this.substates = substates;
		console.log("name: ", this.name);
		console.log("move: ", this.cameraMovement);
		console.log("subs: ", this.substates);
		if (this.substates.length > 0) this.changeSubstate(0);
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
		this.currentSubstate?.enter();
    }
    enter() { 
		moveCamera(this.cameraMovement);
		this.currentSubstate?.enter();
	}
    exit() {
		this.currentSubstate?.exit();
		this.changeSubstate(0);

	}
	handleKeyPress(event) {
		const view = this.currentSubstate?.handleKeyPress(event);
		if (view && view.change === "substate")
			this.changeSubstate(view.index || undefined);
		return view;
    }
    resize() { this.currentSubstate?.resize(); }
	animate() { this.currentSubstate?.animate(); }
	isActive() { return this.currentSubstate?.active; }
}

export { State }