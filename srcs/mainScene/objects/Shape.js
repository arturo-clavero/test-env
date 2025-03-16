import * as THREE from 'three';
import { order_path, update_min_max } from '../utils/utils';

function get_geometry_normal_vector(geometry)
{
	geometry.computeVertexNormals();
	return new THREE.Vector3(geometry.attributes.normal.array[0], geometry.attributes.normal.array[1], geometry.attributes.normal.array[2]);
}

function reverse_order(points){
	const new_points = [points[0]];
	for (let i = points.length - 1; i >= 1; i--)
		new_points.push(points[i]);
	points = new_points;
}

function reverse_order_in_pairs(points){
	const new_points = [points[0], points[1]];
	for (let i = points.length - 1; i >= 1; i--)
	{
		i--;
		new_points.push(points[i]);
		i++;
		new_points.push(points[i]);
		i--;
	}
	points = new_points;
}

// function rotate(normal, axis){
// 			// if (normal.x != axis.x || normal.y != axis.y || normal.z != axis.z)
// 			// {
// 			// 	if (normal.x != Math.abs(axis.x) || normal.y != Math.abs(axis.y) || normal.z != Math.abs(axis.z))
// 			// 	{
// 					// console.log("rotate");
// 					const angle = Math.acos(axis.dot(normal));
// 					const rotationAxis = axis.cross(normal).normalize();
// 					object.rotateOnAxis(rotationAxis, angle);
// 			// 	}
// 			// 	else
// 			// 	{
// 			// 		object.rotation.set(normal.x *-1, normal.y * -1, normal.z * -1);
// 			// 		console.log("inverse rotate");
// 			// 	}
// 			// }
// }
class Shape {
	constructor(points, move_back = 0, geometry)
	{
		this.z = move_back;
		// console.log(points);
		this.vertex3d = [];
		this.vertex3d = points.length == 0 ? []: order_path(points);
		this.vertex2d = [];
		this.geometry = points.length == 0 ? geometry : this.custom_geo(this.vertex3d);
		this.material = null;
		this.self = null;
		this.normal = null;
		this.onclick = null;
		this.bbox = null;
		return this;
	}
	custom_geo(points){
		let geometry;
		if (points[0].length == 3)
		{
			geometry = new THREE.BufferGeometry();
			const vertices = [];
			for (let i = 0; i < points.length; i++)
				vertices.push(points[i][0], points[i][1], points[i][2]);
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			const indices = [0, 1, 2, 2, 3, 0];
			geometry.setIndex(indices);
		}
		else if (points[0].length == 2)
		{
			const shape = new THREE.Shape();
			shape.moveTo(points[0][0], points[0][1]);
			for (let i = 1; i < points.length; i++)
				shape.lineTo(points[i][0], points[i][1]);
			shape.closePath();
			geometry = new THREE.ShapeGeometry(shape);
		}
		const uvs = this.calc_uvs(geometry);// const uvs = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]);
		
		return geometry;
	}
	calc_uvs(geometry)
	{
		const curr_normal = get_geometry_normal_vector(geometry);
		const target = new THREE.Vector3(0, 0, 1);
		// const angle = Math.acos(axis.dot(normal));
		// const rotationAxis = axis.cross(normal).normalize();
		let quaternion = new THREE.Quaternion();
		quaternion.setFromUnitVectors(curr_normal, target);
		this.vertex3d.forEach(p => this.vertex2d.push(new THREE.Vector3(p[0], p[1], p[2])));
		// console.log("vertex before.. ", this.vertex2d);
		this.vertex2d.forEach(v => v.applyQuaternion(quaternion));
		// console.log("vertex after.. ", this.vertex2d);
		const limits = update_min_max(this.vertex2d);
		const min = limits.min[0] < limits.min[1] ? limits.min[0] : limits.min[1];
		const max = limits.max[0] > limits.max[1] ? limits.max[0] : limits.max[1];
		// console.log("limits: ", limits);
		const uvs =[]
		this.vertex2d.forEach((v)=>{
			let x = (v.x - min) / (max - min);
			let y = (v.y - min) / (max - min);
			// console.log("x: ", x);
			// console.log("y: ", y);
			uvs.push(x);
			uvs.push(y);
		});
		// for (let i = 0; i < this.vertex2d.length; i++){
		// 	let x  = (this.vertex2d[i][0] - limits.min.x) / (limits.max.x - limits.min.x);
		// 	let y = (this.vertex2d[i][1] - limits.min.y) / (limits.max.y - limits.min.y);

			
		// 	// uvs.push((this.vertex2d[i][0] - limits.min.x) / (limits.max.x - limits.min.x));
		// 	// uvs.push((this.vertex2d[i][1] - limits.min.y) / (limits.max.y - limits.min.y));
		// }
		// console.log("uvs: ", uvs);
		geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
	}
	add_material(material)
	{
		if (this.material == null)
		{
			this.material = material;
			this.self = new THREE.Mesh(this.geometry, this.material);
			this.self.position.z -= this.z;
			this.self.userData.instance = this;
		}
		else
		{
			this.self.material = material;
			this.self.material.needsUpdate = true;
		}
	}

	update_material(attribute, value){
		if (this.self == null)
		{
			console.log("Error: no mesh!");
			return;
		}
		if (attribute == "color")
			this.self.material.color.set(value);
		else if (attribute == "roughness")
			this.self.material.roughness = value;
		else if (attribute == "metalness")
			this.self.material.metalness = value;
		else
		{
			console.log("Error: did not recognise material attribute!");
			return ;
		}
		this.self.material.needsUpdate = true;
	}

	get_mesh(){
		if (this.self)
			return this.self;
		console.log("Error: no mesh!");
	}

	get_borders(lineBasicMaterial){
		const border = new THREE.LineLoop(this.geometry, lineBasicMaterial);
		if (this.z != 0)
			border.position.z -= this.z;
		border.userData.instance = this;
		border.userData.raycaster = false;
		return (border);
	}

	get_points(xPercent, yPercent){
		let limits = update_min_max(this.vertex);
		//console.log("limits: ", limits);

		let x1 = limits.min[0], x2 = limits.max[0], y1 = limits.min[1], y2 = limits.max[1];
		let x = x1 + ((x2- x1) * xPercent);
		let y = y1 + ((y2- y1) * yPercent);
		//console.log("x ", x, "y ", y);
		let f = (x2 - x1) * (y2 - y1)
		let z = ((((x2 - x) * (y2 - y)) / (f)) * this.vertex[0][2]) +
				((((x - x1) * (y2 - y)) / (f)) * this.vertex[1][2]) + 
				((((x2 - x) * (y - y1)) / (f)) * this.vertex[2][2]) +
				((((x - x1) * (y - y1)) / (f)) * this.vertex[3][2]);
		return [x, y, z];
	}
	get_normal(point, parentComponent){
		if (this.normal == null)
		{
			this.normal = get_geometry_normal_vector(this.geometry);
			const origin = new THREE.Vector3(point[0], point[1],point[2]);
			const raycaster = new THREE.Raycaster();
			raycaster.set(origin, this.normal);
			const intersection = raycaster.intersectObject(parentComponent);
			const validIntersections = [];
			for (let i = 0; i < intersection.length; i++)
			{
				if (intersection[i].distance == 0 && ! intersection[i].object.userData.raycaster)
					validIntersections.push(intersection[i]);
			}
			if (validIntersections.length > 0)
			{
				this.geometry.index.array = this.geometry.index.array.reverse();
				reverse_order(this.vertex2d);
				reverse_order(this.vertex3d);
				reverse_order_in_pairs(this.geometry.attributes.uv);
			}
		}
		return this.normal;
	}
	add_onclick(ft) { console.log("adding on click"); this.onclick = ft};
	handle_click(){
		console.log("called handle click...");
		console.log(this);
		if (this.onclick)
		{
			console.log(this);
			this.onclick();
		}
		else
			console.log("no on click for surface ", this.material.color.r, this.material.color.g, this.material.color.b);
	}
}

export { Shape };