import * as THREE from 'three';

export function updateLabel(label, ball, camera, renderer) {
	// Get ball world position
	const ballPosition = new THREE.Vector3();
	ball.getWorldPosition(ballPosition);

	// Project center to screen
	const projectedCenter = ballPosition.clone().project(camera);

	// Compute direction from ball to camera
	const camDirection = new THREE.Vector3();
	camera.getWorldDirection(camDirection);
	ball.geometry.computeBoundingSphere()

	const radiusVector = camDirection.clone().normalize().multiplyScalar(ball.geometry.boundingSphere.radius);

	// Add radius vector to center to get an edge point
	const edgeWorldPosition = ballPosition.clone().add(radiusVector);
	const projectedEdge = edgeWorldPosition.clone().project(camera);

	// Convert NDC (-1 to 1) to screen pixels
	const widthHalf = 0.5 * renderer.domElement.clientWidth;
	const heightHalf = 0.5 * renderer.domElement.clientHeight;

	const centerX = (projectedCenter.x * widthHalf) + widthHalf;
	const centerY = (-projectedCenter.y * heightHalf) + heightHalf;

	const edgeX = (projectedEdge.x * widthHalf) + widthHalf;
	const edgeY = (-projectedEdge.y * heightHalf) + heightHalf;

	// Distance between center and edge = screen-space radius
	const radiusPx = Math.sqrt((edgeX - centerX) ** 2 + (edgeY - centerY) ** 2);
	const diameterPx = radiusPx * 2;

	const div = label.element;
	div.style.width = `${diameterPx}px`;
	div.style.height = `${diameterPx}px`;
	div.style.left = `${centerX - radiusPx}px`;
	div.style.top = `${centerY - radiusPx}px`;
}

export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
