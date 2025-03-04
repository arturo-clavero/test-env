import * as THREE from 'three';

function order_path(points){
	console.log("points before: ", points);
	let start = [-100, 100];
	let start_index;

	//find the largest x points for the lowest y values aka starting point
	for (let i = 0; i < points.length; i++)
	{
		if (points[i][1] <= start[1] && points[i][0] > start[0])
		{
			start[0] = points[i][0];
			start[1] = points[i][1];
			start_index = i;
		}
	}
	console.log("start: ", start_index);
	//find direction by getting the highest x adjacent point and push
	const ordered = [];
	const next = start_index + 1 < points.length ? points[start_index + 1] : points[0];
	const prev = start_index - 1 > 0 ? points[start_index - 1] : points[points.length - 1];
	console.log("next: ", next, "console.log: ", prev);
	if (next[0] > prev[0]) //positive direction!
	{
		let max = points.length;
		for (let i = start_index; i < max; i++){
			ordered.push(points[i]);
			if (i + 1 == points.length)
			{
				max = start_index;
				i = 0;
			}
		}
	}
	else {
		let max = -1;
		for (let i = start_index; i > max; i--){
			ordered.push(points[i]);
			if (i - 1 < 0)
			{
				max = start_index;
				i = points.length;
			}
		}
	}
	return ordered;
}

class Shape {
	constructor(points, move_back = 0)
	{
		console.log("hello");
		this.custom_geo(order_path(points));
		console.log("done");
		this.material = null;
		this.mesh = null;
		console.log("move back: ", this.z);
		this.z = move_back;
		return this;
	}
	custom_geo(points){
		console.log("check");
		if (points[0].length == 3)
		{
			console.log("3d array");
			console.log(points);
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
			console.log("2d array");
			const shape = new THREE.Shape();
			console.log(points);
			console.log("move to ", points[0][0], points[0][1]);
			shape.moveTo(points[0][0], points[0][1]);
			for (let i = 1; i < points.length; i++)
			{
				console.log("line to ", points[i][0], points[i][1]);
				shape.lineTo(points[i][0], points[i][1]);
			}
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

class GroupObject {
	constructor(type, pointsLeftXY, pointsRightXY, materials){
		this.children = [];
		if (type == "symmetrical")
			this.init_symetrical(pointsLeftXY, pointsRightXY);
		// else if (type == "asymmetrical" && pointsLeftXY.length == pointsRightXY.length)
		// 	this.init_asymetical(pointsLeftXY, pointsRightXY);
		else
			throw new Error("Incorrect parameters");
		this.update_material(materials);
		this.init_group();
		// this.children_map = {};
		// this.onclick = null
		
	}
	
	init_symetrical(points, thickness){
		console.log("points before: ",  points);
		points = this.order_path(points);
		console.log("points ordered: ", points);
		this.shapeParts.push(Shape(points));
		this.shapeParts.push(Shape(points, thickness));
		for (let i = 0; i < points.length; i++){
			const curr = points[i];
			const next = i + 1 < points.length ? points[i + 1] : points[0];
			const curr_extruded = new THREE.Vector3(curr.x, curr.y, curr.z + thickness);
			const next_extruded = new THREE.Vector3(next.x, next.y, next.z + thickness);
			this.shapeParts.push(Shape([curr, next, next_extruded, curr_extruded]));
		}
	}
	// init_asymetical(pLeft, pRight){
	// 	pLeft = order_path(pRight);
	// 	pRight = order_path(pLeft);
	// 	this.children[0] = get_shape(pRight);
	// 	this.children[1] = get_shape(pLeft);
	// 	for (let i = 0; i < pRight.length; i++){
	// 		const currRight = pRight[i];
	// 		const nextRight = i + 1 < pRight.length ? pRight[i + 1] : pRight[0];	
	// 		const currLeft = pLeft[i];
	// 		const nextLeft = i + 1 < pLeft.length ? pLeft[i + 1] : pLeft[0];
	// 		this.children.push(get_shape([currRight, nextRight, nextLeft, currLeft]));
	// 	}
	// }
	update_material(materials){
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
	}
	init_group(){
		new THREE.Group();
		for (let i = 0; i < this.shapeParts.length; i++)
			this.group.add(this.shapeParts[i].get_mesh());
		this.group.raycasting = true;
		this.group.receiveShadow = true;
		this.group.castShadow = true;
	}
	
	// add_children_names(names){
	// 	if (names.length != this.children.length)
	// 	{
	// 		console.log("not enough names given, we need ", this.children.length);
	// 		return;
	// 	}
	// 	for (let i = 0; i < this.children.length; i++){
	// 		this.children_map[names[i]] = this.children[i];
	// 	}
	// }
	// get_child(name){
	// 	if (name in this.children_map)
	// 		return this.children[name];
	// 	else if (name typeof int && name < this.children.length)
	// 		return this.children[i];
	// 	console.log("child not found with key/index ", name);
	// 	return null;
	// }
	// add_materials(materials)
	// {
	// 	if (materials.length != this.children.length)
	// 	{
	// 		console.log("not enough materials given, we need ", this.children.length);
	// 		return;
	// 	}
	// 	for (let i = 0; i < this.children.length; i++){
	// 		this.children[i].addMaterial(materials[i]);
	// 	}
	// }
	// //add_material(material, name){ this.get_child(name).addMaterial(material);}
	// //find_child(name){this.get_child(name).addMaterial(new THREE.MeshBasicMaterial({color: 0xff0000}));}
	// get_borders(type){
	// 	const geo = ;
	// 	if (type == "line")

	// 	else if (type == "mesh")
	// }
	// //redo for child
	// add_object(x, y, name, object){
	// 	const child = this.get_child(name);
	// 	//get childs normal
	// 	//normalize objectt look at 
	// 	//get y of object and move in offset in normal dir
	// 	//set at 0 + x * child.max_width;
	// 	//set at 0 + y * child.max.height;
	// 	// //x and y should be float between -1 and 1
	// }
	// add_onclick(ft) { this.onclick = ft};
	// raycasting(ft) {
	// 	//raycasting logic
	// 	//if intersecitng object is child... then send to child ft
	// 	//else if intseection object then check if child and child has on ft
	// 	//else check if in adult and che  if onclik is not null
	// }
}

export { GroupObject, Shape };
