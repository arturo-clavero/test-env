
import { StateManager } from '../state/StateManager';
import { Overlay, FlexBox, Text, Input, Button} from './Element';
const overlay = new Overlay([
	new FlexBox({
			dir: "column", 
			children: [
				new FlexBox({
					dir: "column",
					mainAxis: "space-evenly",
					children: [
							new Text({content: "Your Alias"}),
							new Input({id: "user-alias", autofocus: true, fontSize: 0.75}),
					],
					full: true,
				}),
			],
			flex: 1,
			full: true,
		}),
	new FlexBox({
			dir: "row", 
			mainAxis:"end", 
			children: [
				new Button({
					id: "enter-button", 
					content: "ENTER", 
					activate: (self)=>{console.log(self); self.extensions.text.tempChangeSize(1.25)},
					deactivate:(self)=>{ self.extensions.text.revertSize()},
					onClick: ()=>{new StateManager().currentState.changeSubstate();},
				}),
			]
		})
]);

const userInput = overlay.getElementById("user-alias");
const enterButton = overlay.getElementById("enter-button");

console.log("\n\n\nUSER INPUT!", userInput.element);


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
	userInput.element.focus();
	userInput.element.value = "";
	enterButton.element.style.visibility = "visible";
}

function exit(){
	console.log("EXITING!!!");
	console.log("you: ", userInput.element.value);
	userInput.element.value = "";
	console.log("hello?");
	enterButton.element.style.visibility = "hidden";
}

function animate(){
	console.log("form1 animate...");
	enterButton.animate();
}

const form1 = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit, "animate": animate}
export { form1};