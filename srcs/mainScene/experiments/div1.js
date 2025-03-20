
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
					onClick: ()=>{new StateManager().currentState.changeSubstate();}
				}),
			]
		})
]);

const userInput = overlay.getElementById("user-alias");
const oponentInput = overlay.getElementById("oponent-alias");
const enterButton = overlay.getElementById("enter-button");

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

function resize()
{
	const w = overlay.element.offsetWidth;
	const h = overlay.element.offsetHeight;

	// overlay.getElementsWith("size").forEach(element => { element.extensions.size.updateSize(w, h);});
	userInput.element.style.width = `${w * 0.9}px`;
	oponentInput.element.style.width = `${w * 0.9}px`;
  	userInput.element.style.height = `${h * 0.1}px`;
  	oponentInput.element.style.height = `${h * 0.1}px`;
	const p = 0.1;
	const fontSize = Math.min( w  * p, h * p);
	overlay.getElementsWith("text").forEach(element => { element.extensions.text.updateSize(fontSize);});
}

function enter(){
	userInput.element.focus();
	userInput.element.value = "";
	enterButton.element.style.visibility = "visible";
}

function exit(){
	console.log("EXITING!!!");
	console.log("you: ", aliasInput.element.value, "oponent: ", oponentInput.element.value);
	userInput.element.value = "";
	oponentInput.element.value = "";
	enterButton.element.style.visibility = "hidden";
}

function animate(){
	enterButton.animate();
}

const form1 = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : resize, "enter":enter, "exit":exit, "animate": animate}
export { form1};