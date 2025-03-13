import * as THREE from 'three';
import { MainEngine } from './mainScene/utils/mainSetUp';
import { backBox } from './mainScene/objects/background/backBox';
import { cube } from './mainScene/experiments/test';
import { scene1 } from './mainScene/experiments/scene1';
import {form1_2d } from './mainScene/experiments/div1';


const engine = new MainEngine();

engine.add(backBox, false);
engine.add(cube, false);



cube.basePart.shapes[0].self.add(form1_2d);

function animate() {
	requestAnimationFrame(animate);
	engine.animate();
	scene1.animate();

}


scene1.updateSize(2000, 1000);

animate();
