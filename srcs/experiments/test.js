// import * as THREE from 'three';
// import { Object } from '../core/objectFactory/Object'
// import { materialsgroup, singleMaterial, 
// 		part_sym_2d, part_sym_3d, 
// 		part_asym, part_asym_ang,
// 		threeCube} from './prev/simpleAssets';

// import { State } from '../core/state/States';
// import { MeshSubState , CssSubState} from '../core/state/SubStatesExtends';
// import { StateManager } from '../core/state/StateManager';
// import { SubState } from '../core/state/SubStates';

// import { start } from '../mainScene/overlays/divs/start'
// import { form1 } from '../mainScene/overlays/divs/form1';
// import { scene1 } from './scene1';
// import {end } from '../mainScene/overlays/divs/end';

// // CREATE MODEL
// const obj1 = new Object(part_sym_2d);
// obj1.self.position.z = 3;

// //CREATE SUBSTATES
// const surface = obj1.basePart.shapes[0];

// const startScreen = new CssSubState(
// 	"start",
// 	surface,
// 	start.div,
// 	start.enter,
// 	start.exit,
// 	start.resize,
// 	(event)=> { return start.keyHandler(event);},
// 	start.animate,
// )

// const formScreen = new CssSubState(
// 	"form",
// 	surface,
// 	form1.div,
// 	form1.enter,
// 	form1.exit,
// 	form1.resize,
// 	(event)=> { return form1.keyHandler(event);},
// 	form1.animate,
// )

// const restScreen = new MeshSubState(
// 	"rest", 
// 	surface,
// 	scene1,
// 	null,
// 	null,
// 	null,
// 	(event)=>{ 
// 		if (event.key === 'Enter')
// 			return {change : "substate"};
// 	}
// )

// const endScreen = new CssSubState(
// 	"end", 
// 	surface,
// 	end.div,
// 	end.enter,
// 	end.exit,
// 	end.resize,
// 	(event)=>{
// 		end.keyHandler(event);
// 	}
// )

// //CREATE STATE
// const test = new State("test cube", {pos: [0,0,5], duration: 2, ease: "power2.inOut"}, [startScreen, formScreen, restScreen, endScreen])

// //CREATE MAIN SUBSSTATE
// const mainSub = new SubState("main controls", null, null, null, null, 
// 	(event)=>{
// 		if (event.key === 'x')
// 			return{change : "state", index : 0};
// 	},
// 	()=>{
// 		restScreen.animate();
// 		//here animate the start screens!
// 	}
// )
// const main = new State("main view", {pos: [0,0,10], duration: 4, ease: "power2.inOut"}, [mainSub]);

// const stateManager = new StateManager([main, test]);
// //FLOE: 'x', 'c', 'enter', 
// //cube, main

// //ADD A SCENE TO DIV
// // obj1.basePart.shapes[0].add_material(scene1.renderMaterial);


// const cube = obj1;

// //div registration
// //div scene
// //div material



// export {cube, stateManager}