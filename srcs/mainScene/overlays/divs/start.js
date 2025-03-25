import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';

class StartScreen{
	constructor(color = "black"){
		this.overlay = new Overlay([
					new FlexBox({
						flex: 1,
					}),
					new FlexBox({
						dir: "row",
						width: "100%",
						crossAxis: "end",
						mainAxis: "end",
						children : [
							new Button({
								fontSize: 0.65,
								color: color,
								content: "ENTER",
								id: "enter-button",
								activate: (self)=>{
									self.element.style.transition = "transform 0.1s ease-in-out";
    								self.element.style.transform = "scale(1.2)";
								},
								deactivate:(self)=>{
									self.element.style.transition = "transform 0.2s ease-in-out";
									self.element.style.transform = "scale(1)";
								},
								onClick: ()=>{new StateManager().currentState.changeSubstate();},
							})
						]
					}),
		]);
		this.color = color;
		this.div = this.overlay.element;
		this.enterButton = this.overlay.getElementById("enter-button");
	}
	keyHandler(event){
		if (event.key === 'Enter') {
				event.preventDefault();
				return {change : "substate"};
		}
		return undefined;
	}
	enter(){
		this.div.style.visibility = "visible";
		this.enterButton.element.style.color = this.color;
	}
	exit(){this.enterButton.element.style.color = "transparent";}
	animate(){this.enterButton.animate();}
	resize(){this.overlay.resize();}
}

export { StartScreen};