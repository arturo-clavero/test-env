import * as THREE from 'three';
import { order_path } from './utils';

class Shape {
	constructor(points, move_back = 0)
	{
		this.custom_geo(order_path(points));
		this.material = null;
		this.mesh = null;
		this.z = move_back;
		return this;
	}
	custom_geo(points){
		if (points[0].length == 3)
		{
			this.geometry = new THREE.BufferGeometry();
			const vertices = [];
			for (let i = 0; i < points.length; i++)
				vertices.push(points[i][0], points[i][1], points[i][2]);
			this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			const indices = [0, 1, 2, 2, 3, 0];
			this.geometry.setIndex(indices);
			this.geometry.computeVertexNormals();
		}
		else if (points[0].length == 2)
		{
			const shape = new THREE.Shape();
			shape.moveTo(points[0][0], points[0][1]);
			for (let i = 1; i < points.length; i++)
				shape.lineTo(points[i][0], points[i][1]);
			shape.closePath();
			this.geometry = new THREE.ShapeGeometry(shape);
		}
	}

	add_material(material)
	{
		if (this.material == null)
		{
			this.material = material;
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.position.z -= this.z;
		}
		else
		{
			this.mesh.material = material;
			this.mesh.material.needsUpdate = true;
		}
	}

	update_material(attribute, value){
		if (this.mesh == null)
		{
			console.log("Error: no mesh!");
			return;
		}
		if (attribute == "color")
			this.mesh.material.color.set(value);
		else if (attribute == "roughness")
			this.mesh.material.roughness = value;
		else if (attribute == "metalness")
			this.mesh.material.metalness = value;
		else
		{
			console.log("Error: did not recognise material attribute!");
			return ;
		}
		this.mesh.material.needsUpdate = true;
	}

	get_mesh(){
		if (this.mesh)
			return this.mesh;
		console.log("Error: no mesh!");
	}
}

export { Shape };