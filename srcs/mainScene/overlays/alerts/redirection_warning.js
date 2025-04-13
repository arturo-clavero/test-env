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
				content: "ALERT!",
				fontSize: 1,
				marginBot: "4%",
			}),
			new Text({
				content: "Join tournament within one minute,",
				fontSize: 0.75,
				marginBot: "2%",

			}),
			new Text({
				content: "or loose your place!",
				fontSize: 0.75,
				marginBot: "4%",
			}),
			new Button({
				fontSize: 0.85,
				content: "JOIN",
				onClick: ()=>{
					new StateManager().forcedRedirect = true;
					new StateManager().changeState(3);
					new StateManager().forcedRedirect = false;
					new AlertManager().remove_latest_alert("join_alert");
					new Socket().send({
						"channel" : "tournament",
						"action" : "confirm participation",
						"tour_id" : get_tour_id()
					})
				},
			})
			
		]

	})
	
]
let tour_id = 0

function get_tour_id(){
	return tour_id;
}
function create_join_alert(input_tour_id){
	// let stateManager = new StateManager();
	// if (stateManager.currentStateIndex == 3 
	// 	&& stateManager.currentState.currentSubstateIndex == 5)
	// 	{
	// 		new Socket().send({
	// 			"channel" : "tournament",
	// 			"action" : "confirm participation",
	// 		})
	// 	}
	// else{
		tour_id = input_tour_id
		new AlertManager().add_alert(join_alert);
	// }
}

function enter(){
	setTimeout(() => {
			new AlertManager().remove_latest_alert("join_alert");
		}, 10000);//60s
}
function exit(){

}

const join_alert = new Alert("join_alert", children, "urgent", 100, enter, exit, false);

export {create_join_alert}