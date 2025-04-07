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
		this.startIndex = 0;
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
	changeSubstate(index = this.currentSubstateIndex + 1, postCam = true) {
        if (this.currentSubstate && this.currentSubstate.exit() == "cancelled")
			return "cancelled";
		if (index >= this.substates.length) index = 0;
        this.currentSubstateIndex = index;
        this.currentSubstate = this.substates[this.currentSubstateIndex];
		if (this.materialIndex != this.currentSubstate.materialIndex)
		{
			this.materialIndex = this.currentSubstate.materialIndex;
			this.currentSubstate.surface.material = this.materials[this.materialIndex];
		}
		this.currentSubstate.enter();
		if (postCam)
			this.currentSubstate.postCamEnter();
    }
	enter() {
		this.changeSubstate(this.currentSubstateIndex + 1, false);
		if (this.cameraMovement)
			moveCamera(this.cameraMovement, () =>{
				this.currentSubstate.postCamEnter();
			})
	}
	exit() {
		if (this.currentSubstate.exit() == "cancelled")
			return 'cancelled';
		this.changeSubstate(this.startIndex);
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
	update_start_index(index){
		if (this.start_index == index)
			return ; 
		if (this.currentSubstateIndex < index)
		{
			if (this.currentSubstateIndex % 2 == 0)
				this.changeSubstate(index)
			else
				this.changeSubstate(index + 1)
		}
		this.startIndex = index;
	}
}

export { State }