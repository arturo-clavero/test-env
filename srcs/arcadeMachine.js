import * as THREE from 'three';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';

const arcadeMachine = new THREE.Group();

function get_shape(total_height, total_width)
{
	const h_ratios = [0, 0.5, 0.6, 0.65, 0.85, 0.9, 0.98, 1];
	const w_ratios = [0, 0.7, 0.75, 0.8, 0.85, 0.88, 1];
	const h = h_ratios.map(ratio => ratio * total_height);
	const w = w_ratios.map(ratio => ratio * total_width);
	const squareShape = new THREE.Shape();
	squareShape.moveTo(w[0], h[0]);
	squareShape.lineTo(w[0], h[6]);
	squareShape.lineTo(w[3], h[7]);
	squareShape.lineTo(w[3], h[5]);
	squareShape.lineTo(w[1], h[4]);
	squareShape.lineTo(w[2], h[3]);
	squareShape.lineTo(w[5], h[2]);
	squareShape.lineTo(w[5], h[1]);
	squareShape.lineTo(w[4], h[1]);
	squareShape.lineTo(w[4], h[0]);
	return squareShape;
}
const scale = 0.2;
const height = 6 * scale;
const width = 3 * scale;

const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const baseShape = get_shape(height, width);
const baseGeometry = new THREE.ExtrudeGeometry(baseShape, { depth: width, bevelEnabled: false });
const base = new THREE.Mesh(baseGeometry, material);
arcadeMachine.add(base);

const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 5 });
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
arcadeMachine.add(edges);

arcadeMachine.receiveShadow = true;
arcadeMachine.castShadow = true;
arcadeMachine.position.y = -0.5;
arcadeMachine.position.z = 2;
arcadeMachine.rotation.y = -Math.PI / 2;

export { arcadeMachine }