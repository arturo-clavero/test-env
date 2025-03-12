import { MainEngine } from "../utils/mainSetUp";

class States{
	constructor(model, divs, update_state, dist, model_normal){
		this.model = model;
		this.divs = Array.isArray(divs) ? divs : [divs];
		this.substates = [];
		this.curr_substate_index = 0;
		const engine = new MainEngine.camera;
		this.camera = engine.camera;
		this.cam_pos = calc_camera_pos(dist, model_normal);
		this.init = update_state;
	}
	calc_camera_pos(dist, model_normal){
		const bbox = this.model.userData.instance.get_bbox();
		const center = new THREE.Vector3();
		bbox.getCenter(center);
		if (! (this.model_normal instanceof THREE.Vector3()))
			this.model_normal = new THREE.Vector3(model_normal[0], model_normal[1], model_normal[2]);
		model_normal.normalize();
		const displacement = model_normal.multiplyScalar(dist);
		return center.add(displacement);
	}
	curr_substate(){ 
		return (this.substates[this.curr_substate_index])
	}
	update_substate()
	{
		this.curr_substate_index = this.curr_substate_index + 1;
		if (this.curr_substate_index >= this.substates.length)
			this.curr_substate_index = 0;
		this.curr_substate().update(this.divs);
	}
	is_active(){
		return this.curr_substate().is_active();
	}
	move_camera(){
		//TODO ADD SMOOTH MOVMENT
		this.camera.position.set(this.cam_pos.x, this.cam_pos.y, this.cam_pos.z);
	}
}

export { States }