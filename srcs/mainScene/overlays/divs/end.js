import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';

const overlay = new Overlay([
	new FlexBox({
		flex: 1,
		full: 1,
		dir: "column",
		children : [
			new Text({content: "GAME OVER"})
		]
	}),
	new FlexBox({
		dir: "row",
		mainAxis: "space-around",
		children : [
			new Button({
				content: "EXIT",
				activate: (self)=>{self.extensions.text.tempChangeSize(1.25)},
				deactivate:(self)=>{ self.extensions.text.revertSize()},
				onClick : ()=> {new StateManager().changeState(0);}
			}),
			new Button({
				content: "RESTART",
				activate: (self)=>{self.extensions.text.tempChangeSize(1.25)},
				deactivate:(self)=>{ self.extensions.text.revertSize()},
				onClick : ()=> {new StateManager().currentState.changeSubstate(1);}
			})
		]
	}),
])

const switchButtons = new SwitchButtons(overlay.getElementsOfType(Button));
function keyHandler(event){
	switchButtons.keyHandler(event);
}

function enter(){
	// switchButtons.switch("next");
	// switchButtons.buttons[0].activate();
	// switchButtons.activeIndex = 0;
	// switchButtons.activeButton = switchButtons.buttons[0];
	// switchButtons.activeButton.isSelected = true;
	// switchButtons.activeButton.activate();
	// switchButtons.switch("prev");
	// switchButtons.buttons[0].extensions.text.tempChangeSize(1.25);

}
function exit(){
}

const end = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit}
export { end};