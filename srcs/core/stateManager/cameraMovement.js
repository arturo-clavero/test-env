
import { MainEngine } from "../../mainScene/utils/MainEngine";
import { StateManager } from "./StateManager";
const engine = new MainEngine();

let scrollDelta = 0;
const scrollThreshold = 400;
let isAnimating = false;

window.addEventListener("wheel", (event) => {
	const stateManager = new StateManager();
	if (isAnimating || event.deltaY * 100 * stateManager.allowedDirection < 0)
		return ;
	scrollDelta += event.deltaY;
	engine.camera.position.z += event.deltaY * 0.00001;
	if (Math.abs(scrollDelta) > scrollThreshold) {
		isAnimating = true;
		let direction = scrollDelta > 0 ? 1 : -1;
		scrollDelta = 0;
		stateManager.changeState(new StateManager().currentStateIndex + direction);
	}
});


function moveCamera(data, onComplete) {
	isAnimating = true;
	const tl = gsap.timeline({ 
		defaults: { duration: data.duration || 2, ease: data.ease || "power2.out" } 
	});
	if (data.pos) {
		tl.to(engine.camera.position, { 
			x: data.pos[0], 
			y: data.pos[1], 
			z: data.pos[2],
			onUpdate: () => new StateManager().resize(),
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
	tl.then(()=>{
		isAnimating = false;
		new StateManager().resize();
		onComplete();
	});
}

export {moveCamera}