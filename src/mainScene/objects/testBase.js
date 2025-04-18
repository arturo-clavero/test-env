import { MainEngine } from "../utils/MainEngine";
import { Object } from "../../core/objectFactory/Object";
import { Part } from "../../core/objectFactory/Part";
import * as THREE from 'three';

function scaleCoords(coords, width = 1, height = 1) {
	return coords.map(([x, y]) => [x * width, y * height]);
}
const baseCoord = [
	[0, 0],
	[0, 0.98],
	[0.8, 1],
	[0.8, 0.9],
	[0.7, 0.85],
	[0.75, 0.65],
	[0.88, 0.6],
	[0.88, 0.5],
	[0.85, 0.5],
	[0.85, 0],
	[0, 0],
];

// const baseCoord = [[0, 0], [0, 2], [1, 2], [1, 0]];

const r_base_mat = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide});
const base_mat = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide});

const basePart = new Part(
	baseCoord, 
	0.5,
	[r_base_mat, r_base_mat, base_mat],
	"abstract"
);

const object = new Object(basePart);
object.self.position.z = 9;
object.self.position.x = 0;
object.self.position.y = 3;

console.log(object.basePart.shapes)
export const testObj = object;