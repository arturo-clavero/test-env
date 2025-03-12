import * as THREE from 'three';
import { Part } from '../objects/Part'

const materialsgroup = [
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
]

const singleMaterial = materialsgroup[1];

const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

const part_sym_2d = new Part(
	[[0, 0], [0, 1], [2, 1], [2, 0]], 
	1,
	materialsgroup[1]
);

const part_sym_3d = new Part(
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	1,
	materialsgroup
);

const part_asym = new Part(
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	[[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1]],
	materialsgroup
);

const part_asym_ang = new Part(
	[[0, 0, -2], [0, 1, -2], [1, 1, -2], [1, 0, -2]], 
	[[1, 1, 1], [1, 2, 0], [2, 2, 0], [2, 1, 1]],
	materialsgroup
)

const geo = new THREE.BoxGeometry(1, 1, 1);
const threeCube = new THREE.Mesh(geo, singleMaterial);

export { materialsgroup, singleMaterial, lineBasicMaterial, 
	part_sym_2d, part_sym_3d, 
	part_asym, part_asym_ang,
	threeCube,
}