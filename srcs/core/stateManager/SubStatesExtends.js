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
		super.exit();
		this.element.style.visibility = "hidden";

	}
    resize()
	{ 
		console.log("resize");
		this.engine.css2drenderer.setSize(window.innerWidth, window.innerHeight);
		this.elementObj.updateMatrixWorld(true);

		this.surface.geometry.computeVertexNormals(); 
		this.surface.geometry.computeBoundingBox();
		const bbox = this.surface.geometry.boundingBox;
		const helper = new THREE.Box3Helper(bbox, 0xff0000); // Red bounding box
		this.surface.add(helper);
		const vector1 = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
		const vector2 = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);
		console.log("vectors: ", vector1, vector2);
		this.surface.updateMatrixWorld(true);
		vector1.applyMatrix4(this.surface.matrixWorld);  // Convert to world space
		vector2.applyMatrix4(this.surface.matrixWorld);
		console.log("vectors: ", vector1, vector2);

		vector1.project(this.engine.camera);
		vector2.project(this.engine.camera);
		console.log("vectors: ", vector1, vector2);

		const widthInPixels = Math.abs(vector2.x - vector1.x) * window.innerWidth * 0.5;
		const heightInPixels = Math.abs(vector2.y - vector1.y) * window.innerHeight * 0.5;

		this.element.style.width = `${widthInPixels}px`;
		this.element.style.height = `${heightInPixels }px`;

		const rect = this.element.getBoundingClientRect();

// Calculate the center of the div
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
// Calculate the center of the screen
const screenCenterX = window.innerWidth / 2;
const screenCenterY =  window.innerHeight / 2;

// Log the center position
console.log('Center X:', centerX);
console.log('Center Y:', centerY);
console.log('Center X:', screenCenterX);
console.log('Center Y:', screenCenterY);
const origin = new THREE.Vector2(screenCenterX, screenCenterY); // Example origin (can be any 3D point)
const target = new THREE.Vector2(centerX, centerY); // Example target (can be any 3D point)

// Define the percentage by which you want to extend the target (e.g., 20%)
const percentage = 0.07; // 20% (0.2 means extend by 20% further)

// Step 1: Calculate the direction vector from origin to target
const direction = new THREE.Vector2().subVectors(target, origin); // target - origin
// Step 2: Normalize the direction vector to keep it unit length
// direction.normalize();
console.log("direction: ", direction);

// Step 3: Scale the direction by the percentage you want
const extension = direction.multiplyScalar(percentage);
console.log("extension: ", extension);
// Step 4: Add the scaled direction to the original target position
const newTarget = target.clone().add(extension);
console.log("target: ", target, "new targetL", newTarget);
// this.element.style.transform = `translate(${newTarget.x - target.x}px, ${newTarget.y - target.y}px)`;
this.element.style.position = "absolute";  // Or "fixed" if you want it fixed on the screen
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