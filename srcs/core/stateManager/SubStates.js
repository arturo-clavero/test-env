import * as THREE from 'three';

class SubState {
    constructor(name, surface = null, materialIndex, setup, postCamMoveSetUp, cleanup, updateSize, keyHandler, animation) {
        this.name = name;
		this.surface = !surface ? null : (surface instanceof THREE.Object3D) ? surface : surface.self;
		this.materialIndex = materialIndex;
		this.setup = setup || (() => {});
		this.postCamMoveSetUp = postCamMoveSetUp || (() => {});
        this.cleanup = cleanup || (() => {});
		this.updateSize = updateSize || (() => {});
		this.animation = animation || (() => {});
        this.keyHandler = keyHandler || (() => {});
		this.active = false;
    }
    enter() { this.setup();}
	postCamEnter() {this.postCamMoveSetUp();}
	// update() { this.postCamMoveSetUp(); }
    exit() { this.cleanup(); }
    resize() { this.updateSize(); }
	animate() { this.animation(); }
    handleKeyPress(event) { return this.keyHandler(event); }
}

export { SubState };