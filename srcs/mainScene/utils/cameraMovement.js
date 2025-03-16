
import { MainEngine } from "../utils/mainSetUp";

const engine = new MainEngine();

function moveCamera(data) {
	const tl = gsap.timeline({ 
		defaults: { duration: data.duration || 2, ease: data.ease || "power2.out" } 
	});
	if (data.pos) {
		tl.to(engine.camera.position, { 
			x: data.pos[0], 
			y: data.pos[1], 
			z: data.pos[2] 
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
		tl.to(engine.camera, { 
			fov: data.fov,
			onUpdate: () => engine.camera.updateProjectionMatrix() 
		}, 0);
	}
	if (data.lookAt) {
		tl.to({}, { 
			onUpdate: () => engine.camera.lookAt(data.lookAt)
		}, 0);
	}
}

export {moveCamera}