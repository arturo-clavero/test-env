import { StateManager } from '../state/StateManager';
import { Overlay, FlexBox, Text, Button, SwitchButtons} from './Element';

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
				activate: (self)=>{console.log(self); self.extensions.text.tempChangeSize(1.25)},
				deactivate:(self)=>{ self.extensions.text.revertSize()},
				onClick : ()=> {new StateManager().changeState(0);}
			}),
			new Button({
				content: "RESTART",
				activate: (self)=>{console.log(self); self.extensions.text.tempChangeSize(1.25)},
				deactivate:(self)=>{ self.extensions.text.revertSize()},
				onClick : ()=> {new StateManager().currentState.changeSubstate(1);}
			})
		]
	}),
])

const switchButtons = new SwitchButtons([overlay.getElementsOfType(Button)]);
function keyHandler(event){
	switchButtons.keyHandler(event);
}

function enter(){
	console.log("entering final screen ...");
}

function exit(){
}

const end = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit}
export { end};