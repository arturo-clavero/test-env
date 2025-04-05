import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';

let prize_pool = 100

const container = new Overlay([
	new FlexBox({
		dir: "column",
		children: [
			new FlexBox({
				padding: '10%',
				children: [
					new Text({
						content: "WIN UP TO ",
						fontsize: 0.85
					}),
					new Text({
						content: `${prize_pool} ETC !`,
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
				content: "entry 100 ETC",
				fontSize: 0.45
			}),
			new Button({
				id: "button",
				content: "JOIN",
				fontSize: 0.45,
				onClick: ()=>{new StateManager().currentState.swapSubstate("create")}
			})
		]
	})	
])


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

function change_button(new_content, status){
	container.getElementById("button").style.content = new_content;
	//change color based on status
}

const join = {
	"div" : container.element,
	"show-buttons" : show_buttons,
	"hide-buttons" : hide_buttons,
	"show-div" : show_div,
	"hide-div" : hide_div,
	"resize": ()=>{container.resize()},
}

export {join}