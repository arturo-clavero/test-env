
import * as THREE from 'three';
import { Shape } from "./CustomShapes";
import { order_path } from './utils';
import { mapToCenter } from './utils';


class Model {
	constructor(component){
		this.base = component;
		this.objects = [];
		this.self = new THREE.Group();
		this.self.add(this.base.self);
		this.self.userData.instance = this;
		this.onclick = null;
		this.self.raycasting = true;
		this.self.receiveShadow = true;
		this.self.castShadow = true;
	}
	add_component(Xpercent, Ypercent, indexObject, indexFace, object){
		this.self.children[indexObject].userData.instance.add_object(Xpercent, Ypercent, indexFace, object)
		this.self.add(object.self);
	}
	add_onclick(ft) { this.onclick = ft};
	handle_click() {
		if (this.onclick)
			this.onclick();
		// const intersects = raycaster.intersectObject(this.self, true);
		// if (intersects.length > 0) {
		// 	if (this.onclick)
		// 		this.onclick();
		// 	console.log(intersects);
		// 	intersects = forEach((intersection) => {
       	// 		intersection.object.handleClick(raycaster);
    	// 	});
		// }
	}
	get_bbox(){
		this.self.updateMatrixWorld();
		const bbox = new THREE.Box3().setFromObject(this.self);
		return bbox;
	}
}

class Component {
	constructor(pointsLeftXY, pointsRightXY, materials){
		this.width = 0;
		this.shapeParts = [];
		this.self = null;
		if (! Array.isArray(pointsRightXY))
			this.init_symetrical(pointsLeftXY, pointsRightXY);
		else if (pointsLeftXY.length == pointsRightXY.length)
			this.init_asymetrical(pointsLeftXY, pointsRightXY);
		else
			throw new Error("Incorrect parameters");
		if (materials)
			this.add_material(materials);
		else
			console.log("forgot to add materials!");
		this.onclick = null;
	}
	init_symetrical(points, thickness){
		this.width = thickness;
		points = mapToCenter(points, thickness);
		points = order_path(points);
		this.baseShape = new Shape(points);
		this.shapeParts.push(this.baseShape);
		this.shapeParts.push(new Shape([], thickness, this.baseShape.geometry.clone()));
		for (let i = points.length -1 ; i >= 0; i--){
			const curr = points[i].length == 3 ? points[i] : [points[i][0], points[i][1], 0];
			const next = i + 1 < points.length ? points[i + 1].length == 3 ? points[i + 1] : [points[i + 1][0], points[i + 1][1], 0] : points[0].length == 3 ? points[0] : [points[0][0], points[0][1], 0];
			const curr_extruded = [curr[0], curr[1], curr[2] - thickness];
			const next_extruded = [next[0], next[1], next[2] - thickness];
			this.shapeParts.push(new Shape([curr, next, next_extruded, curr_extruded]));
		}
	}
	init_asymetrical(pLeft, pRight){
		const newPoints = mapToCenter(pLeft, pRight);
		pRight = order_path(newPoints.right);
		this.shapeParts[0] =  new Shape(pRight);
		pLeft = order_path(newPoints.left);
		this.shapeParts[1] = new Shape(pLeft);
		for (let i = 0; i < pRight.length; i++){
			const currRight = pRight[i];
			const nextRight = i + 1 < pRight.length ? pRight[i + 1] : pRight[0];	
			const currLeft = pLeft[i];
			const nextLeft = i + 1 < pLeft.length ? pLeft[i + 1] : pLeft[0];
			this.shapeParts.push(new Shape([currRight, nextRight, nextLeft, currLeft]));
		}
	}
	add_material(materials){
		if (! Array.isArray(materials))
		{
			for (let i = 0; i < this.shapeParts.length; i++)
				this.shapeParts[i].add_material(materials);
		}
		else
		{
			for (let i = 0; i < this.shapeParts.length; i++)
			{
				let j = i < materials.length ? i : materials.length - 1;
				this.shapeParts[i].add_material(materials[j]);
			}
		}
		if (!this.self);
			this.init_group();		
	}
	init_group(){
		this.self = new THREE.Group();
		for (let i = 0; i < this.shapeParts.length; i++)
			this.self.add(this.shapeParts[i].self);
		this.self.userData.instance = this;
	}
	get_borders(map, lineBasicMaterial){
		if (map.length == 0)
		{
			for (let i = 0; i < this.shapeParts.length; i++)
				map.push(i);
		}
		for (let i = 0; i < map.length; i++)
		{
			let material = Array.isArray(lineBasicMaterial) ? lineBasicMaterial[i] : lineBasicMaterial;
			this.self.add(this.shapeParts[map[i]].get_borders(material));
		}
	}

	add_object(xPercent, yPercent, index, object){
		const bbox = new THREE.Box3().setFromObject(object.self);
		const object_half_len = (bbox.max.y - bbox.min.y) / 2;
		const surface = this.shapeParts[index];
		const point = surface.get_points(xPercent, yPercent);
		const normal = surface.get_normal(point, this.self);
		//console.log("normal ", normal);
		const axis = new THREE.Vector3(0, 1, 0);
		if (normal.x != axis.x || normal.y != axis.y || normal.z != axis.z)
		{
			if (normal.x != Math.abs(axis.x) || normal.y != Math.abs(axis.y) || normal.z != Math.abs(axis.z))
			{
				//console.log("rotate");
				const angle = Math.acos(axis.dot(normal));
				const rotationAxis = axis.cross(normal).normalize();
				object.self.rotateOnAxis(rotationAxis, angle);
			}
			else
			{
				object.self.rotation.set(normal.x *-1, normal.y * -1, normal.z * -1);
				//console.log("inverse rotate");
			}
		}
		object.self.position.set(
			point[0] + (normal.x * object_half_len),
			point[1] + (normal.y * object_half_len),
			point[2] + (normal.z * object_half_len) 
		);
	}
}

export { Model, Component };
