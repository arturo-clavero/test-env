
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

const aliasLabel = document.createElement('label');
aliasLabel.textContent = 'Enter your alias:';
const aliasInput = document.createElement('input');
aliasInput.type = 'text';
aliasInput.autofocus = true;  // <-- Automatically focuses this input
aliasInput.style.width = '90%';
aliasInput.style.padding = '5px';
aliasInput.style.minWidth = '80%';
aliasInput.style.display = 'block';//ABSOLUTELY NECESSARY!



const opponentLabel = document.createElement('label');
opponentLabel.textContent = "Enter your opponent's alias:";
const opponentInput = document.createElement('input');
opponentInput.type = 'text';
opponentInput.style.width = '90%';
opponentInput.style.padding = '5px';
opponentInput.style.minWidth = '80%';
opponentInput.style.display = 'block';//ABSOLUTELY NECESSARY!

const button = document.createElement('button');
button.textContent = 'Next';
button.style.cursor = 'pointer';
button.style.padding = '8px 12px';
button.style.fontSize = '14px';

form1_div.appendChild(aliasLabel);
form1_div.appendChild(aliasInput);
form1_div.appendChild(opponentLabel);
form1_div.appendChild(opponentInput);
form1_div.appendChild(button);


document.body.appendChild(form1_div);  // Make sure this is added to the DOM!

// aliasInput.focus();

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (document.activeElement === aliasInput) {
            event.preventDefault();
            opponentInput.focus(); // Move to opponent input
        } else if (document.activeElement === opponentInput) {
            event.preventDefault();
            submitForm(); // Submit form
        }
    } else if (event.key === 'ArrowDown') {
        if (document.activeElement === aliasInput) {
            opponentInput.focus();
        } else if (document.activeElement === opponentInput) {
            button.focus();
        }
    } else if (event.key === 'ArrowUp') {
        if (document.activeElement === opponentInput) {
            aliasInput.focus();
        } else if (document.activeElement === button) {
            opponentInput.focus();
        }
    }
});
button.addEventListener('pointerdown', (event) => {
	console.log("x");
    submitForm();
	event.stopPropagation();
	event.preventDefault();

});

function submitForm(){
	const alias = aliasInput.value;
    const opponent = opponentInput.value;
    alert(`Alias: ${alias}\nOpponent: ${opponent}`);
}

const form1_2d = new CSS2DObject(form1_div);
form1_2d.position.set(0, 0, 0);

function updateFormSize(width, height) {
    form1_div.style.width = `${width}px`;
    form1_div.style.height = `${height}px`;
}

export { form1_2d , updateFormSize};