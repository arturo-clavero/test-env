import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'
import { Ball } from "../scenes/pong-game/objects/Ball";
import { AlertManager } from "../alerts/Alerts";
import { SwitchButtons } from "../../../core/UIFactory/SwitchButtons";
import { MainEngine } from "../../utils/MainEngine";

//you won round x | you lost round x | you won the tournament!
//you earned
//loading next round | exit

const container = new Overlay([
			new FlexBox({
				dir: "column",
				mainAxis: "space-between",
				height: "100%",
				flex: 1,
				children: [
					new FlexBox({
						dir: "column",
						id : "container",
						mainAxis: "center",
						height: "100%",
						flex: 1,
						children : [
							new Text({
								id: "title",
								fontSize : 1,
								marginBot: "1%, auto"
							}),
							new Text({
								id : "error",
								fontSize: 0.55,
							}),
							new FlexBox({
							dir: "column",
							mainAxis: "space-between",
							id: "prize-announcement",
							marginBottom: "2%, auto",
							marginTop: "1%, auto",
							children: [
								new Text({
									id: "subtitle",
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
						}),
						]
					}),
					new FlexBox({
						dir: "row",
						mainAxis: "space-between",
						width: "100%",
						children: [
							new Button({
								id: "back-button",
								fontSize: 0.55,
								content: "BACK",
								onClick: ()=>{
									if (container.getElementById("exit-button").element.textContent == "EXIT")
										{
											let stateManager = new StateManager();
											stateManager.currentState.changeSubstate(stateManager.currentState.startIndex + 1);
										}	
								}
							}),
							new Button({
								id: "exit-button",
								fontSize: 0.55,
								content: "tst",
								onClick: ()=>{
									if (container.getElementById("exit-button").element.textContent == "EXIT")
										{
											new MainEngine().blockRaycast_to_true();
											new StateManager().changeState(0);
										}	
								}
							})
						]
					}),
				]
			})
		])

let keyHandlerSwitchButtons = null;
let switchButtons = new SwitchButtons(container.getElementsOfType(Button));

function dynamic_content(data){
	container.element.style.visibility = "visible";

	if (data.button == "exit") 
	{
		keyHandlerSwitchButtons = switchButtons;
		container.getElementById("back-button").element.style.visibility = "visible";
		container.getElementById("exit-button").element.textContent = "EXIT";
		new AlertManager().remove_latest_alert("exit alert");
	}
	else if (data.button == "wait")
	{
		keyHandlerSwitchButtons = null;
		container.getElementById("back-button").element.style.visibility = "hidden";
		container.getElementById("exit-button").element.textContent = "loading next round...";
		setTimeout(() => {
			if (new StateManager().currentState.currentSubstateIndex == 10)
				new StateManager().currentState.changeSubstate(11);
		  }, 5000);
	}
	container.getElementById("title").element.textContent = data["title"];
	container.getElementById("error").element.textContent = data["error"];
	if ("prize" in data)
	{
		container.getElementById("prize-announcement").element.style.display = "";
		container.getElementById("prize-announcement").element.style.height = "";
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
	else{
		container.getElementById("prize-announcement").element.style.display = "none";
		container.getElementById("prize-announcement").element.style.height = "0px";
	}
}

function show_buttons(){
	container.getElementById("exit-button").element.style.visibility = "visible";

}

function hide_buttons(){
	container.getElementById("exit-button").element.style.visibility = "hidden";
	container.getElementById("back-button").element.style.visibility = "hidden";
}

function show_div(){
	container.element.style.visibility = "visible";
}

function hide_div(){
	container.element.style.visibility = "hidden";
	hide_buttons();
}

function can_exit(){
	if (container.getElementById("exit-button").element.textContent == "EXIT")
		return true;
	return false;
}

function enter(){
	show_div();
	show_buttons();
	keyHandlerSwitchButtons.switch("prev");
}

function exit(){
	hide_div();
	hide_buttons();
}

const end = {
	"div" : container.element,
	"enter" : enter,
	"exit" : exit,
	"resize": ()=>{container.resize()},
	"dynamic-content" : dynamic_content,
	"can-exit" : can_exit,
	"keyHandler": (event)=>{
		if (keyHandlerSwitchButtons)
			keyHandlerSwitchButtons.keyHandler(event);
		event.preventDefault();
	}
}

export {end}
