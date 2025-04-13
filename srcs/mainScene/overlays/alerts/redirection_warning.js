import { StateManager } from '../../../core/stateManager/StateManager';
import { State } from '../../../core/stateManager/States';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';
import { Socket } from '../../utils/Socket';
import { join } from '../divs/tour_join';
import { Alert, AlertManager } from './Alerts';

const children = [
	new FlexBox({
		dir: "column",
		mainAxis: "spaced-out",
		children:
		[
			new Text({
				content: "TOURNAMENT STARTS SOON",
				fontSize: 0.75,
				marginBot: "8%",

			}),
			new Text({
				content: "You will be redirected",
				fontSize: 0.55,
			}),
		]
	})
	
]
let interval;
let length;
function create_redirection_alert(inputlength){
	length = inputlength;
	new AlertManager().add_alert(redirection_alert);
}

function enter(){
	const icons = ["assets/icons/Empty.png", "assets/icons/a5.png"];
    let index = 0;
	document.title = "Battle Begins!";
	document.getElementById("dynamic-favicon").href = "assets/icons/a5.png";
	interval = setInterval(() => {
		const link = document.getElementById("dynamic-favicon");
		index = (index + 1) % icons.length;
		link.href = icons[index];
	  }, 500)
	setTimeout(() => {
			document.title = "ArcadeHUB";
			new AlertManager().remove_latest_alert("redirection_alert");
			clearInterval(interval);
			document.getElementById("dynamic-favicon").href = "assets/icons/a2.png";
			new StateManager().changeState(3);
	}, length);
}
function exit(){
	
}

const redirection_alert = new Alert("redirection_alert", children, "urgent", 100, enter, exit, false);

export {create_redirection_alert}