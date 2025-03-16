
import { CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const form1_div = document.createElement('div');
form1_div.className = 'label';
form1_div.style.backgroundColor = 'transparent';
form1_div.style.width = '300px';
form1_div.style.height = '300px';
form1_div.style.boxSizing = 'border-box';
form1_div.style.padding = '0';
form1_div.style.border = 'none';

form1_div.style.visibility = "hidden";

const inner_div = document.createElement('div');
inner_div.style.height = '100%';
inner_div.style.width = '100%';
inner_div.style.display = 'flex';  // Flexbox to center and manage children
inner_div.style.flexDirection = 'column';  // Stack children vertically
inner_div.style.justifyContent = 'center';  // Center children vertically
inner_div.style.alignItems = 'center';  // Center children horizontally
form1_div.appendChild(inner_div);

const aliasLabel = document.createElement('label');
aliasLabel.textContent = 'Your alias:';
aliasLabel.style.marginBottom = '4%';
inner_div.appendChild(aliasLabel);

const aliasInput = document.createElement('input');
aliasInput.id = "aliasInput";
aliasInput.type = 'text';
aliasInput.autofocus = true;  // <-- Automatically focuses this input
aliasInput.style.marginBottom = '10%';
aliasInput.style.textAlign = 'center';
aliasInput.style.backgroundColor = 'transparent';
aliasInput.style.border = 'none';
aliasInput.style.outline = 'none';
inner_div.appendChild(aliasInput);

const opponentLabel = document.createElement('label');
opponentLabel.textContent = "Player 2 alias:";
opponentLabel.style.marginBottom = '4%';
inner_div.appendChild(opponentLabel);

const opponentInput = document.createElement('input');
opponentInput.id = 'oponentInput';
opponentInput.type = 'text';
// opponentInput.style.marginBottom = '5%';
opponentInput.style.textAlign = 'center';
opponentInput.style.backgroundColor = 'transparent';
opponentInput.style.border = 'none';
opponentInput.style.outline = 'none';
inner_div.appendChild(opponentInput);

const enterLabel = document.createElement('label');
enterLabel.textContent = "ENTER";
// enterLabel.style.marginBottom = '2%';
enterLabel.style.marginLeft= '95%';
enterLabel.style.visibility = "visible";
inner_div.appendChild(enterLabel);

document.body.appendChild(form1_div);
function keyHandler(event){
	console.log("reached rest keyhandler custom ft!");
    if (event.key === 'Enter') {
        if (document.activeElement != opponentInput) {
            event.preventDefault();
            opponentInput.focus();
        }
		else {
            event.preventDefault();
			console.log("you: ", aliasInput.value, "oponent: ", opponentInput.value);
			aliasInput.value = "";
			opponentInput.value = "";
			return {change : "substate"};
        }
    } else if (event.key === 'ArrowDown') {
        if (document.activeElement === aliasInput)
            opponentInput.focus();
    } else if (event.key === 'ArrowUp') {
        if (document.activeElement === opponentInput)
            aliasInput.focus();
			event.preventDefault();
    }
	else if (document.activeElement != opponentInput)
		aliasInput.focus()
	return undefined;
}
function resize(){
	const w = form1_div.offsetWidth;
	const h = form1_div.offsetHeight;

	console.log("w: ", w);
	console.log("h: ", h);
	aliasInput.style.width = `${w * 0.9}px`;
  	opponentInput.style.width = `${w * 0.9}px`;
  	aliasInput.style.height = `${h * 0.1}px`;
  	opponentInput.style.height = `${h * 0.1}px`;
  	const p = 0.08;
	  console.log("w: ", w);
	  console.log("2h: ", h);
 	const fontSize = Math.min( w  * p, h * p);
	console.log("fontsize: ", fontSize);
	form1_div.style.fontSize = `${fontSize}px`;
	aliasInput.style.fontSize = `${fontSize}px`;
	opponentInput.style.fontSize = `${fontSize}px`;
}

function enter(){
	aliasInput.focus();
	console.log("form enter");
	aliasInput.value = "";
}

function animate(){
	const r =  Math.random() * (10);
	if (r > 9)
	{
		if (enterLabel.style.visibility === "visible")
			enterLabel.style.visibility = "hidden";
		else
			enterLabel.style.visibility = "visible";
	}
}

const form1 = {'div': form1_div, 'keyHandler': keyHandler,'resize' : resize, "enter":enter, "animate": animate}
export { form1};