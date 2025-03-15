import * as THREE from 'three';
import { CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { SubState } from "./SubStates";
import { MainEngine } from "../utils/mainSetUp";

class CssSubState extends SubState {
	constructor(name, surface, element, setup, cleanup, updateSize, keyHandler){
		super(name, surface, setup, cleanup, updateSize, keyHandler);
		this.element = element;
		this.elementObj = new CSS2DObject(this.element);
		this.elementObj.position.set(0, 0, 0);
		this.surface.add(this.elementObj);
		this.resize();
	}

	enter() 
	{
		this.element.style.visibility = "visible";
		super.enter();
	}
    exit() 
	{
		this.element.style.visibility = "hidden";
		super.exit();
	}
    resize()
	{ 
		//get size of surface ?
		//const size = this.surface.getSize();
		// const width = size.width; //from normal to px
		// this.element.style.width = `${width}px`;
		// const height = size.height; //from normal to px
		// this.element.style.height = `${height}px`;
	}
}

class MeshSubState extends SubState {
	constructor(name, surface, scene, setup, cleanup, updateSize, keyHandler){
		super(name, surface, setup, cleanup, updateSize, keyHandler);
		this.secondaryScene = scene;
		this.default_material = this.surface.material;
		this.resize();
		this.engine = new MainEngine();
	}

	enter() {
		this.surface.material = this.secondaryScene.renderMaterial;
		super.enter(); 
	}

    exit() {
		this.surface.material = this.default_material;
		super.exit(); 
	}

    resize(){
		//get size of surface ?
		//const size = this.surface.getSize(); 
		//TOD MAGIC TO GET SIZE OF SURFACE
		// this.secondaryScene.camera.aspect = size.width / size.height;
		// this.secondaryScene.camera.updateProjectionMatrix();
		// this.secondaryScene.renderTarget.setSize(size.width, size.height);
	}
	
	animate(){
		this.secondaryScene?.animate(); 
		this.engine.renderer.setRenderTarget(this.secondaryScene.renderTarget);
    	this.engine.renderer.render(this.secondaryScene.scene, this.secondaryScene.camera);
		this.engine.renderer.setRenderTarget(null); 
	}
}

export { CssSubState, MeshSubState };