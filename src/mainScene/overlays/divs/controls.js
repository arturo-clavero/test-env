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
								id: "button",
								content: "READY",
								fontSize : 0.55,
								onClick: ()=>{
									new StateManager().currentState.changeSubstate();
								}
							})
						]
					}),
				]
			})
		])
function box_style(element){
	element.style.display = "inline-flex";
	element.style.justifyContent = "center";
	element.style.alignItems = "center";
	element.style.aspectRatio = "1 / 1";
element.style.height = "30%"; // or 100%
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
		dir: "column",
		marginBottom: "20%",
		flex: 1,
		width: "100%",
		children: [
			new Text({
				content: title,
				fontSize: 0.55,
				marginBottom: "3%",
			}),
			new FlexBox({
				dir: "row",
				marginBottom: "5%",
				crossAxis: "center",
				mainAxis: "space-between",
				width: "100%",
				flex: 1,
				children: [
					new FlexBox({
						width: "100%",
						dir : "row",
						mainAxis: "center",
						children: [
							new Text({
								content: "Up",
								fontSize: 0.45,
							}),
							new FlexBox({
								id: "up-box",
								marginBottom : "10%",
								children: [
									new Text({
										color: "black",
										content: up,
										fontSize: "2rem",
										fontFamily: "monospace",
									}),
								]
							}),
						]
					}),
					new FlexBox({
						width: "50%",
						dir : "row",
						mainAxis: "center",
						children: [
							new Text({
								content: "Down",
								fontSize: 0.45,
							}),
							new FlexBox({
								id: "down-box",
								children: [
									new Text({
										color: "black",
										content: down,
										fontSize: "2rem",
										fontFamily: "monospace",
									}),
								]
							})
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
			dir: "column",
			crossAxis: "center",
			flex: 1,
			mainAxis: "space-evenly",
			children: [
				get_controls_tab( "Left Player", "W", "S"),
				get_controls_tab( "Right Player", "arrow up", "arrow down")
			]
		});
	}
	else if (type == "ai"){
		new_controls = new FlexBox({
			dir: "column",
			mainAxis: "center",
			flex: 1,
			children: [
				get_controls_tab( "Player (left)", "arrow up", "arrow down"),
			]
		});
	}
	else if (type == "remote"){
		new_controls = new FlexBox({
			dir: "column",
			mainAxis: "center",
			flex: 1,
			children: [
				get_controls_tab( "Player (left or right)", "arrow up", "arrow down"),
			]
		});	
	}
	container.getElementById("controls").element.replaceWith(new_controls.element);
	show_div();
	interval = setInterval(()=>{
		let i = Math.floor(Math.random() * boxes.length);
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
	show_buttons();
}

function hide_div(){
	container.element.style.visibility = "hidden";
	hide_buttons();
}

function exit(){
	clearInterval(interval);
	new_controls.element.replaceWith(container.getElementById("matches").element)
	hide_div();
}

container.element.style.visibility = "hidden";

const controls = {
	"div" : container.element,
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
