import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { SubState } from "./SubStates";
import { MainEngine } from "../../mainScene/utils/MainEngine";
import { StateManager } from './StateManager';

class CssSubState extends SubState {
	constructor(name, object, screenSurface, element, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate) {
		super(name, screenSurface.self, materialIndex, setup, postCamMove, cleanup, updateSize, keyHandler, animate);
		this.engine =  new MainEngine();
		this.div = element;
		this.engine.container.appendChild(this.div)
		this.div.style.position = "absolute";
		//this.divObject = new CSS3DObject(this.div);
		// this.divObject.position.set(0, 0, 0);
		// console.log("adding css3d div to obj...")
		// object.add_object(0.5, 0.5, [partIndex, surfaceIndex ], this.divObject, [0, 1, 0]);
		this.screenSurface = screenSurface
		// if (screenSurface != null)
		// 	screenSurface.add_object(0.5, 0.5, [0, 0], this.divObject, [0,1,0], 1, false)
		// else 
		// 	this.screenSurface =  object.self.children[partIndex].children[surfaceIndex];
	}
	enter() 
	{
		super.enter();
		this.resize();
	}
    exit() 
	{
		if (super.exit() == "cancelled" && new StateManager().forcedRedirect == "false")
			return "cancelled";
		//this.div.style.visibility = "hidden";
		//TO BE CHANGED set this as functin coming in cleanup isntead the hiddden bit because osemtimes you ไรสส ืนะ ้รกำ!	
	}
    resize()
	{
		// console.log("screensurface: ", this.screenSurface)
		// console.log("screensurface: ", this.screenSurface.self)
		const boundingBox = new THREE.Box3().setFromObject(this.screenSurface.self);
		const worldSize = new THREE.Vector3();
		boundingBox.getSize(worldSize);
		const topLeft = new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z);
		const bottomRight = new THREE.Vector3(boundingBox.max.x , boundingBox.min.y, boundingBox.max.z);
		const toScreenPosition = (pos, camera) => {
			const vector = pos.clone().project(camera);
			return {//ARE YOU SURE ? THINK!
				// x: (vector.x * 0.5 + 0.5) * window.innerWidth,
				// y: (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight
				x: (vector.x * 0.5 + 0.5) * this.engine.container.clientWidth,
				y: (1 - (vector.y * 0.5 + 0.5)) * this.engine.container.clientHeight,
			};
		};
		const screenTopLeft = toScreenPosition(topLeft, this.engine.camera);
		const screenBottomRight = toScreenPosition(bottomRight, this.engine.camera);
		const pixelWidth = Math.abs(screenBottomRight.x - screenTopLeft.x);
		const pixelHeight = Math.abs(screenBottomRight.y - screenTopLeft.y);

		this.div.style.left = `${screenTopLeft.x}px`;
		this.div.style.top = `${screenTopLeft.y}px`;
		this.div.style.width = `${pixelWidth}px`;
		this.div.style.height = `${pixelHeight}px`;
		// this.div.style.border = "2px solid red";
		this.div.style.position = "absolute";
		super.resize();
	}
	animate(){
		this.engine.css3DRenderer.render(this.engine.scene, this.engine.camera);
		super.animate();
	}
}

class MeshSubState extends SubState {
	constructor(name, surface, scene, materialIndex, enter, exit){
		super(name, surface.self, materialIndex,
			enter || (()=>{}), 
			scene?.postCamMove || (()=>{}), 
			exit || (()=>{}), 
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
		if (this.exitScene() == "cancelled" || super.exit() == "cancelled")
			return "cancelled";
		this.animate();
	}
	animate(){
		// if (this.animateScene() == "stop") return;
		this.engine.renderer.setRenderTarget(this.secondaryScene.renderTarget);
		this.engine.renderer.render(this.secondaryScene.scene, this.secondaryScene.camera);
		this.engine.renderer.setRenderTarget(null);
	}
}

export { CssSubState, MeshSubState };