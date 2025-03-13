
import { CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

const form1_div = document.createElement('div');
form1_div.className = 'label';
form1_div.style.backgroundColor = 'white';
form1_div.style.width = '300px';
form1_div.style.padding = '15px';
form1_div.style.border = '2px solid black';
form1_div.style.borderRadius = '10px';
form1_div.style.display = 'flex';
form1_div.style.flexDirection = 'column';
form1_div.style.justifyContent = 'center';
form1_div.style.alignItems = 'center';
form1_div.style.gap = '10px';
form1_div.style.visibility = "hidden";

const aliasLabel = document.createElement('label');
aliasLabel.textContent = 'Enter your alias:';
form1_div.appendChild(aliasLabel);

const aliasInput = document.createElement('input');
aliasInput.id = "aliasInput";
aliasInput.type = 'text';
aliasInput.autofocus = true;  // <-- Automatically focuses this input
aliasInput.style.width = '90%';
aliasInput.style.padding = '5px';
aliasInput.style.minWidth = '80%';
aliasInput.style.display = 'block';//ABSOLUTELY NECESSARY!
form1_div.appendChild(aliasInput);

const opponentLabel = document.createElement('label');
opponentLabel.textContent = "Enter your opponent's alias:";
form1_div.appendChild(opponentLabel);

const opponentInput = document.createElement('input');
opponentInput.id = 'oponentInput';
opponentInput.type = 'text';
opponentInput.style.width = '90%';
opponentInput.style.padding = '5px';
opponentInput.style.minWidth = '80%';
opponentInput.style.display = 'block';//ABSOLUTELY NECESSARY!
form1_div.appendChild(opponentInput);

document.body.appendChild(form1_div);  // Make sure this is added to the DOM!

// aliasInput.focus();

function keyHandler(event){
	console.log("reached rest keyhandler custom ft!");
    if (event.key === 'Enter') {
        if (document.activeElement === aliasInput) {
            event.preventDefault();
            opponentInput.focus();
        } else if (document.activeElement === opponentInput) {
            event.preventDefault();
			console.log("you: ", aliasInput.value, "oponent: ", opponentInput.value); // Submit form
			return {change : "substate"};
        }
    } else if (event.key === 'ArrowDown') {
        if (document.activeElement === aliasInput)
            opponentInput.focus();
    } else if (event.key === 'ArrowUp') {
        if (document.activeElement === opponentInput)
            aliasInput.focus();
    }
}

function enter(){
	aliasInput.focus();
	document.getElementById("aliasInput").value = ""; //should delete!
}

const form1 = {'div': form1_div, 'keyHandler': keyHandler, 'enter' : enter}
export { form1};