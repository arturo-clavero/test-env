import * as THREE from 'three';
import {MainEngine} from '../../utils/MainEngine';
import { StateManager } from '../../../core/stateManager/StateManager';

const engine = new MainEngine();

const secondaryScene = new THREE.Scene();
const secondaryCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
secondaryScene.add(ambientLight);

const topLight = new THREE.SpotLight(0x0053f9, 50);
topLight.position.set(0, 6, 2);
topLight.castShadow = true;
secondaryScene.add(topLight);

const geometry = new THREE.SphereGeometry(1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const ball = new THREE.Mesh(geometry, material);
ball.receiveShadow = true;
ball.castShadow = true;
secondaryScene.add(ball);

secondaryCamera.position.z = 15;

document.addEventListener('keydown', function(event) {
    keyDown(event);
});

function keyDown(event){
	if (event.key == "ArrowDown")
		dir.y = -1;
	if (event.key == "ArrowUp")
		dir.y = 1;
	if (event.key == "ArrowLeft")
		dir.x = -1;
	if (event.key == "ArrowRight")
		dir.x == 1;
	if (event.key == "x")
		end_game();
}

function end_game(){
	console.log("end game");
	new StateManager().currentState.changeSubstate();
}

const dir = {x: 1, y: 1};
function animate() {
	
	  ball.position.x += 0.1 * dir.x;
	  if (ball.position.x > 5 || ball.position.x < -5)
		dir.x *= -1;
	  ball.position.y += 0.1 * dir.y;
	  if (ball.position.y > 5 || ball.position.y < -5)
		dir.y *= -1;
  }

const renderTarget = new THREE.WebGLRenderTarget(4096, 2048, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat,
	type: THREE.UnsignedByteType,
	samples: 8,
  });

renderTarget.texture.anisotropy = engine.renderer.capabilities.getMaxAnisotropy();
renderTarget.texture.generateMipmaps = true;
renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
renderTarget.depthTexture = new THREE.DepthTexture();
renderTarget.depthTexture.format = THREE.DepthFormat;
renderTarget.depthTexture.type = THREE.UnsignedShortType;

renderTarget.texture.minFilter = THREE.LinearFilter;
renderTarget.texture.magFilter = THREE.LinearFilter;
const texture = renderTarget.texture;
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;
const renderMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(1, 1, 1),
    emissiveMap: texture,
    emissiveIntensity: 10,
    roughness: 0.5,
    metalness: 0.5,
});


function updateSize(width, height){
	secondaryCamera.aspect = width / height;
	secondaryCamera.updateProjectionMatrix();
	renderTarget.setSize(width, height);
}
const fakeGame = {
	"renderMaterial" : renderMaterial,
	"renderTarget" : renderTarget,
	"animate" : animate,
	"scene" : secondaryScene,
	"camera" : secondaryCamera,
	"keyHandler" : keyDown,

}

export { fakeGame }