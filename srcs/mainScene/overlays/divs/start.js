import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';


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
		// marginLeft: '90%',
		marginBottom : '0%',
		marginTop: '0%',
		crossAxis: "end",
		mainAxis: "end",
		// mainAxis: "start-flex",
		children : [
			new Button({
				content: "ENTER",
				id: "enter-button",
				activate: (self)=>{self.extensions.text.tempChangeSize(1.25)},
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
	enterButton.element.style.color = "black";
}


function exit(){
	enterButton.element.style.color = "black";
}

function animate(){
	enterButton.animate();
}

const start = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize();}, "enter":enter, "exit":exit, "animate" : animate};
export { start};