import { StateManager } from "../../../core/stateManager/StateManager";
import { State } from "../../../core/stateManager/States";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'

const container = new Overlay([
			new FlexBox({
				dir:"column",
				mainAxis: "space between",
				flex: 1,
				width: "100%",
				marginTop: "10%",
				children: [
					new FlexBox({
						id: "controls"
					}),
					new FlexBox({
						width: "100%",
						dir: "row",
						mainAxis: "end",
						children: [
							new Button({
								width: "100%",
								id: "button",
								content: "READY",
								fontSize : 0.55,
								onClick: ()=>{
									new StateManager().currentState.changeSubstate();
									console.log("clicked")
								}
							})
						]
					}),
				]
			})
		])
function box_style(element){
	element.style.display = "inline-flex";
	element.style.aspectRatio = 1;
	element.style.justifyContent = "center";
	element.style.alignItems = "center";
	// element.style.width = "100%";
	element.style.height = "50%";
	element.style.margin = "20%";
	element.style.border = "2px solid #ccc";
	element.style.borderRadius = "8px";
	element.style.background = "#f9f9f9";
	element.style.boxShadow = "0 4px #aaa";
	element.style.fontSize = "1rem";
	element.style.fontFamily = "sans-serif";
	element.style.transition = "all 0.1s ease";
	// element.style.transform = "scale(0.5)"; // scale to 80%
}

function box_pressed(element){
	element.style.transform = "translateY(4px)";
	element.style.boxShadow = "0 0 #aaa";
	element.style.backgroundColor = "#e0e0e0";
	setTimeout(() => {
		element.style.transform = "translateY(0)";
		element.style.boxShadow = "0 4px #aaa";
		element.style.backgroundColor = "#f9f9f9";
	  }, 150);

}
let boxes = []
function get_controls_tab(title, up, down){
	if (up == "arrow up")
		up = "\u2191";
	if (down == "arrow down")
		down = "\u2193";
	let controls = new FlexBox({
		flex: 1,
		dir: "column",
		marginBottom: "20%",
		children: [
			new Text({
				content: title,
				fontSize: 0.75,
				marginBottom: "3%",
			}),
			new FlexBox({
				dir: "row",
				marginBottom: "5%",
				crossAxis: "center",
				mainAxis: "center",
				children: [
					new Text({
						content: "Up",
						fontSize: 0.65,
					}),
					new FlexBox({
						id: "up-box",
						marginBottom : "10%",
						children: [
							new Text({
								color: "black",
								content: up,
								fontSize: "2rem",
								marginLR: "6%",
							}),
						]
					}),
					new Text({
						content: "Down",
						fontSize: 0.65,
						marginLR: "6%",
					}),
					new FlexBox({
						id: "down-box",
						children: [
							new Text({
								color: "black",
								content: down,
								fontSize: "2rem",
							}),
						]
					})
				]
			})
		]
	});
	box_style(controls.getElementById("down-box").element);
	box_style(controls.getElementById("up-box").element);
	boxes.push(controls.getElementById("down-box").element);
	boxes.push(controls.getElementById("up-box").element);
	return controls;
}

let new_controls, interval;
function enter(type){
	if (type == "local")
	{
		new_controls = new FlexBox({
			flex: 1,
			dir: "column",
			// crossAxis: "center",
			// mainAxis: "space-evenly",
			children: [
				get_controls_tab( "Left Player", "W", "S"),
				get_controls_tab( "Right Player", "arrow up", "arrow down")
			]
		});
	}
	else if (type == "ai"){
		new_controls = new FlexBox({
			flex: 1,
			dir: "column",
			mainAxis: "center",
			children: [
				get_controls_tab( "Player (left)", "arrow up", "arrow down"),
			]
		});
	}
	else if (type == "remote"){
		new_controls = new FlexBox({
			flex: 1,
			dir: "column",
			mainAxis: "center",
			children: [
				get_controls_tab( "Player (left or right)", "arrow up", "arrow down"),
			]
		});	
	}
	container.getElementById("controls").element.replaceWith(new_controls.element);
	show_div();
	let stable_i = 0, i =0;
	interval = setInterval(()=>{
		if (boxes.length > 2)
			i = Math.floor(Math.random() * boxes.length);
		else
			i = (i + 1) % 2;
		box_pressed(boxes[i]);
	}, 1000);
}
		

function show_buttons(){
	container.getElementById("button").element.style.visibility = "visible";
}

function hide_buttons(){
	container.getElementById("button").element.style.visibility = "hidden";
}

function show_div(){
	container.element.style.visibility = "visible";
}

function hide_div(){
	container.element.style.visibility = "hidden";
}

function exit(){
	console.log("exit")
	clearInterval(interval);
	new_controls.element.replaceWith(container.getElementById("controls").element)
	hide_div();
}

container.element.style.visibility = "hidden";

const controls = {
	"div" : container.element,
	"show-buttons": show_buttons,
	"hide-buttons": hide_buttons,
	"enter" : enter,
	"resize": ()=>{container.resize()},
	"exit" : exit,
	"keyHandler" : (event)=>{
		if (event.key === 'Enter') {
				event.preventDefault();
				return {change : "substate"};
		}
		return undefined;
	}
}

export {controls}
