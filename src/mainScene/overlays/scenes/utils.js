import * as THREE from 'three';
import { MainEngine } from '../../utils/MainEngine';
const engine = new MainEngine();
// function createRenderTarget(){
// 	const renderTarget = new THREE.WebGLRenderTarget(2048, 2048, {
// 		minFilter: THREE.LinearFilter,
// 		magFilter: THREE.LinearFilter,
// 		format: THREE.RGBAFormat,
// 		type: THREE.UnsignedByteType,
// 		samples: 8,
// 	  });
// 	renderTarget.texture.encoding = THREE.sRGBEncoding;
// 	renderTarget.texture.anisotropy = engine.renderer.capabilities.getMaxAnisotropy();
// 	renderTarget.texture.generateMipmaps = true;
// 	renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
// 	renderTarget.depthTexture = new THREE.DepthTexture(2048, 2048);
// 	renderTarget.depthTexture.type = THREE.UnsignedShortType;
// 	renderTarget.depthTexture.format = THREE.DepthFormat;
	
// 	renderTarget.texture.magFilter = THREE.LinearFilter;
// 	const texture = renderTarget.texture;
// 	texture.wrapS = THREE.ClampToEdgeWrapping;
// 	texture.wrapT = THREE.ClampToEdgeWrapping;
// 	return renderTarget;
// }

// function createScreenMaterial(renderTarget){
// 	const renderMaterial = new THREE.MeshBasicMaterial({
// 		map: renderTarget.texture,
// 	});
// 	return renderMaterial;
// }

function createRenderTarget() {
    const renderTarget = new THREE.WebGLRenderTarget(2048, 2048, {
        minFilter: THREE.NearestFilter, // Change minFilter to NearestFilter
        magFilter: THREE.NearestFilter, // Change magFilter to NearestFilter
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        samples: 8,
    });

    renderTarget.texture.encoding = THREE.sRGBEncoding;
    renderTarget.texture.anisotropy = engine.renderer.capabilities.getMaxAnisotropy();
    renderTarget.texture.generateMipmaps = false; // Disable mipmaps
    renderTarget.texture.minFilter = THREE.NearestFilter; // Ensure minFilter stays as NearestFilter
    renderTarget.depthTexture = new THREE.DepthTexture(2048, 2048);
    renderTarget.depthTexture.type = THREE.UnsignedShortType;
    renderTarget.depthTexture.format = THREE.DepthFormat;

    renderTarget.texture.magFilter = THREE.NearestFilter; // Ensure magFilter stays as NearestFilter

    const texture = renderTarget.texture;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    return renderTarget;
}

function createScreenMaterial(renderTarget) {
    const renderMaterial = new THREE.MeshBasicMaterial({
        map: renderTarget.texture,
    });
    return renderMaterial;
}


export {createRenderTarget, createScreenMaterial}