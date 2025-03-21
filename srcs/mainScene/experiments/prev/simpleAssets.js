import * as THREE from 'three';
import { Part } from '../../objects/Part'

const materialsgroup = [//phong
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xfff000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide}),
	new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
	new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide}),
]
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
	{
		console.log('loading started')
	}
	loadingManager.onLoad = () =>
	{
		console.log('loading finished')
	}
	loadingManager.onProgress = () =>
	{
		console.log('loading progressing')
	}
	loadingManager.onError = () =>
	{
		console.log('loading error')
	}
const textureLoader = new THREE.TextureLoader(loadingManager);

const texture = textureLoader.load('../../../assets/image1.jpg');
texture.colorSpace = THREE.SRGBColorSpace;

const textureMat =   new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, opacity: 1 });

const singleMaterial = materialsgroup[1];

const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

const part_sym_2d = new Part(
	[[0, 0], [0, 1], [2, 1], [2, 0]], 
	1,
	textureMat,
);

const part_sym_3d = new Part(
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	1,
	materialsgroup[2]
);

const part_asym = new Part(
	[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 
	[[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1]],
	materialsgroup
);

// const part_asym_ang = new Part(
// 	[[0, 0, -2], [0, 1, -2], [1, 1, -2], [1, 0, -2]], 
// 	[[1, 1, 1], [1, 2, 0], [2, 2, 0], [2, 1, 1]],
// 	materialsgroup
// )

const geo = new THREE.BoxGeometry(1, 1, 1);
const threeCube = new THREE.Mesh(geo, singleMaterial);

const part_asym_ang = 2;
export { materialsgroup, singleMaterial, lineBasicMaterial, 
	part_sym_2d, part_sym_3d, 
	part_asym, part_asym_ang,
	threeCube,
}