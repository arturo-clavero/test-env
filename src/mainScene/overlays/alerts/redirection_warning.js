import { StateManager } from '../../../core/stateManager/StateManager';
import { State } from '../../../core/stateManager/States';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';
import { Socket } from '../../utils/Socket';
import { join } from '../divs/tour_join';
import { Alert, AlertManager } from './Alerts';
import { fadeout, doublePump } from '../../../core/UIFactory/effects';

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

let prev_title, prev_icon, favicon;
let interval_favicon, interval_display;
let length;
function create_redirection_alert(inputlength){
	length = inputlength;
	new AlertManager().add_alert(redirection_alert);
}

function enter(){
	const icons = ["/src/assets/icons/Empty.png", "/src/assets/icons/a5.png"];
    let favicon_index = 0;
	prev_title  = document.title;
	favicon = document.getElementById("dynamic-favicon");
	prev_icon = favicon.getAttribute("href");
	document.title = "Battle Begins!";
	document.getElementById("dynamic-favicon").href = "assets/icons/a5.png";
	interval_favicon = setInterval(() => {
		favicon_index = (favicon_index + 1) % icons.length;
		if (favicon)
			favicon.href = icons[favicon_index];
	  }, 500)

	  interval_display = setInterval(() => {
		  doublePump(redirection_alert.div);
		  doublePump(redirection_alert.div);

	  }, 5000);
}
function exit(){
	
}

function delete_redirection_alert(){
	new AlertManager().remove_latest_alert(redirection_alert.id);
	clearInterval(interval_display);
	clearInterval(interval_favicon);
	document.title = prev_title;
	favicon.href = prev_icon;
	new StateManager().changeState(3);
}

function fadeout_redirection_alert(length_in_s){
	fadeout(redirection_alert.div, length_in_s)
}

const redirection_alert = new Alert("redirection_alert", children, "urgent", 100, enter, exit, false);

export {create_redirection_alert, delete_redirection_alert, fadeout_redirection_alert}