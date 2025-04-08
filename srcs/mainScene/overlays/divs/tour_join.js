import { update } from "three/examples/jsm/libs/tween.module.js";
import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'

let entryPrice = 100

const container = new Overlay([
	new FlexBox({
		dir: "column",
		id: "inner-div",
		children: [
			new FlexBox({
				dir: "column",
				padding: '10%',
				id : "prize-container",
				children: [
					new Text({
						id: "prize-context",
						content: `WIN UP TO `,
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
				fontSize: 0.45,
			})
		]
	})	
])


let joinButton = new Button({
	id: "button",
	content: "JOIN",
	fontSize: 0.45,
	onClick : ()=>{
			new Socket().send({
				"channel":"tournament",
				"action":"join",
			})
			// new StateManager().currentState.changeSubstate();
		}
})

let subscribedButton = new Button({
	id: "button",
	content: "Subscribed",
	fontSize: 0.45,
})

let fullButton = new Button({
	id: "button",
	content: "FULL",
	fontSize: 0.45,
})

function show_buttons(){
	container.getElementById("button").element.style.visibility = "visible";
	joinButton.element.style.visibility = "visible";
	subscribedButton.element.style.visibility = "visible";
	fullButton.element.style.visibility = "visible";

}

function hide_buttons(){
	container.getElementById("button").element.style.visibility = "hidden";
	joinButton.element.style.visibility = "hidden";
	subscribedButton.element.style.visibility = "hidden";
	fullButton.element.style.visibility = "hidden";
}

function show_div(){
	container.element.style.visibility = "visible";
}

function hide_div(){
	container.element.style.visibility = "hidden";
	hide_buttons();
}

function dynamic_content(data){
	if ("prize_pool" in data)
	{
		let value = data["prize_pool"];
		if (value == 0)
			container.getElementById("prize-context").element.textContent = `TOURNAMENT !`;
		else
			container.getElementById("prize-context").element.textContent = `WIN UP TO ${value} ETC !`;
	}
	if ("button" in data){
		let new_content = data["button"];
		let button = container.getElementById("button").element;
		if (new_content == "join") button.replaceWith(joinButton.element);
		else if (new_content == "subscribed") button.replaceWith(subscribedButton.element);
		else if (new_content == "full" && button.textContent != "Subscribed") button.replaceWith(fullButton.element);

	}

}
const join = {
	"div" : container.element,
	"show-buttons" : show_buttons,
	"hide-buttons" : hide_buttons,
	"show-div" : show_div,
	"hide-div" : hide_div,
	"resize": ()=>{container.resize()},
	"dynamic-content" : dynamic_content,
}

export {join}