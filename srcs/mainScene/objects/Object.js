import * as THREE from 'three';

class Object {
	constructor(component){
		this.base = component;
		this.self = new THREE.Group();
		this.self.add(this.base.self);
		this.self.userData.instance = this;
		this.onclick = null;
		this.self.raycasting = true;
		this.self.receiveShadow = true;
		this.self.castShadow = true;
	}
	add_part(Xpercent, Ypercent, indexObject, indexFace, part, axis = [0, 1, 0]){
		const object = (part instanceof THREE.Object3D) ? part : part.self;
		this.self.children[indexObject].userData.instance.add_object(Xpercent, Ypercent, indexFace, object, axis)
	}
	add_onclick(ft) {
		this.onclick = ft
	}
	handle_click(raycaster) {
		if (this.onclick)
			this.onclick();
		const intersectsShape= raycaster.intersectObject(this.self, true);
		const validIntersects = [];
		for (let i = 0; i < intersectsShape.length; i++)
		{
			if (intersectsShape[i].object.userData.raycaster == false)
				continue;
			validIntersects.push(intersectsShape[i].object);
		}
		if (validIntersects.length > 0 && validIntersects[0].userData.instance)
			validIntersects[0].userData.instance.handle_click();
	}
	get_bbox(){
		this.self.updateMatrixWorld();
		const bbox = new THREE.Box3().setFromObject(this.self);
		return bbox;
	}
}

export { Object };
