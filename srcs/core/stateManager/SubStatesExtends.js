import * as THREE from 'three';
import { CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { SubState } from "./SubStates";
import { MainEngine } from "../../mainScene/utils/MainEngine";

class CssSubState extends SubState {
	constructor(name, surface, element, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate){
		super(name, surface, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate);
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
	}

    exit() 
	{
		super.exit();
		this.element.style.visibility = "hidden";

	}
    resize()
	{
		//adjust width andheight of div
		this.engine.css2drenderer.setSize(window.innerWidth, window.innerHeight);
		this.elementObj.updateMatrixWorld(true);
		this.surface.geometry.computeVertexNormals(); 
		this.surface.geometry.computeBoundingBox();
		const bbox = this.surface.geometry.boundingBox;

		const vector1 = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
		const vector2 = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);
		this.surface.updateMatrixWorld(true);
		vector1.applyMatrix4(this.surface.matrixWorld);
		vector2.applyMatrix4(this.surface.matrixWorld);
		vector1.project(this.engine.camera);
		vector2.project(this.engine.camera);
		const widthInPixels = Math.abs(vector2.x - vector1.x) * window.innerWidth * 0.5;
		const heightInPixels = Math.abs(vector2.y - vector1.y) * window.innerHeight * 0.5;
		this.element.style.width = `${widthInPixels}px`;
		this.element.style.height = `${heightInPixels }px`;
		//fix fiv distorsion
		const rect = this.element.getBoundingClientRect();
		const origin = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
		const target = new THREE.Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2);
		const percentage = 0.12;
		const direction = new THREE.Vector2().subVectors(target, origin);
		const extension = direction.multiplyScalar(percentage);
		const newTarget = target.clone().add(extension);
		this.element.style.position = "absolute";
		this.element.style.left = `${newTarget.x - target.x}px`;
		this.element.style.top = `${newTarget.y - target.y}px`;
		super.resize();
	}
	animate(){
		this.engine.css2drenderer.render(this.engine.scene, this.engine.camera);
		super.animate();
	}
}

class MeshSubState extends SubState {
	constructor(name, surface, scene, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler){
		super(name, surface, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler);
		this.secondaryScene = scene;
		this.default_material = this.surface.material;
		this.resize();
		this.engine = new MainEngine();
	}
	animate(){
		this.secondaryScene?.animate(); 
		this.engine.renderer.setRenderTarget(this.secondaryScene.renderTarget);
    	this.engine.renderer.render(this.secondaryScene.scene, this.secondaryScene.camera);
		this.engine.renderer.setRenderTarget(null); 
	}
}

export { CssSubState, MeshSubState };