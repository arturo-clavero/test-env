import * as THREE from 'three';
import { order_path, update_min_max } from './utils';

class Shape {
	constructor(points, move_back = 0, geometry)
	{
		this.z = move_back;
		this.vertex = points;
		this.geometry = points.length == 0 ? geometry : this.custom_geo(order_path(points));
		this.material = null;
		this.self = null;
		this.normal = null;
		this.onclick = null;
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
			geometry.computeVertexNormals();
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
		return geometry;
	}

	add_material(material)
	{
		if (this.material == null)
		{
			this.material = material;
			this.self = new THREE.Mesh(this.geometry, this.material);
			this.self.position.z -= this.z;
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
		return (new THREE.LineLoop(this.geometry, lineBasicMaterial));
	}

	get_points(xPercent, yPercent){
		let limits = update_min_max(this.vertex);
		console.log("limits: ", limits);

		let x1 = limits.min[0], x2 = limits.max[0], y1 = limits.min[1], y2 = limits.max[1];
		let x = x1 + ((x2- x1) * xPercent);
		let y = y1 + ((y2- y1) * yPercent);
		let f = (x2 - x1) * (y2 - y1)
		let z = ((((x2 - x) * (y2 - y)) / (f)) * this.vertex[0][2]) +
				((((x - x1) * (y2 - y)) / (f)) * this.vertex[1][2]) + 
				((((x2 - x) * (y - y1)) / (f)) * this.vertex[2][2]) +
				((((x - x1) * (y - y1)) / (f)) * this.vertex[3][2]);
		return [x, y, z];
	}
	get_normal(point){
		if (this.normal == null)
		{
			this.geometry.computeVertexNormals();
			this.normal = new THREE.Vector3(this.geometry.attributes.normal.array[0], this.geometry.attributes.normal.array[1], this.geometry.attributes.normal.array[2]);
			const offset = 0.001;
			const origin = new THREE.Vector3(
				point[0] - (this.normal.x * offset), 
				point[1] - (this.normal.y * offset),
				point[2] - (this.normal.z * offset)
			);
			const raycaster = new THREE.Raycaster();
			raycaster.set(origin, this.normal);
			const intersection = raycaster.intersectObject(this.self);
			if (intersection.length == 0 || intersection[0].distance > offset * 2)
			{
				this.normal.x *= -1;
				this.normal.y *= -1;
				this.normal.z *= -1;
				console.log("incorrect normal");
			}
		}
		return this.normal;
	}
	add_onclick(ft) { this.onclick = ft};
}

export { Shape };