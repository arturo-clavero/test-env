import * as THREE from 'three';
import { Object } from '../objects/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from './simpleAssets';
import { scene1 } from './scene1';
import { form1 } from './div1';
import { State } from '../state/States';
import { MeshSubState , CssSubState} from '../state/SubStatesExtends';
import { StateManager } from '../state/StateManager';
import { SubState } from '../state/SubStates';


//CREATE MODEL
const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;

//CREATE SUBSTATES
const surface = obj1.basePart.shapes[0];
//0. REST - cube scene replace GAME START rest
const restScreen = new MeshSubState(
	"rest", 
	surface,
	scene1,
	null,
	null,
	null,
	(event)=>{ 
		console.log("reached ft key rest")
		if (event.key === 'c')
		{
			console.log("next");
			return "next substate";
		}
	}
)

//1. REGISTRATION 
const formScreen = new CssSubState(
	"form",
	surface,
	form1.div,
	null,
	null,
	null,
	(event)=> {form1.keyHandler(event);}
)
	// document.addEventListener('keydown', (event, input) => {
	// 	if (event.key === 'Enter') {
	// 		console.log("element: ", input);
	// 		console.log("1: ", document.activeElement.id);
	// 		// if (document.activeElement.id === "aliasInput") {
	// 		// 	event.preventDefault();
	// 		// 	opponentInput.focus(); // Move to opponent input
	// 		// } else if (document.activeElement.id === "opponentInput") {
	// 		// 	event.preventDefault();
	// 		// 	console.log("you: ", aliasInput.value, "oponent: ", opponentInput.value); // Submit form
	// 		// 	return "next";
	// 		// }
	// 	} else if (event.key === 'ArrowDown') {
	// 		if (document.activeElement === aliasInput) {
	// 			opponentInput.focus();
	// 		}
	// 	} else if (event.key === 'ArrowUp') {
	// 		if (document.activeElement === opponentInput) {
	// 			aliasInput.focus();
	// 		}
	// 	}
	// }),
// )

//2. GAME - cube scene replace actual game
const endScreen = new MeshSubState(
	"end", 
	surface,
	scene1,
	null,
	null,
	null,
	(event)=>{ if (event.key === 'q') return "restart"; if (event.key === 'c') this.changeSubstate(1);}
)



//CREATE STATE
const test = new State("test cube", null, [0,0,5], [restScreen, formScreen, endScreen])


//CREATE MAIN SUBSSTATE
const mainSub = new SubState("main controls", null, null, null, null, 
	(event)=>{
		console.log("key clicked main substate");
		console.log("->", event.key);
		if (event.key === 'x')
		{
			console.log("next");
			return "next state";
		} 
	},
	()=>{
		restScreen.animate();
	}
)
const main = new State("main view", null, [0, 0, 10], [mainSub]);


new StateManager([main, test]);
//FLOE: 'x', 'c', 'enter', 
//cube, main

//ADD A SCENE TO DIV
// obj1.basePart.shapes[0].add_material(scene1.renderMaterial);


const cube = obj1;

//div registration
//div scene
//div material



console.log(cube);
export {cube}