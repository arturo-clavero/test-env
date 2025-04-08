import { StateManager } from '../../../core/stateManager/StateManager';
import { State } from '../../../core/stateManager/States';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';
import { SwitchButtons} from '../../../core/UIFactory/SwitchButtons';
import { Socket } from '../../utils/Socket';
import { join } from '../divs/tour_join';
import { Alert, AlertManager } from './Alerts';
const children = [
	new Text({
		content: "ALERT!",
		fontSize: 1,
	}),
	new Text({
		content: "Join tournament within one minute, or loose your place!",
	}),
	new Button({
		content: "JOIN",
		onClick: ()=>{
			new StateManager().forcedRedirect = true;
			new StateManager().changeState(3);
			new StateManager().currentState.changeSubState(8);
			new StateManager().forcedRedirect = false;
			new Socket().send({
				"channel" : "tournament",
				"action" : "confirm participation",
			})
			new AlertManager().remove_latest_alert(join_alert);
		}
	})
]

function create_join_alert(){
	let stateManager = new StateManager();
	if (stateManager.currentStateIndex == 3 
		&& stateManager.currentState.currentSubstateIndex == 8)
		{
			new Socket().send({
				"channel" : "tournament",
				"action" : "confirm participation",
			})
		}
	else{
		new AlertManager().add_alert(join_alert);
	}
}

function enter(){
	setTimeout(() => {
			new AlertManager().remove_latest_alert(join_alert);
		}, 60000);
}
function exit(){

}

const join_alert = new Alert(children, "urgent", 100, enter, exit, false);

export {create_join_alert}