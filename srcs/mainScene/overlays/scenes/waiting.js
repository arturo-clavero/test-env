import * as THREE from 'three';
// import {MainEngine} from '../../utils/MainEngine';
import { StateManager } from '../../../core/stateManager/StateManager';
import {createRenderTarget, createScreenMaterial } from './utils';
import { Font } from '../../../core/objectFactory/customFont3d';
import { Engine } from './pong-game/setUp/Engine';


const engine = new Engine()

let content_body = new Font(false, engine);
content_body.new("Waiting for next match", "thick", 0, 0.15, 0, 15, 1.5, engine)

const geometry = new THREE.BoxGeometry(1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(geometry, material);
ball.receiveShadow = true;
ball.castShadow = true;
engine.scene.add(ball);

let dir = 1
function animate() {
	ball.rotation.x += 0.01;
	ball.rotation.y += 0.01;
	ball.rotation.z += 0.01;
	ball.position.z += 0.01 * dir;
	if (ball.position.z == 2 || ball.position.z == 0)
		dir *= -1;
  }

  function	resize(e) {
	content_body.initPositions(engine);
	engine.camera.aspect = window.innerWidth / window.innerHeight;
	engine.camera.updateProjectionMatrix();
	engine.setRendererSize(window);
}

const renderTarget = createRenderTarget();
const renderMaterial = createScreenMaterial(renderTarget);

const waiting = {
	"animate" : animate,
	"renderMaterial" : renderMaterial,
	"renderTarget" : renderTarget,
	"scene" : engine.scene,
	"camera" : engine.camera,
	"resize":resize,
}

export { waiting }