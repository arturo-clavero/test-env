import * as THREE from 'three';
import { Shape } from "./Shape";
import { order_path, mapToCenter } from '../utils/utils';

class Part {
	constructor(pointsLeftXY, pointsRightXY, materials){
		this.width = 0;
		this.shapes = [];
		this.self = null;
		this.joined_parts = [];
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
		if (points[0].length == 2)
		{
			for (let i = 0; i < points.length; i++)
				points[i] = [points[i][0], points[i][1], 0];
		}
		points = mapToCenter(points, thickness);
		points = order_path(points);
		this.baseShape = new Shape(points);
		this.shapes.push(this.baseShape);
		this.shapes.push(new Shape([], thickness, this.baseShape.geometry.clone()));
		for (let i = points.length -1 ; i >= 0; i--){
			const curr = points[i];
			const next = i + 1 < points.length ? points[i + 1] : points[0];
			const curr_extruded = [curr[0], curr[1], curr[2] - thickness];
			const next_extruded = [next[0], next[1], next[2] - thickness];
			this.shapes.push(new Shape([curr, next, next_extruded, curr_extruded]));
		}
	}
	init_asymetrical(pLeft, pRight){
		const newPoints = mapToCenter(pLeft, pRight);
		pRight = order_path(newPoints.right);
		this.shapes[0] =  new Shape(pRight);
		pLeft = order_path(newPoints.left);
		this.shapes[1] = new Shape(pLeft);
		for (let i = 0; i < pRight.length; i++){
			const currRight = pRight[i];
			const nextRight = i + 1 < pRight.length ? pRight[i + 1] : pRight[0];	
			const currLeft = pLeft[i];
			const nextLeft = i + 1 < pLeft.length ? pLeft[i + 1] : pLeft[0];
			this.shapes.push(new Shape([currRight, nextRight, nextLeft, currLeft]));
		}
	}
	add_material(materials){
		if (! Array.isArray(materials))
		{
			for (let i = 0; i < this.shapes.length; i++)
				this.shapes[i].add_material(materials);
		}
		else
		{
			for (let i = 0; i < this.shapes.length; i++)
			{
				let j = i < materials.length ? i : materials.length - 1;
				this.shapes[i].add_material(materials[j]);
			}
		}
		if (!this.self);
			this.init_group();		
	}
	init_group(){
		this.self = new THREE.Group();
		for (let i = 0; i < this.shapes.length; i++)
			this.self.add(this.shapes[i].self);
		this.self.userData.instance = this;
	}
	add_borders(map, lineBasicMaterial){
		if (!lineBasicMaterial)
		{
			console.log("ERROR: you forgot to add material to add border!");
			return;
		}
		if (!Array.isArray(map))
		{
			console.log("ERROR: map in add_border should be an array!");
			return ;
		}
		if (map.length == 0)
		{
			console.log("adding all borders")
			for (let i = 0; i < this.shapes.length; i++)
				map.push(i);
		}
		else
			console.log("adding border...");
		for (let i = 0; i < map.length; i++)
		{
			let material = Array.isArray(lineBasicMaterial) ? lineBasicMaterial[i] : lineBasicMaterial;
			console.log("adding to ", map[i]);
			this.self.add(this.shapes[map[i]].get_borders(material));
		}
	}

	add_object(xPercent, yPercent, index, object, obj_axis){
		const bbox = new THREE.Box3().setFromObject(object);
		const object_half_len = (bbox.max.y - bbox.min.y) / 2;
		const surface = this.shapes[index];
		const point = surface.get_points(xPercent, yPercent);
		const normal = surface.get_normal(point, this.self);
		//console.log("normal ", normal);
		const axis = new THREE.Vector3(obj_axis[0], obj_axis[1], obj_axis[2]);
		console.log("axis ", axis);
		if (normal.x != axis.x || normal.y != axis.y || normal.z != axis.z)
		{
			if (normal.x != Math.abs(axis.x) || normal.y != Math.abs(axis.y) || normal.z != Math.abs(axis.z))
			{
				console.log("rotate");
				const angle = Math.acos(axis.dot(normal));
				const rotationAxis = axis.cross(normal).normalize();
				object.rotateOnAxis(rotationAxis, angle);
			}
			else
			{
				object.rotation.set(normal.x *-1, normal.y * -1, normal.z * -1);
				console.log("inverse rotate");
			}
		}
		console.log("normal", normal);
		object.position.set(
			point[0] + (normal.x * object_half_len),
			point[1] + (normal.y * object_half_len),
			point[2] + (normal.z * object_half_len) 
		);
		this.self.add(object);
		this.joined_parts.push(object);
	}
}

export { Part };
