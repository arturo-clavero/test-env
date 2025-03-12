import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Modern import path for modules

class MainEngine {
	constructor(){
		if (MainEngine.instance)
			return MainEngine.instance;
		this.setUpScene();
		this.setUpLights();
		window.addEventListener('resize', (event) => {this.resize(event)});
		window.addEventListener('click', (event) => {this.click(event)});
		// window.addEventListener('mousemove', (event) => {this.mousemove(event);});
		MainEngine.instance = this;
	}
	setUpScene(){
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer();
		this.scene = new THREE.Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.camera.position.z = 5;
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.clickableObjects = [];
	}
	setUpLights(){
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientLight);
		const directionalLight = new THREE.SpotLight(0x0053f9, 50);
		directionalLight.position.set(0, 6, 2);
		directionalLight.castShadow = true;
		this.scene.add(directionalLight);
	}
	animate(){
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}
	add(newObject, clickable){
		if (! (newObject instanceof THREE.Object3D))
		{
			console.log(newObject);
			newObject = newObject.self;
		}
		this.scene.add(newObject);
		if (clickable)
			this.clickableObjects.push(newObject);
	}
	resize(){
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
	click(event){
		this.mousemove(event);
		this.raycaster.setFromCamera(this.mouse, this.camera);	
		for (let i = 0; i < this.clickableObjects.length; i++)
		{
			if (! this.clickableObjects[i].userData.instance)
				continue ;
			const bbox = this.clickableObjects[i].userData.instance.get_bbox();
			const intersectsModel = this.raycaster.ray.intersectBox(bbox, new THREE.Vector3());
			if (intersectsModel)
				this.clickableObjects[i].userData.instance.handle_click(this.raycaster);
		}
	}
	mousemove(event){
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	}
}


export { MainEngine }