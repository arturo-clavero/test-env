
import * as THREE from 'three';
import { Shape } from "./CustomShapes";
import { order_path } from './utils';

class Model {
	constructor(object){
		this.base = object;
		this.objects = [];
		this.self = new THREE.Group();
		this.self.add(this.base.self);
		this.objects.push(this.base.self);
		this.onclick = null;
		this.self.raycasting = true;
		this.self.receiveShadow = true;
		this.self.castShadow = true;
	}
	add_component(Xpercent, Ypercent, indexObject, indexFace, object){
		//const object = Object(type, pointsLeftXY, pointsRightXY, materials);
		this.objects[indexObject].add_object(Xpercent, Ypercent, indexFace, object)
		this.self.add(object);
		this.objects.push(object);
	}
	add_onclick(ft) { this.onclick = ft};
	handle_click(raycaster) {
		const intersects = raycaster.intersectObject(this.self, true);
		if (intersects.length > 0) {
			if (this.onclick)
				this.onclick();
			intersects.forEach((intersection) => {
       			intersection.object.handleClick(raycaster);
    		});
		}
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
		this.onclick = null;
	}
	init_symetrical(points, thickness){
		this.width = thickness;
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
		pRight = order_path(pRight);
		this.shapeParts[0] =  new Shape(pRight);
		pLeft = order_path(pLeft);
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
	}
	get_borders(map, lineBasicMaterial){
		if (map.length != this.shapeParts.length)
		{
			console.log("Error: incorrect mapping for borders");
			return ;
		}
		this.border = new THREE.Group();
		for (let i = 0; i < map.length; i++)
		{
			let material = Array.isArray(lineBasicMaterial) ? lineBasicMaterial[i] : lineBasicMaterial;
			if (map[i] == 1)
				this.self.add(this.shapeParts[i].get_borders(material));
		}

		// if (this.width)
		// 	return null;
		// if (this.edges == null)
		// {
		// 	const baseGeometry = new THREE.ExtrudeGeometry(this.baseShape, { depth: this.width, bevelEnabled: false });
		// 	const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
		// 	this.edges = new THREE.LineSegments(edgesGeometry, LineBasicMaterial);
		// }
		// return this.edges;
	}

	add_object(xPercent, yPercent, index, object){
		const bbox = new THREE.Box3().setFromObject(object);
		const object_half_len = (bbox.max.y - bbox.min.y) / 2;
		x = bbox.min.x + (bbox.max.x - bbox.min.x) * xPercent;
		y = bbox.min.y + (bbox.max.y - bbox.min.y) * yPercent;
		const raycaster = new THREE.Raycaster();
		raycaster.set((x, y, bbox.max.z + 1), (0, 0, -1));
		intersects = raycaster.intersectObject(this.shapeParts[index].self, true);
		if (intersects.length > 0)
		{
			const point = intersects[0].point;
			const normal = intersects[0].face.normal.clone();
			normal.applyMatrix4(this.self.matrixWorld()).normalize();
			const up = new THREE.Vector3(0, 1, 0);
			object.quartenion = new THREE.Quaternion(up, normal);
			object.position = (
				point[0] + (normal[0] * object_half_len),
				point[1] + (normal[1] * object_half_len),
				point[2] + (normal[2] * object_half_len) 
			);
		}
		else
			console.log("Error could not intersect!");
	}
	add_onclick(ft) { this.onclick = ft};
	handle_click(raycaster){
		if (this.add_onclick)
			this.add_onclick();
	}
}

export { Model, Component };
