
import * as THREE from 'three';
import { Shape } from "./CustomShapes";
import { order_path } from './utils';

class Model {
	constructor(type, pointsLeftXY, pointsRightXY, materials){
		this.shapeParts = [];
		this.group = null;
		if (type == "symmetrical")
			this.init_symetrical(pointsLeftXY, pointsRightXY);
		// else if (type == "asymmetrical" && pointsLeftXY.length == pointsRightXY.length)
		// 	this.init_asymetical(pointsLeftXY, pointsRightXY);
		else
			throw new Error("Incorrect parameters");
		if (materials)
			this.add_material(materials);
		// this.children_map = {};
		// this.onclick = null
		
	}
	
	init_symetrical(points, thickness){
		console.log("points before: ",  points);
		points = order_path(points);
		console.log("points ordered: ", points);
		this.shapeParts.push(new Shape(points));
		this.shapeParts.push(new Shape(points, thickness));
		for (let i = 0; i < points.length; i++){
			const curr = points[i];
			const next = i + 1 < points.length ? points[i + 1] : points[0];
			const curr_extruded = [curr[0], curr[1], curr[2] - thickness];
			const next_extruded = [next[0], next[1], next[2] - thickness];
			console.log("stats: ", curr, next, curr_extruded, next_extruded)
			this.shapeParts.push(new Shape([curr, next, next_extruded, curr_extruded]));
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
		if (!this.group);
			this.init_group();		
	}
	init_group(){
		this.group = new THREE.Group();
		for (let i = 0; i < this.shapeParts.length; i++)
			this.group.add(this.shapeParts[i].mesh);
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
	// add_material(material, name){ 
	// 	if (name)
	// 	{
	// 		//this.get_child(name).addMaterial(material);
	// 		return ; 
	// 	}
	// 	for (let i = 0; i < this.shapeParts.length; i++)
	// 		this.shapeParts[i].add_material(material);
	// }
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

export { Model };
