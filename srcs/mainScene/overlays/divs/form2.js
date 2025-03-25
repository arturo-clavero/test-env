
import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';

class Form2 {
	constructor(color = "white"){
		this.overlay = new Overlay([
			new FlexBox({
				height: "100%",
				flex: 1,
				dir: "column", 
				mainAxis: "space-evenly",
				children: [
					new FlexBox({
						flex: 1,
						dir: "column",
						mainAxis: "space-evenly",
						children: [
								new Text({content: "Your Alias", fontSize: 0.65}),
								new Input({id: "user-alias", autofocus: true, fontSize: 0.5}),
						],
					}),
					new FlexBox({
						flex: 1,
						dir: "column",
						mainAxis: "space-evenly",
						children: [
								new Text({content: "Player 2 Alias", fontSize: 0.65}),
								new Input({id: "oponent-alias", fontSize: 0.5}),
						],
					}),
				],
			}),
			new FlexBox({
				dir: "row", 
				width: "100%",
				crossAxis: "end",
				mainAxis: "end",
				children: [
					new Button({
						color: color,
						id: "enter-button", 
						content: "ENTER", 
						fontSize: 0.55,
						activate: (self)=>{
							self.element.style.transition = "transform 0.1s ease-in-out";
							self.element.style.transform = "scale(1.2)";
						},
						deactivate:(self)=>{
							self.element.style.transition = "transform 0.2s ease-in-out";
							self.element.style.transform = "scale(1)";
						},
						onClick: ()=>{new StateManager().currentState.changeSubstate();},
					}),
				]
			})
			],
			color,
		);
		this.color = color;
		this.div = this.overlay.element;
		this.userInput = this.overlay.getElementById("user-alias");
		this.oponentInput = this.overlay.getElementById("oponent-alias");
		this.enterButton = this.overlay.getElementById("enter-button");
	}

	keyHandler(event){
		if (event.key === 'Enter') {
			if (document.activeElement != this.oponentInput.element) {
				event.preventDefault();
				this.oponentInput.element.focus();
			}
			else {
				event.preventDefault();
				return {change : "substate"};
			}
		} else if (event.key === 'ArrowDown') {
			if (document.activeElement === this.userInput.element)
				this.oponentInput.element.focus();
		} else if (event.key === 'ArrowUp') {
			if (document.activeElement === this.oponentInput.element)
				this.userInput.element.focus();
				event.preventDefault();
		}
		else if (document.activeElement != this.oponentInput.element)
			this.userInput.element.focus()
		return undefined;
	}
	enter(){
		this.div.style.visibility = "visible";
		this.enterButton.element.style.color = this.color;
		this.userInput.element.focus();
		this.userInput.element.value = "";
	}
	exit(){
		this.userInput.element.value = "";
		this.oponentInput.element.value = "";
		this.enterButton.element.style.color = "transparent";

	}
	animate(){this.enterButton.animate();}
	resize(){this.overlay.resize();}
}

export { Form2};