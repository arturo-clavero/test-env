import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Modern import path for modules
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

class MainEngine {
	constructor(){
		if (MainEngine.instance)
			return MainEngine.instance;
		this.setUpScene();
		this.setUpRenderer();
		this.setUpLights();
		this.controls = new OrbitControls(this.camera, this.css2drenderer.domElement);
		window.addEventListener('resize', (event) => {this.resize(event)});
		window.addEventListener('click', (event) => {this.click(event)});
		// window.addEventListener('mousemove', (event) => {this.mousemove(event);});
		MainEngine.instance = this;
	}
	setUpRenderer(){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.css2drenderer = new CSS2DRenderer();
		this.css2drenderer.setSize( window.innerWidth, window.innerHeight );
		this.css2drenderer.domElement.style.position = 'absolute';
		this.css2drenderer.domElement.style.top = '0px';
		document.body.appendChild( this.css2drenderer.domElement );
	}
	setUpScene(){
		this.scene = new THREE.Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 5;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.clickableObjects = [];
	}
	setUpLights(){
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
		this.scene.add(ambientLight);

		const topLight = new THREE.SpotLight(0x0053f9, 50);
		topLight.position.set(0, 6, 2);
		topLight.castShadow = true;
		this.scene.add(topLight);

		const spotLight = new THREE.SpotLight(0xd34dee, 50);
		spotLight.position.set(0.75, 0.75, 4);
		// spotLight.position.set(0, 0, 3.5);
		spotLight.castShadow = true;
		this.scene.add(spotLight);
	}
	animate(){
		// console.log("background animate!");
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		this.css2drenderer.render(this.scene, this.camera);
	}
	add(newObject, clickable){
		if (! (newObject instanceof THREE.Object3D))
			newObject = newObject.self;
		this.scene.add(newObject);
		if (clickable)
			this.clickableObjects.push(newObject);
	}
	resize(){
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.css2drender.setSize(window.innerWidth, window.innerHeight);
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