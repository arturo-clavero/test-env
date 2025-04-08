import { StateManager } from "../../../core/stateManager/StateManager";
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button, Input } from '../../../core/UIFactory/Elements';
import { Socket } from '../../utils/Socket'

const container = new Overlay([
	new FlexBox({
		dir: "column",
		mainAxis: "space-around",
		flex: 1,
		children: [
			new FlexBox({
				dir: "column",
				children: [
					new Text({
						id: "title",
						fontsize: 1
					}),
					new Text({
						id: "subtitle",
						fontSize: 0.85,
					})
				],
			}),
			new FlexBox({
				id : "matches"
			})
			],
		}),
])
function getAlias(){
	return "alias"
}

function organize_players_array(array){
	if (array.length % 2 == 1)
		array.push("")
	const index_user = array.indexOf(getAlias());
	const index_oponent = index_user % 2 == 0 ? index_user + 1 : index_user - 1;
	const elementsToMove = [array[index_user], array[index_oponent]];
	const i1 = index_user < index_oponent ? index_user : index_oponent;
	array.splice(i1, 2);
	array.unshift(...elementsToMove); 
	return array;
}
function dynamic_content(data){
	container.getElementById("title").element.textContent=`Round ${data["current round"]}/${data["max rounds"]}`;
	container.getElementById("subtitle").element.textContent=`${data["players"].length} players`;
	let new_matches = createTextGrid(organize_players_array(data["players"]));
	container.getElementById("matches").element.replaceWith(new_matches.element);
}

function getStringMatch(i, players){
	let player1 = players[i];
	let player2 = players[i + 1];
	let color = player2 == "" ? "green" : "white";
	if (player2 == "") player2 = "skip round";
	let string = new Text({
		content: `${player1} vs ${player2}`,
		fontSize: 0.5,
		color: color,
	})
	return string;
}
function createTextGrid(players) {
	const rows = [];
	let count = players.length;
		for (let i = 0; i < count; i += 4) {
			if (i + 2 == count && (players.length / 2) % 2 == 1)
			{
				rows.push(new FlexBox({
					mainAxis: "center",
					children: [
						getStringMatch(i, players),
					]
				}));
			} 
			else 
			{
				rows.push(new FlexBox({
					mainAxis: "space-around",
					children: [
						getStringMatch(i, players),
						getStringMatch(i + 2, players),
					]
				}));
			}
		}
		return new FlexBox({
			dir: "column",
			mainAxis: "center",
			scrollable: "true",
			children: rows
		});
	}
		

function show_buttons(){
	container.getElementById("button").element.style.visibility = "visible";
}

function hide_buttons(){
	container.getElementById("button").element.style.visibility = "hidden";
}

function show_div(){
	container.element.style.visibility = "visible";
}

function hide_div(){
	container.element.style.visibility = "hidden";
	hide_buttons();
}



const matchmake = {
	"div" : container.element,
	"show-buttons" : show_buttons,
	"hide-buttons" : hide_buttons,
	"show-div" : show_div,
	"hide-div" : hide_div,
	"resize": ()=>{container.resize()},
	"dynamic-content": dynamic_content,
}

export {matchmake}
