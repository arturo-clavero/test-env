
import { StateManager } from '../state/StateManager';
import { Overlay, FlexBox, Text, Input, Button} from './Element';

const overlay = new Overlay();

const aliasInput = new Input(true);
const oponentInput = new Input();
const enterButton = new Button("ENTER", ()=>{
	console.log('HELLO!?');
	const stateManager = new StateManager();
	stateManager.currentState.changeSubstate();
});

overlay.add(
	new FlexBox({
		dir: "column", 
		children: [
			new FlexBox({
				dir: "column",
				mainAxis: "space-evenly",
				children: [
					new Text("Your Alias"),
					aliasInput,
				],
				full: true,
			}),
			new FlexBox({
				dir: "column",
				mainAxis: "space-evenly",
				children: [
					new Text("Player 2 Alias"),
					oponentInput,
				],
				full: true,
			}),
		],
		flex: 1,
		full: true,
	})
);

overlay.add(
	new FlexBox({
		dir: "row", 
		mainAxis:"end", 
		children: [
			enterButton
		]
	})
);

enterButton.element.addEventListener('click', () => {
	console.log('Button clicked!');
  });

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
        if (document.activeElement === aliasInput.element)
            oponentInput.element.focus();
    } else if (event.key === 'ArrowUp') {
        if (document.activeElement === oponentInput.element)
            aliasInput.element.focus();
			event.preventDefault();
    }
	else if (document.activeElement != oponentInput.element)
		aliasInput.element.focus()
	return undefined;
}

function resize(){
	const w = overlay.element.offsetWidth;
	const h = overlay.element.offsetHeight;
	aliasInput.element.style.width = `${w * 0.9}px`;
	oponentInput.element.style.width = `${w * 0.9}px`;
  	aliasInput.element.style.height = `${h * 0.1}px`;
  	oponentInput.element.style.height = `${h * 0.1}px`;
  	const p = 0.1;
 	const fontSize = Math.min( w  * p, h * p);
	overlay.element.style.fontSize = `${fontSize}px`;
	aliasInput.element.style.fontSize = `${fontSize}px`;
	oponentInput.element.style.fontSize = `${fontSize}px`;
}

function enter(){
	aliasInput.element.focus();
	aliasInput.element.value = "";
}

function exit(){
	console.log("you: ", aliasInput.element.value, "oponent: ", oponentInput.element.value);
	aliasInput.element.value = "";
	oponentInput.element.value = "";
	enterButton.style.visibility = "hidden";
}

function animate(){
	const r =  Math.random() * (10);
	if (r > 9)
	{
		if (enterButton.element.style.visibility === "visible")
			enterButton.element.style.visibility = "hidden";
		else
			enterButton.element.style.visibility = "visible";
	}
}

const form1 = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : resize, "enter":enter, "exit":exit, "animate": animate}
export { form1};