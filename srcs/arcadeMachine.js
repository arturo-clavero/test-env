import * as THREE from 'three';

const t = 3;
const h = 6;
const squareShape = new THREE.Shape();
squareShape.moveTo( 0, 0 );    // Start at (0, 0)
squareShape.lineTo( 0, h * .98);   // Line to (10, 0)
squareShape.lineTo( t * .8, h);  // Line to (10, 10)
squareShape.lineTo( t * .8, h *.9);   // Line to (0, 10)
squareShape.lineTo( t * .7 , h * .85);  // Close the square by returning to (0, 0)
squareShape.lineTo( t * .75, h * .65);
squareShape.lineTo( t, h * .6);
squareShape.lineTo(t , h * .5);
squareShape.lineTo(t * .88, h * .5);
squareShape.lineTo(t * .88, 0);

const extrudeSettings = {
  depth: t,          // Depth of the cube (how tall it will be)
  bevelEnabled: false ,// No bevel for simplicity
  bevelThickness: 0.5,  // How thick the bevel should be (adds a rounded edge)
  bevelSize: 1,  // The size of the bevel
  bevelSegments: 10  // How smooth the bevel is
};


// const geometry = new THREE.ShapeGeometry( squareShape);

const arcadegeometry = new THREE.ExtrudeGeometry( squareShape, extrudeSettings);
const arcadematerial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const arcadeMachine = new THREE.Mesh(arcadegeometry, arcadematerial);
arcadeMachine.receiveShadow = true;
arcadeMachine.castShadow = true;
let sc = 0.2;
arcadeMachine.scale.set(sc, sc, sc); // Uniformly scale the cube to 50% of its original size
arcadeMachine.position.y = -0.5;
arcadeMachine.position.z = 2;
arcadeMachine.rotation.y = - Math.PI / 2;

export { arcadeMachine }