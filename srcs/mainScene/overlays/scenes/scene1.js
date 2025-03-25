import * as THREE from 'three';
import {MainEngine} from '../../utils/MainEngine';

const engine = new MainEngine();

const secondaryScene = new THREE.Scene();
const secondaryCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
secondaryScene.add(ambientLight);

const topLight = new THREE.SpotLight(0x0053f9, 50);
topLight.position.set(0, 6, 2);
topLight.castShadow = true;
secondaryScene.add(topLight);

const geo = new THREE.PlaneGeometry(100, 200);
const mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const plane = new THREE.Mesh(geo, mat);
secondaryScene.add(plane);
plane.position.z = -10;

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
cube.castShadow = true;
secondaryScene.add(cube);

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
renderMaterial.name = "rest screen";

secondaryCamera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

function updateSize(width, height){
	secondaryCamera.aspect = width / height;
	secondaryCamera.updateProjectionMatrix();
	renderTarget.setSize(width, height);
}

function keyDown(){
	if (cube.material.color.g == 1)
		cube.material.color.set(0x0000ff);
	else if (cube.material.color.b == 1)
		cube.material.color.set(0xff0000);
	else
		cube.material.color.set(0x00ff00);
}

const scene1 = {
	"renderMaterial" : renderMaterial,
	"renderTarget" : renderTarget,
	"animate" : animate,
	"scene" : secondaryScene,
	"camera" : secondaryCamera,
	"keyHandler" : keyDown,

}

export { scene1 };
