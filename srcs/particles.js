
// Create a geometry for particles (a simple box with a lot of points)
const particleCount = 10000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);  // X, Y, Z positions
const velocities = new Float32Array(particleCount * 3);  // X, Y, Z velocities

const bounds = {
	xMin: -0.1, xMax: 0.1,
	yMin: -0.15, yMax: 0.15,
	zMin: 0, zMax: 0.8
  };
// Create random positions for the particles
for (let i = 0; i < particleCount; i++) {
	positions[i * 3] = Math.random() * (bounds.xMax - bounds.xMin) + bounds.xMin; // Random X between xMin and xMax
	positions[i * 3 + 1] = Math.random() * (bounds.yMax - bounds.yMin) + bounds.yMin; // Random Y between yMin and yMax
	positions[i * 3 + 2] = Math.random() * (bounds.zMax - bounds.zMin) + bounds.zMin;

  // Set initial random velocities for each particle
  velocities[i * 3] = Math.random() * 0.00035 - 0.00025;  // Random velocity in X
  velocities[i * 3 + 1] = Math.random() * 0.00035 - 0.00025;   // Random velocity in Y
  velocities[i * 3 + 2] = Math.random() * 0.00035 - 0.00025;  // Random velocity in Z
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a material for the particles (using transparency and soft color)
const material = new THREE.PointsMaterial({
  color: 0xaaaaaa,  // Light gray fog color
  size: 0.01,        // Size of each particle
  transparent: true, // Make the particles semi-transparent
  opacity: 0.3     // Control the opacity
});

// Create the particle system (Points object)
const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cube for animation
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
	  // Animate the particles with velocity and keep them within bounds
	  const positions = geometry.attributes.position.array;
  
	  for (let i = 0; i < particleCount; i++) {
		// Update the particle positions
		positions[i * 3] += velocities[i * 3];
		positions[i * 3 + 1] += velocities[i * 3 + 1];
		positions[i * 3 + 2] += velocities[i * 3 + 2];
	
		// Ensure the particles stay within the boundaries
		// For X axis
		if (positions[i * 3] < bounds.xMin || positions[i * 3] > bounds.xMax) {
		  velocities[i * 3] = -velocities[i * 3]; // Reverse X velocity when out of bounds
		}
		
		// For Y axis
		if (positions[i * 3 + 1] < bounds.yMin || positions[i * 3 + 1] > bounds.yMax) {
		  velocities[i * 3 + 1] = -velocities[i * 3 + 1]; // Reverse Y velocity when out of bounds
		}
	
		// For Z axis
		if (positions[i * 3 + 2] < bounds.zMin || positions[i * 3 + 2] > bounds.zMax) {
		  velocities[i * 3 + 2] = -velocities[i * 3 + 2]; // Reverse Z velocity when out of bounds
		}
	  }
	
	  // Update the position buffer after changing positions
	  geometry.attributes.position.needsUpdate = true;
	controls.update();
    renderer.render(scene, camera);
}