import { update } from "three/examples/jsm/libs/tween.module.js";
import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'

let entryPrice = 100

const container = new Overlay([
	new FlexBox({
		dir: "column",
		children: [
			new FlexBox({
				dir: "column",
				padding: '10%',
				children: [
					new Text({
						content: "WIN UP TO ",
						fontsize: 0.85
					}),
					new Text({
						id: "prize-context",
						content: `heuy`,
						fontsize: 1
					}),
				],
			}),
			new Text({
				content: "STARTS IN",
				fontSize: 0.45
			}),
			new Text({
				content: "TIMER",
				fontSize: 1
			}),
			new Text({
				content:  `entry ${entryPrice} ETC`,
				fontSize: 0.45
			}),
			new Button({
				id: "button",
				content: "JOIN",
				fontSize: 0.45,
				onClick: ()=>{
					console.log(tourId);
					new Socket().send({
						"channel":"tournament",
						"action":"join",
						"tour_id" : tourId,
					})
					new Socket().send({
						"channel":"tournament",
						"action":"succesfull payment",
						"tour_id" : tourId,
					})
				}
			})
		]
	})	
])
let tourId;
function setTourId(newTourId){ tourId = newTourId}

function show_buttons(){
	console.log(container.getElementById("button").element);
	container.getElementById("button").element.style.visibility = "visible";
}

function hide_buttons(){
	container.getElementById("button").element.style.visibility = "hidden";
}

function show_div(){
	container.element.style.visibility = "visible";
	show_buttons();
	console.log("show div");
}

function hide_div(){
	container.element.style.visibility = "hidden";
	hide_buttons();
}

function change_button(new_content){
	container.getElementById("button").element.textContent = new_content;
	//change color based on status
}

function updatePrizePool(value){
	// prizePool = value;
	console.log("updating1");
	console.log("content prev: ", container.getElementById("prize-context").element)
	container.getElementById("prize-context").element.textContent = `${value} ETC !`;

}
const join = {
	"div" : container.element,
	"show-buttons" : show_buttons,
	"hide-buttons" : hide_buttons,
	"show-div" : show_div,
	"hide-div" : hide_div,
	"resize": ()=>{container.resize()},
}

export {join, updatePrizePool, setTourId, change_button}