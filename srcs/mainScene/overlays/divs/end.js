import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';

class End{
	constructor(color="white"){
		this.overlay = new Overlay([
			new FlexBox({
				flex: 1,
				//dir: "column",
				color: color,
				fontSize: 2,

				children : [
					new Text({content: "GAME OVER"})
				]
			}),
			new FlexBox({
				dir: "row",
				width: "100%",
				mainAxis: "space-around",
				children : [
					new Button({
						color: color,
						fontSize: 0.55,
						content: "EXIT",
						color: color,
						activate: (self)=>{
							self.element.style.transition = "transform 0.1s ease-in-out";
							self.element.style.transform = "scale(1.4)";
						},
						deactivate:(self)=>{
							self.element.style.transition = "transform 0.1s ease-in-out";
							self.element.style.transform = "scale(1)";
						},
						onClick : ()=> {new StateManager().changeState(0);}
					}),
					new Button({
						fontSize: 0.55,
						color: color,
						content: "RESTART",
						color: color,
						activate: (self)=>{
							self.element.style.transition = "transform 0.1s ease-in-out";
							self.element.style.transform = "scale(1.4)";
						},
						deactivate:(self)=>{
							self.element.style.transition = "transform 0.1s ease-in-out";
							self.element.style.transform = "scale(1)";
						},
						onClick : ()=> {new StateManager().currentState.changeSubstate(1);}
					})
				]
			}),
		]);
		
		this.div = this.overlay.element;
		this.div.style.color = color;

		this.keyHandlerswitchButtons = new SwitchButtons(this.overlay.getElementsOfType(Button));
	}
	keyHandler(event){
		this.keyHandlerswitchButtons.keyHandler(event);
	}
	enter(){
		this.div.style.visibility = "visible";
		// this.enterButton.element.style.color = this.div.style.color;

	}
	exit(){

	}
	resize(){
		this.overlay.resize();
	}
	animate(){

	}
	
}


// function enter(){
// 	// switchButtons.switch("next");
// 	// switchButtons.buttons[0].activate();
// 	// switchButtons.activeIndex = 0;
// 	// switchButtons.activeButton = switchButtons.buttons[0];
// 	// switchButtons.activeButton.isSelected = true;
// 	// switchButtons.activeButton.activate();
// 	// switchButtons.switch("prev");
// 	// switchButtons.buttons[0].extensions.text.tempChangeSize(1.25);

// }
// function exit(){
// }

// const end = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit}
export { End };