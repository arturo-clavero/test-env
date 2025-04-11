import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'
import { Ball } from "../scenes/pong-game/objects/Ball";

//you won round x | you lost round x | you won the tournament!
//you earned
//loading next round | exit

const container = new Overlay([
			new FlexBox({
				dir: "column",
				mainAxis: "space-around",
				flex: 1,
				children: [
					new Text({
						id: "title",
						fontSize : 1
					}),
					new FlexBox({
						dir: "column",
						mainAxis: "space-between",
						id: "prize-announcement",
						children: [
							new Text({
								id: "sub title",
								fontSize : 0.75,
								content: "You earned: "
							}),
							new FlexBox({
								dir: "row",
								mainAxis : "space-between",
								children: [
									new Text({
										id: "prize",
										fontSize: 1,
									}),
									new Text({
										id: "coin",
										content: "ETH",
										fontSize: 0.75,
									})

								]
							})
							
						]
					})
					
				]
				}),
			new FlexBox({
				dir: "row",
				mainAxis: "end",
				children: [
					new Button({
						id: "button",
					})
				]
			})
		])

let exitButton = new Button({
	id: "button",
	fontSize: 0.75,
	content: "EXIT",
	onClick: ()=>{
		if (container.getElementById("button").element.textContent == "EXIT")
		{
			let stateManager = new StateManager();
			stateManager.currentState.changeSubstate(stateManager.currentState.startIndex + 1);
		}	
	}
})

let waitButton = new Button({
	id: "waitButton",
	fontSize: 0.55,
	content: "loading next round",
})

function dynamic_content(data){
	if (data.button == "exit") container.getElementById("button").element.textContent == "EXIT";
	else if (data.button == "wait") container.getElementById("button").element.textContent == "loading next round...";
	container.getElementById("title").element.textContent = data["title"];
	if ("prize" in data)
	{
		const text = container.getElementById("prize").element;

		gsap.to({ val: 0 }, {
			val: data["prize"] - 1,
			duration: 1,
			ease: "power3.out",
			onUpdate: function () {
			text.textContent = Math.floor(this.targets()[0].val).toString();
			},
			onComplete: function () {
			text.textContent = data["prize"]
			gsap.fromTo(text, //if pop out doesnt work try text.textContent
				{ scale: 1 }, 
				{
					scale: 1.3,
					duration: 0.2,
					yoyo: true,
					repeat: 1,
					ease: "power1.inOut"
				}
			);
			}
		});
		

	}	
	else
		container.getElementById("prize-announcement").element.display = "none";
	
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
	hide_buttons();
}



const end = {
	"div" : container.element,
	"show-buttons" : show_buttons,
	"hide-buttons" : hide_buttons,
	"show-div" : show_div,
	"hide-div" : hide_div,
	"resize": ()=>{container.resize()},
	"dynamic-content" : dynamic_content,
}

export {end}
