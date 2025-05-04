import { Object } from '../../../core/objectFactory/Object'
import { Part } from '../../../core/objectFactory/Part';
import { noiseTexture } from '../simpleAssets';
import * as THREE from 'three';

const arcade_points = [
    [0, 0],         // [w[0], h[0]]
    [0, 1],         // [w[0], h[6]]
    [0.9, 1],       // [w[3], h[7]]
    [0.9, 0.87],     // [w[3], h[5]]
    [0.7, 0.87],    // [w[1], h[4]]
    [0.7, 0.55],    // [w[2], h[3]]
    [1, 0.45],       // [w[5], h[2]]
    [1, 0.35],       // [w[5], h[1]]
    [0.85, 0],      // [w[4], h[1]]
];

const arcade_side_points = [
    [-0.1, -0.05], //-1, -1 // x= -%/w, y =-%/h
    [-0.1, 1.05], //-1, +1 
    [1.0, 1.05], //+1, +1      // [w[3], h[7]]
    [1.0, 0.82], // +1, -1   // [w[3], h[5]]
    [0.8, 0.82],  //+1, -1  // [w[1], h[4]]
    [0.8, 0.6],  //+1, +1  // [w[2], h[3]]
    [1.1, 0.5],  //+1, +1    // [w[5], h[2]]
    [1.1, 0.3],   //+1, -1    // [w[5], h[1]]
    [0.95, -0.05],  //+1 -1    // [w[4], h[1]]
];

function scale_points(points, wFactor, hFactor) {
    return points.map(([x, y]) => [
        x * wFactor,   // Apply width factor
        y * hFactor    // Apply height factor
    ]);
}

const defaultScreenMaterial =  new THREE.MeshStandardMaterial({
	map: noiseTexture,
	side: THREE.FrontSide,
	opacity: 1,
});


export function make_arcade_machine({height, width, thick, material, border = null, screenBorderThick = 0, sideThick = 0, screenMaterial = defaultScreenMaterial})
{
	let sideLpart = null;
	let sideRpart = null;
	const obj = new Object(new Part(
		scale_points(arcade_points, height, width), 
		thick,
		material
	));
	if (border){
		if (screenBorderThick > 0 || sideThick > 0)
		{
			obj.basePart.add_borders([5], border)
		}
		else {
			obj.basePart.add_borders([2, 3, 4, 5, 6, 7], border)
		}
	}
	if (screenBorderThick > 0)
	{
		console.log("border")
		sideLpart = new Part(//should be on blue aka index 0
			scale_points(arcade_points, height, width), 
			screenBorderThick,
			material
		);
		sideRpart = new Part(
			scale_points(arcade_points, height, width), 
			screenBorderThick,
			material
		);
		console.log("adding part to obj")
		obj.add_object(0.5, 0.5, [0, 0], sideLpart, [0, 1, 0])
		console.log("adding part to obj")
		obj.add_object(0.5, 0.5, [0, 1], sideRpart, [0, 1, 0], -1)
		if (border && sideThick == 0){

		}
	}
	// if (sideThick > 0)
	// {
	// 	const sideL = new Part(//should be on blue aka index 0
	// 		scale_points(arcade_side_points, height, width), 
	// 		sideThick,
	// 		material,
	// 	);
	// 	const sideR= new Part(
	// 		scale_points(arcade_side_points, height, width), 
	// 		sideThick,
	// 		material,
	// 	);
	// 	if (sideLpart)
	// 		sideLpart.add_object(0.5, 0.5, 0, sideL.self, true, [0, 1, 0], 1)
	// 	else
	// 		obj.add_object(0.5, 0.5, 0, 0, sideL, [0, 1, 0])
	// 	if (sideRpart)
	// 		sideRpart.add_object(0.5, 0.5, 1, sideR.self, true, [0, 1, 0], -1)
	// 	else
	// 		obj.add_object(0.5, 0.5, 0, 1, sideR, [0, 1, 0], -1)
	// 	if (border){

	// 	}
	// }
	const partIndex = 0;
	const surfaceIndex = 5;
	const screenSurface = obj.self.children[partIndex].children[surfaceIndex].userData.instance;
	screenSurface.add_material( screenMaterial);
	return ({"object" : obj, "screenSurface" : screenSurface, "partIndex" : partIndex, "surfaceIndex": surfaceIndex});
}

function create_joystick(material){
	const joystick = new Object(new Part([[0, 0],[0, 0.08],[0.08, 0.08],[0.08, 0]], 0.4, material))
	const geometry = new THREE.SphereGeometry(0.08, 32, 32); // radius 1, segments
	const ball = new THREE.Mesh(geometry, material);
	joystick.add_object(0.5, 0.5, [0, 0], ball, [0,0,1], 1, true, 0.8)
	return joystick;
}

// function create_handle(material){
// 	const base = new Object(new Part([[0, 0], [0, 0.5], [2.5, 0.5], [2.5, 0]], 0.01, material))
// 	const distance = 0.2;
// 	const stick1 = create_joystick(material)
// 	base.add_object(0 + distance, 0.3, [0, 0], stick1, [0, 1, 0],1, true, 0.5)
// 	stick1.self.rotation.x += Math.PI/4
// 	const stick2 = create_joystick(material)
// 	base.add_object(1 - distance, 0.3, [0, 0], stick2, [0, 1, 0],1,true,  0.5 )
// 	stick2.self.rotation.x += Math.PI/4
// 	return base;
// }

// function create_button(amount, material, radius = 0.05, rows = 1,){
// 	const group = new THREE.Group();
// 	const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, 16);
// 	for (let i  = 0; i < amount; i++)
// 	{
// 		const button = new THREE.Mesh(geometry, material);
// 		button.rotation.x += Math.PI/2;
// 		if (rows == 1) {
// 			const offset = (i - (amount - 1) / 2) * radius * 4;
// 			button.position.x = offset;
// 		}
// 		group.add(button);
// 	}
// 	return group;
// }
function create_button(amount, material,  rows = 1,radius = 0.05) {
	const group = new THREE.Group();
	const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, 16);
	const spacing = radius * 4;

	// Calculate buttons per row
	let buttonsPerRow = Math.ceil(amount / rows);

	for (let i = 0; i < amount; i++) {
		const button = new THREE.Mesh(geometry, material);
		button.rotation.x = Math.PI / 2;
		const row = Math.floor(i / buttonsPerRow);
		const col = i % buttonsPerRow;
		if ((amount / rows) % 2 != 0 && i + 1 == amount)
			buttonsPerRow -= 1;
		let xOffset = (col - (buttonsPerRow - 1) / 2) * spacing;
		const yOffset = -((row - (rows - 1) / 2) * spacing);
		button.position.set(xOffset, yOffset, 0);
		group.add(button);
	}

	return group;
}

function create_handle(material){
	const base = new Object(new Part([[0, 0], [0, 0.5], [2.5, 0.5], [2.5, 0]], 0.01, material))
	const distance = 0.2;
	const button1 = create_button(3, material, 2)
	base.add_object(0 + distance, 0.3, [0, 0], button1, [0, 1, 0],1, true, 0.5)
	// const stick2 = create_joystick(material)
	// base.add_object(1 - distance, 0.3, [0, 0], stick2, [0, 1, 0],1,true,  0.5 )
	// stick2.self.rotation.x += Math.PI/4
	return base;
}

export function add_controls(side, controls, obj){
	let controlObj;
	if (controls == "handle")
	{
		controlObj = create_handle(new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }))
	}

	console.log("ayoo",	obj.basePart.self.children[4].userData.instance.normal)
	// obj.basePart.self.children[4].userData.instance.normal = new THREE.Vector3(0, 1, 0)

	console.log("ayoo",	obj.basePart.self.children[4].userData.instance.normal)
	obj.add_object(0.5, 0.5, [0, 4], controlObj, [0, 0, 1], true, )
	controlObj.self.rotation.z += Math.PI / 2;
	controlObj.self.position.y -= 0.8;
	controlObj.self.position.z += 1;
	controlObj.self.position.x -= 0.35;


}
