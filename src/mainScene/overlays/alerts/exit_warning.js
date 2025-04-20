import { StateManager } from '../../../core/stateManager/StateManager';
import { State } from '../../../core/stateManager/States';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';
import { Socket } from '../../utils/Socket';
import { join } from '../divs/tour_join';
import { Alert, AlertManager } from './Alerts';
import { fadeout } from '../../../core/UIFactory/effects';

const children = [
	new FlexBox({
		dir: "column",
		mainAxis: "spaced-out",
		children:
		[
			new Text({
				content: "ARE YOU SURE ?",
				fontSize: 1,
				marginBot: "4%",
			}),
			new Text({
				content: "You will loose all progress",
				fontSize: 0.55,
				marginBot: "4%",
			}),
			new FlexBox({
				dir: "row",
				width: "80%",
				mainAxis: "space-between",
				children: [
					new Button({
						id : "button-stay",
						fontSize: 0.85,
						content: "STAY",
						onClick: ()=>{
							console.log("clicked stay")
							new AlertManager().remove_latest_alert();
						},
					}),
					new Button({
						id : "button-exit",
						fontSize: 0.85,
						content: "EXIT",
						onClick: ()=>{
							console.log("clicked exit")
							new AlertManager().remove_latest_alert();
							can_exit = true;
							console.log("exiting request");
							new StateManager().changeState(new StateManager().scheduledStateIndex)
						},
					}),
				]
			})
		]

	})
	
]
let can_exit = false;
function create_exit_alert(){
		console.log("create exit alert!");
		console.log("can exit is: ", can_exit)
		if (can_exit)
		{
			console.log("can exit");
			can_exit = false;
			console.log("can exit is: ", can_exit)
			return ("continue");
		}
		if (new AlertManager().add_alert(exit_alert) == "overrun")
		{
			console.log("created alert");
			console.log("can exit is: ", can_exit)
			return ("continue");
		}
		console.log("can exit is: ", can_exit)
		console.log("can not continue");
		return ("cancelled")
}

function enter(self) {
	setTimeout(() => {
		new AlertManager().remove_latest_alert(self);
		fadeout(exit_alert.div)
	}, 5000);
	
	setTimeout(() => {
			console.log("remove latest alert timeout")
			new AlertManager().remove_latest_alert(self);
		}, 10500);
}

function exit(){
	
}

const exit_alert = new Alert("exit_alert", children, "warning", 0, enter, exit, false);

export {create_exit_alert}