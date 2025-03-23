import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';

class StartScreen{
	constructor(color){
		this.overlay = new Overlay([
			new FlexBox({
				width: "100%",
				height: "100%",
				dir: "column",
				padding: '5%',
				children : [
					new FlexBox({
						flex: 1,
						children : [
							new Text({content: "START GAME", fontSize: 2})
						]
					}),
					new FlexBox({
						dir: "row",
						width: "100%",
						crossAxis: "end",
						mainAxis: "end",
						children : [
							new Button({
								content: "ENTER",
								id: "enter-button",
								activate: (self)=>{
									self.element.style.transition = "transform 0.1s ease-in-out";  // Smooth scaling transition
    								self.element.style.transform = "scale(1.2)";
								},
								deactivate:(self)=>{
									self.element.style.transition = "transform 0.2s ease-in-out";  // Smooth scaling transition
									self.element.style.transform = "scale(1)";
								},
								onClick: ()=>{new StateManager().currentState.changeSubstate();},
							})
						]
					}),
				]
			})
		], color)
		this.div = this.overlay.element;
		this.enterButton = this.overlay.getElementById("enter-button");
		console.log("enter button: ", this.enterButton)
;	}

keyHandler(event){
	if (event.key === 'Enter') {
			event.preventDefault();
			return {change : "substate"};
	}
	return undefined;
}

enter(){
	// enterButton.element.style.color = "black";
}


exit(){
	// this.overlay.style.visibility = "hidden";
	// enterButton.element.style.color = "transparent";
}

animate(){
	this.enterButton.animate();
}
resize(){
	this.overlay.resize();
}
}

// const start = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize();}, "enter":enter, "exit":exit, "animate" : animate};
export { StartScreen};