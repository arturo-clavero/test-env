import * as THREE from 'three';
import { order_path } from './utils';

class Shape {
	constructor(points, move_back = 0, geometry)
	{
		this.z = move_back;
		this.geometry = points.length == 0 ? geometry : this.custom_geo(order_path(points));
		this.material = null;
		this.self = null;
		this.normal = 0;
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
	add_onclick(ft) { this.onclick = ft};
}

export { Shape };