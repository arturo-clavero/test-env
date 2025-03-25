import * as THREE from 'three';
import { moveCamera } from './cameraMovement';
class State {
    constructor(name, cameraMovement, substates = [], enterState = ()=>{}, exitState=()=>{}, materials) {
        this.name = name;
		this.cameraMovement = cameraMovement;
        this.substates = substates;
		this.enterState = enterState;
		this.exitState = exitState;
		this.materials = materials;
		this.materialIndex = -1;
		this.changeSubstate(0);
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
		if (this.materialIndex != this.currentSubstate.materialIndex)
		{
			console.log("changing material from ", this.materialIndex, " to ", this.currentSubstate.materialIndex);
			this.materialIndex = this.currentSubstate.materialIndex;
			this.currentSubstate.surface.material = this.materials[this.materialIndex];
		}
		this.currentSubstate.enter();
    }
    enter() {
		//effects before camera movement
		// this.changeSubstate(0);
		this.enterState(this);
		console.log("this current substate", this.currentSubstate);
		if (this.cameraMovement)
			moveCamera(this.cameraMovement, () =>{
				//effects after camera movement
				this.currentSubstate.postCamEnter();
			})
	}
    exit() {
		console.log("exit!");
		this.currentSubstate?.exit();
		this.exitState(this);
		//this.changeSubstate(0);

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