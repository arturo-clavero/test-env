import { StateManager } from '../state/StateManager';
import { State } from '../state/States';
import { Overlay, FlexBox, Text, Input, Button} from './Element';

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
				onClick : ()=> {
					new StateManager.changeState(0);
				}
			}),
			new Button({
				content: "RESTART",
				onClick : ()=> {
					new StateManager.currentState.changeSubState(1);
				}
			})
		]
	}),
])

function keyHandler(event){
	if (event.key === 'Enter') {
			event.preventDefault();
			return {change : "substate"};
	}
	else if (document.activeElement != userInput.element)
		userInput.element.focus()
	return undefined;
}

function enter(){
	console.log("entering final screen ...");
}

function exit(){
}

const end = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit}
export { end};