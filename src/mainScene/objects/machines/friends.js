import { Object } from '../../../core/objectFactory/Object'
import { Part } from '../../../core/objectFactory/Part';
import { scale_points, cube_points } from '../geoAssets';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import * as THREE from 'three';
import { MainEngine } from '../../utils/MainEngine';
import { max, min, modelRadius } from 'three/tsl';
const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const border_material =  new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const width = 3;
const height = 3;
const length = 4;

const bottom = new Object(new Part(scale_points(cube_points, width, height), length / 2, material));
const top = new Object(new Part(scale_points(cube_points, width, height), length / 4, material));
const glass = new Object(new Part(scale_points(cube_points, width, height), length, new THREE.MeshBasicMaterial({
	color: 0x0000ff,
	side: THREE.DoubleSide,
	transparent: true,
	// wireframe: true,
	opacity: 0.1,
  })));
glass.basePart.add_borders([2, 3, 4, 5], border_material);
console.log("bottom normal: ", bottom.basePart.shapes[3].self )
bottom.add_object(0.5, 0.5, [0, 1], glass, [0, 1, 0], -1)
glass.add_object(0.5, 0.5, [0, 1], top, [0, 1, 0], -1)

const test = bottom;
test.self.position.z = 5
test.self.position.y = 2
test.self.rotation.x += Math.PI / 2

let friends = [
	{"avatar" : '/src/assets/fakeFriends/a1.jpg', "name" : "a1"},
	{"avatar" : '/src/assets/fakeFriends/a2.jpg', "name" : "a2"},
	{"avatar" : '/src/assets/fakeFriends/a3.jpg', "name" : "a3"},
	{"avatar" : '/src/assets/fakeFriends/a4.jpg', "name" : "a4"},
	// {"avatar" : '/src/assets/fakeFriends/a5.jpg', "name" : "a5"},
	// {"avatar" : '/src/assets/fakeFriends/a6.jpg', "name" : "a6"},
	// {"avatar" : '/src/assets/fakeFriends/a7.jpg', "name" : "a7"},
	// {"avatar" : '/src/assets/fakeFriends/a1.jpg', "name" : "a1"},
	// {"avatar" : '/src/assets/fakeFriends/a2.jpg', "name" : "a2"},
	// {"avatar" : '/src/assets/fakeFriends/a3.jpg', "name" : "a3"},
	// {"avatar" : '/src/assets/fakeFriends/a4.jpg', "name" : "a4"},
	// {"avatar" : '/src/assets/fakeFriends/a5.jpg', "name" : "a5"},
	// {"avatar" : '/src/assets/fakeFriends/a6.jpg', "name" : "a6"},
	// {"avatar" : '/src/assets/fakeFriends/a7.jpg', "name" : "a7"},
]

const total_balls = friends.length < 5 ? 5 : friends.length > 15 ? 15 : friends.length;
const gridSize = Math.ceil(Math.sqrt(total_balls));
console.log("griid", gridSize)
const cellWidth = width / gridSize;
const cellLength = length / gridSize;

const cellIndices = [];
for (let x = 0; x < gridSize; x++) {
	for (let y = 0; y < gridSize; y++) {
			cellIndices.push({x, y});
	}
}

console.log("cell indeces: ", cellIndices)
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//shuffleArray(cellIndices);

const balls = new THREE.Group();

for (let i = 0; i < total_balls; i++) {
	//create mesh
	let ball;
	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array([0, 0, 0]);
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	const material = new THREE.PointsMaterial({
		color: 0xff00ff,
		size: 0.2,
		sizeAttenuation: true
	});
	ball = new THREE.Points(geometry, material);

	//bounded random pos:
	const { x, y} = cellIndices[i];
	const jitter = 0.4;
	let min_x, min_z, max_x, max_z, total_x, total_z;
	let f = 0.2;
	total_x = height - (2 * f)
	total_z = length - (2 * f)
	min_x = ((- height / 2) + f) + (total_x * (x/ gridSize))
	min_z = ((- length / 2) + f) + (total_z * (y/ gridSize))
	max_x = min_x + (total_x / gridSize);
	max_z = min_z + (total_z / gridSize);
	const pos = new THREE.Vector3(
		min_x + ((max_x - min_x) * 0.5),
		THREE.MathUtils.randFloat((- width / 2 ) +f , (width / 2) - f),
		min_z + ((max_z - min_z) * 0.5),
	);
	// console.log("X : rr", - height / 2, height/2, "range", min_x, max_x, "part", x, "total", total_x, "pos: ", pos.x)
	// console.log("Z : rr", - length / 2, length/2, "range", min_z, max_z, "part", y, "total", total_z, "pos: ", pos.z)

	ball.position.copy(pos);

	// Save Y for floating effect
	const baseY = ball.position.z;
	const amplitude = 0.05;
	const frequency = THREE.MathUtils.randFloat(0.0015, 0.0025);
	const offset = Math.random() * Math.PI * 2;
	ball.userData.float = { baseY, amplitude, frequency, offset };

	// Add avatar label
	let avatar = friends && i < friends.length ? friends[i].avatar : null
	add_avatar(avatar, ball);
	balls.add(ball);
}

glass.self.add(balls)

function add_avatar(avatar, ball)
{
	const div = document.createElement('div');
	div.className = 'label';
	div.style.width = '40px';
	div.style.height = '40px';
	div.style.borderRadius = '50%';
	div.style.overflow = 'hidden';
	div.style.background = '#ff00ff';
	div.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)';

	const overlay = document.createElement('div');
	overlay.style.position = 'absolute';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.borderRadius = '59%';
	// overlay.style.backgroundColor = '#000'; // Or any other color like pink/magenta
	// overlay.style.opacity = '0.5'; // Adjust this value for stronger or softer effect
	overlay.style.background = `
	radial-gradient(
		circle at 50% 50%,
		transparent 40%,
		rgba(0, 0, 0, 0.4) 80%,
		rgba(0, 0, 0, 0.8)
	)
	`;
	div.appendChild(overlay);
	if (avatar)
	{
		const img = document.createElement('img');
		console.log("avatar: ", avatar)
		img.src = avatar;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'cover';
		div.appendChild(img);

	}

	const label = new CSS3DObject(div);
	label.position.set(0, 0, 0)
	label.rotation.x -= Math.PI/2;
	label.scale.set(0.012, 0.012, 0.012);

	ball.add(label);
}

const engine = new MainEngine()
function animateBalls() {

	const t = Date.now();
	//balls.rotation.x += 0.003
	balls.rotation.z += 0.002

	balls.children.forEach(ball => {
		if (ball.children[0])
			ball.children[0].lookAt(engine.camera.position);			
		const { baseY, amplitude, frequency, offset } = ball.userData.float;
		const delta = Math.sin(t * frequency + offset) * amplitude;
		ball.position.z = baseY + delta;
	});
  }
  
export {test, animateBalls}