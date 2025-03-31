import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { SubState } from "./SubStates";
import { MainEngine } from "../../mainScene/utils/MainEngine";

class CssSubState extends SubState {
	constructor(name, object, partIndex = 0, surfaceIndex = 0, element, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate){
		super(name,  object.self.children[partIndex].children[surfaceIndex].userData.instance, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate);
		// const screenSurface = object.self.children[partIndex].children[surfaceIndex].userData.instance;

		this.engine =  new MainEngine();;
		this.div = element;

		this.divObject = new CSS3DObject(this.div);
		this.divObject.position.set(0, 0, 0);
		object.add_part(0.5, 0.5, partIndex, surfaceIndex, this.divObject, [0, 0, 1]);
		this.screenSurface =  object.self.children[partIndex].children[surfaceIndex];
	}

	enter() 
	{
		super.enter();
		this.resize();
	}

    exit() 
	{
		super.exit();
		//this.div.style.visibility = "hidden";
		//TO BE CHANGED set this as functin coming in cleanup isntead the hiddden bit because osemtimes you ไรสส ืนะ ้รกำ!	
	}
    resize()
	{
		const boundingBox = new THREE.Box3().setFromObject(this.screenSurface);
		const worldSize = new THREE.Vector3();
		boundingBox.getSize(worldSize);
		const topLeft = new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z);
		const bottomRight = new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z);
		const toScreenPosition = (pos, camera) => {
			const vector = pos.clone().project(camera);
			return {
				x: (vector.x * 0.5 + 0.5) * window.innerWidth,
				y: (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight
			};
		};
		const screenTopLeft = toScreenPosition(topLeft, this.engine.camera);
		const screenBottomRight = toScreenPosition(bottomRight, this.engine.camera);
		const pixelWidth = Math.abs(screenBottomRight.x - screenTopLeft.x);
		const pixelHeight = Math.abs(screenBottomRight.y - screenTopLeft.y);
		const scaleX = pixelWidth / worldSize.x;
		const scaleY = pixelHeight / worldSize.y;
		const scaleFactor = 1 / Math.min(scaleX, scaleY);
		this.div.style.width = `${pixelWidth}px`;
		this.div.style.height = `${pixelHeight}px`;
		this.divObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
		super.resize();
	}
	animate(){
		this.engine.css3DRenderer.render(this.engine.scene, this.engine.camera);
		super.animate();
	}
}

class MeshSubState extends SubState {
	constructor(name, surface, scene, materialIndex, enter){
		super(name, surface, materialIndex,
			enter || (()=>{}), 
			scene?.postCamMove || (()=>{}), 
			null, 
			scene?.resize || (()=>{}),
			null, 
			scene?.keyHandler || (()=>{}));
		this.secondaryScene = scene;
		this.default_material = this.surface.material;
		this.animateScene = this.secondaryScene?.animate || (()=>{});
		this.exitScene = this.secondaryScene?.exit || (()=>{});
		this.engine = new MainEngine();
	}
	exit(){
		if (this.exitScene() == "cancelled") return "cancelled";
		this.animate();
	}
	animate(){
		// console.log("animate!");
		if (this.animateScene() == "stop") return; 
		this.engine.renderer.setRenderTarget(this.secondaryScene.renderTarget);
		this.engine.renderer.render(this.secondaryScene.scene, this.secondaryScene.camera);
		this.engine.renderer.setRenderTarget(null); 
	}
}

export { CssSubState, MeshSubState };