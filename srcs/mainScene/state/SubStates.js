import * as THREE from 'three';

class SubState {
    constructor(name, surface = null, setup, cleanup, updateSize, keyHandler, animation) {
        this.name = name;
		this.surface = !surface ? null : (surface instanceof THREE.Object3D) ? surface : surface.self;
        this.setup = setup || (() => {});
        this.cleanup = cleanup || (() => {});
		this.updateSize = updateSize || (() => {});
		this.animation = animation || (() => {});
        this.keyHandler = keyHandler || (() => {});
		this.active = false;
		console.log(this.name, " key handler: ");
		console.log(this.keyHandler);
    }
    enter() { this.setup(); }
    exit() { this.cleanup(); }
    resize() { this.updateSize(); }
	animate() { this.animation(); }
    handleKeyPress(event) {
		console.log("handle key press substate ? ", this.name);
		let view = this.keyHandler(event); 
		console.log("substate - ", view);
		return view;
	}
}

export { SubState };