
import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';

class Form1 {
	constructor(){
		this.overlay = new Overlay([
			new FlexBox({
					flex: 1,
					dir: "column",
					children: [
						new FlexBox({
							dir: "column",
							mainAxis: "space-evenly",
							height: '100%',
							children: [
									new Text({content: "Your Alias"}),
									new Input({id: "user-alias", autofocus: true, fontSize: 0.75}),
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
		]);
		this.div = this.overlay.element;
		this.userInput = this.overlay.getElementById("user-alias");
		this.enterButton = this.overlay.getElementById("enter-button");
	}

	keyHandler(event){
		if (event.key === 'Enter') {
				event.preventDefault();
				return {change : "substate"};
		}
		else if (document.activeElement != this.userInput.element)
			this.userInput.element.focus()
		return undefined;
	}

	enter(){
		this.userInput.element.focus();
		this.userInput.element.value = "";
	}

	exit(){
		this.userInput.element.value = "";
	}

	animate(){
		this.enterButton.animate();
	}

	resize(){
		this.overlay.resize();
	}
}

export { Form1};