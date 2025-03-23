import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';

class End{
	constructor(){
		this.overlay = new Overlay([
			new FlexBox({
				flex: 1,
				dir: "column",
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
						fontSize: 0.55,
						content: "EXIT",
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
						content: "RESTART",
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
		this.keyHandlerswitchButtons = new SwitchButtons(this.overlay.getElementsOfType(Button));
	}
	keyHandler(event){
		this.switchButtons.keyHandler(event);
	}
	enter(){

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