import * as THREE from 'three';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
class MainEngine {
	constructor(){
		if (MainEngine.instance)
			return MainEngine.instance;
		this.setUpScene();
		this.setUpRenderer();
		this.setUpLights();
		window.addEventListener('resize', () => {this.resize()});
		window.addEventListener('click', (event) => {this.click(event)});
		MainEngine.instance = this;
	}
	setUpRenderer(){
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.css3DRenderer = new CSS3DRenderer();
		this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
		this.css3DRenderer.domElement.style.position = "absolute";
		this.css3DRenderer.domElement.style.top = 0;
		document.body.appendChild(this.css3DRenderer.domElement);
	}
	setUpScene(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 10;
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
		spotLight.position.set(0, 2, 5);
		// spotLight.position.set(0, 0, 3.5);
		spotLight.castShadow = true;
		this.scene.add(spotLight);
	}
	animate(){
		this.renderer.render(this.scene, this.camera);
		this.stateManager.animate();
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
		this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
		const aspectRatio =  window.innerWidth / window.innerHeight;
		//TODO Tweak FOV to maintain smae look ... 
		this.camera.aspect = aspectRatio;
		this.camera.updateProjectionMatrix();
		this.stateManager.resize();

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