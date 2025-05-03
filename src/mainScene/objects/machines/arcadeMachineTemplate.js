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

function create_handle(){
	const col = new Part([[0, 0], [0, 0.1], [0.1, 0.1], [0.1, 0]], 0.4, new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }))
	const geometry = new THREE.SphereGeometry(0.15, 32, 32);
	const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
	const ball = new THREE.Mesh(geometry, material);	
	col.add_object(0.5, 0.5, 0, ball, true, [0, 1, 0], 1);
	return col;
}

export function add_controls(side, controls, obj){
	let controlsL, controlsR;
	if (controls == "handle")
	{
		controlsL = create_handle();
		controlsR = create_handle();


	}
	obj.add_object(1.6, 0.7, 0, 4, controlsL, [0, 1, 0], 1)
	obj.add_object(0.5, 0.5, 0, 4, controlsR, [0, 1, 0], 1)

}
