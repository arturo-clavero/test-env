import { StateManager } from '../state/StateManager';
import { State } from '../state/States';
import { Overlay, FlexBox, Text, Input, Button} from './Element';

const overlay = new Overlay([
	new FlexBox({
		flex: 1,
		full: true,
		// dir: "column",
		children : [
			new Text({content: "START GAME"})
		]
	}),
	new FlexBox({
		dir: "row",
		marginLeft: '90%',
		marginBottom : '5%',
		marginTop: '0%',
		//mainAxis: "start-flex",
		children : [
			new Button({
				content: "ENTER",
				id: "enter-button",
				activate: (self)=>{console.log(self); self.extensions.text.tempChangeSize(1.25)},
				deactivate:(self)=>{ self.extensions.text.revertSize()},
				onClick: ()=>{new StateManager().currentState.changeSubstate();},
			})
		]
	}),
])

const enterButton = overlay.getElementById("enter-button");

function keyHandler(event){
	if (event.key === 'Enter') {
			event.preventDefault();
			return {change : "substate"};
	}
	return undefined;
}

function enter(){
	console.log("STARTING START SCREEN!");
}

function exit(){
}

function animate(){
	enterButton.animate();
}

overlay.element.style.visibility = "visible";

const start = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize();}, "enter":enter, "exit":exit, "animate" : animate};
export { start};