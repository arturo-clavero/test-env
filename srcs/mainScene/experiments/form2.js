
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
				new FlexBox({
					dir: "column",
					mainAxis: "space-evenly",
					children: [
							new Text({content: "Player 2 Alias"}),
							new Input({id: "oponent-alias", fontSize: 0.75}),
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
					activate: ()=>{this.extensions.text.tempChangeSize(1.25)} ,
					deactivate: ()=>{this.extensions.text.revertSize();},
					onClick: ()=>{new StateManager().currentState.changeSubstate();}
				}),
			]
		})
]);

const userInput = overlay.getElementById("user-alias");
const oponentInput = overlay.getElementById("oponent-alias");
const enterButton = overlay.getElementById("enter-button");

console.log("\n\n\nUSER INPUT!", userInput.element);


function keyHandler(event){
    if (event.key === 'Enter') {
        if (document.activeElement != oponentInput.element) {
            event.preventDefault();
            oponentInput.element.focus();
        }
		else {
            event.preventDefault();

			return {change : "substate"};
        }
    } else if (event.key === 'ArrowDown') {
        if (document.activeElement === userInput.element)
            oponentInput.element.focus();
    } else if (event.key === 'ArrowUp') {
        if (document.activeElement === oponentInput.element)
            userInput.element.focus();
			event.preventDefault();
    }
	else if (document.activeElement != oponentInput.element)
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
	console.log("you: ", userInput.element.value, "oponent: ", oponentInput.element.value);
	userInput.element.value = "";
	oponentInput.element.value = "";
	enterButton.element.style.visibility = "hidden";
}

function animate(){
	enterButton.animate();
}

const form2 = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize()}, "enter":enter, "exit":exit, "animate": animate}
export { form2};