import * as THREE from 'three';
import { CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { SubState } from "./SubStates";
import { MainEngine } from "../../mainScene/utils/MainEngine";

class CssSubState extends SubState {
	constructor(name, surface, element, setup, cleanup, updateSize, keyHandler, animate){
		super(name, surface, setup, cleanup, updateSize, keyHandler, animate);
		this.engine =  new MainEngine();;
		this.element = element;
		this.elementObj = new CSS2DObject(this.element);
		this.elementObj.position.set(0, 0, 0);
		this.surface.add(this.elementObj);
	}

	enter() 
	{
		super.enter();
		this.resize();
		this.element.style.visibility = "visible";
	}

    exit() 
	{
		this.element.style.visibility = "hidden";
		super.exit();
	}
    resize()
	{ 
		this.engine.css2drenderer.setSize(window.innerWidth, window.innerHeight);
		this.elementObj.updateMatrixWorld(true);
		this.surface.geometry.computeVertexNormals(); 
		this.surface.geometry.computeBoundingBox();
		const bbox = this.surface.geometry.boundingBox;
		const vector1 = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
		const vector2 = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);
		vector1.project(this.engine.camera);
		vector2.project(this.engine.camera);
		const widthInPixels = Math.abs(vector2.x - vector1.x) * window.innerWidth;
		const heightInPixels = Math.abs(vector2.y - vector1.y) * window.innerHeight;
		this.element.style.width =`${widthInPixels}px`;
		this.element.style.height = `${heightInPixels}px`;
		super.resize();
	}
	animate(){
		this.engine.css2drenderer.render(this.engine.scene, this.engine.camera);
		super.animate();
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
    // resize(){
	// 	//get size of surface ?
	// 	//const size = this.surface.getSize(); 
	// 	//TOD MAGIC TO GET SIZE OF SURFACE
	// 	// this.secondaryScene.camera.aspect = size.width / size.height;
	// 	// this.secondaryScene.camera.updateProjectionMatrix();
	// 	// this.secondaryScene.renderTarget.setSize(size.width, size.height);
	// }
	animate(){
		this.secondaryScene?.animate(); 
		this.engine.renderer.setRenderTarget(this.secondaryScene.renderTarget);
    	this.engine.renderer.render(this.secondaryScene.scene, this.secondaryScene.camera);
		this.engine.renderer.setRenderTarget(null); 
	}
}

export { CssSubState, MeshSubState };