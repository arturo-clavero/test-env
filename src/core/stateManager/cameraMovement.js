
import { mx_bilerp_0 } from "three/src/nodes/materialx/lib/mx_noise.js";
import { arcadeMachine } from "../../mainScene/objects/arcadeMachine";
import { MainEngine } from "../../mainScene/utils/MainEngine";
import { StateManager } from "./StateManager";
import * as THREE from 'three';

// const engine = ;

let scrollDelta = 0;
const scrollThreshold = 400;
let isCamMoving = false;
export function get_camera_animation(){
	return isCamMoving;
}
export function wheel_scroll_animations(event){
	const stateManager = new StateManager();
	if (isCamMoving || event.deltaY * 100 * stateManager.allowedDirection < 0)
		return ;
	scrollDelta += event.deltaY;
	new MainEngine().camera.position.z += event.deltaY * 0.00001;
	if (Math.abs(scrollDelta) > scrollThreshold) {
		isCamMoving = true;
		let direction = scrollDelta > 0 ? 1 : -1;
		scrollDelta = 0;
		stateManager.changeState(new StateManager().currentStateIndex + direction);
	}
}
let tl = null;
function moveCamera(data, newPosition, onComplete) {
	isCamMoving = true;
	if (tl){
		tl.kill()
	}
	const engine = new MainEngine()
	if (newPosition == engine.camera.position)
		return;
	tl = gsap.timeline({ 
		defaults: { duration: data.duration || 2, ease: data.ease || "power2.out" } 
	});
	const tempPosition = {
		x: engine.camera.position.x,
		y: engine.camera.position.y,
		z: engine.camera.position.z
	};
	// console.log("new position: ", newPosition);
	// console.log("current position: ", engine.camera.position)
	// console.log("data duration ", data.duration)
	if ("pos" in data) {
		console.log("requested camera move")
		tl.to(tempPosition,{ 
			x: newPosition.x, 
			y: newPosition.y, 
			z: newPosition.z, 
			onUpdate: () =>{ 
				engine.camera.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
				// console.log("cam era moving: ", engine.camera.position)
				new StateManager().resize();
			},
			overwrite: "auto",
		}, 0);
	}
	if (data.rot) {
		tl.to(engine.camera.rotation, { 
			x: data.rot[0], 
			y: data.rot[1], 
			z: data.rot[2] 
		}, 0);
	}
	if (data.fov !== undefined) {
		tl.to(new engine.camera, { 
			fov: data.fov,
			onUpdate: () => engine.camera.updateProjectionMatrix() 
		}, 0);
	}
	if (data.lookAt) {
		tl.to({}, { 
			onUpdate: () => engine.camera.lookAt(data.lookAt)
		}, 0);
	}
	tl.eventCallback("onComplete", () => {
		isCamMoving= false;
		onComplete();
		tl = null;
		new StateManager().resize();
		// engine.camera.position.copy(newPosition);
		// new StateManager().resize();
		//fitCameraToObject()
	});
}
function shakeCamera(camera, intensity = 0, duration = 2000) {
    let startTime = performance.now();
    let prev_position = camera.position;
    function update() {
        let elapsed = performance.now() - startTime;
        if (elapsed < duration) {
			intensity += 0.005
            camera.position.x += (Math.random() - 0.5) * intensity;
            camera.position.y += (Math.random() - 0.5) * intensity;
            camera.position.z += (Math.random() - 0.5) * intensity;
            requestAnimationFrame(update);

        } else {
            camera.position.set(prev_position.x, prev_position.y, prev_position.z); // Reset to default position
        }
    }
    
    update();
}

function shakeCameraWithRotation(camera, intensity = 0.1, duration = 5000, rotationAmount = 0.1) {
    let startTime = performance.now();
    let prevPosition = camera.position.clone();
    let prevRotation = camera.rotation.clone();
    function update() {
        let elapsed = performance.now() - startTime;
        if (elapsed < duration) {
            let t = elapsed * 0.005;
            camera.position.x += (Math.random() - 0.5) * intensity;
            camera.position.y += (Math.random() - 0.5) * intensity;
            camera.position.z += (Math.random() - 0.5) * intensity;
            camera.rotation.z += Math.sin(t * 4) * rotationAmount * (Math.random() - 0.5) ;
            requestAnimationFrame(update);
        } else {
            camera.position.copy(prevPosition);
            camera.rotation.copy(prevRotation);
        }
    }
    update();
}


export function fitCameraToObject(targetObject, targetNormal = new THREE.Vector3(0, 0, -1), offset = 1.25, aspect = null) {
	let engine = new MainEngine();
	let container = engine.container;
	let camera = engine.camera;
	const box = new THREE.Box3().setFromObject(targetObject);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

	if (aspect == null)
	{
		if (container.clientWidth != 0 && container.clientHeight != 0)
			aspect = container.clientWidth / container.clientHeight;
		else
		{
			// console.log("CONTIANER NO VALID CLIENTWIDTH! CLENTHEITGHT!")
			aspect = window.innerWidth / window.innerHeight;
		}
	}	
    const fov = THREE.MathUtils.degToRad(camera.fov);

    const height = size.y;
    const width = size.x;
    const depth = size.z;

    const fitHeightDistance = height / (2 * Math.tan(fov / 2));
    const fitWidthDistance = width / (2 * Math.tan(fov / 2)) / aspect;
    const distance = offset * Math.max(fitHeightDistance, fitWidthDistance, depth);

	const direction = targetNormal.clone().normalize().multiplyScalar(-distance); // move opposite of normal

    return new THREE.Vector3().copy(center).add(direction);

}

export {moveCamera}