import { StateManager } from '../../../core/stateManager/StateManager';
import { Overlay, FlexBox } from '../../../core/UIFactory/DivElements';
import { Text, Button } from '../../../core/UIFactory/Elements';

class StartScreen{
	constructor(color){
		this.overlay = new Overlay([
			new FlexBox({
				full: "true",
				dir: "column",
				children : [
					new FlexBox({
						flex: 1,
						//full: true,
						// dir: "column",
						children : [
							new Text({content: "START GAME", fontSize: 2})
						]
					}),
					new FlexBox({
						dir: "row",
						full: "width",
						// marginLeft: '90%',
						marginBottom : '0%',
						marginTop: '0%',
						crossAxis: "end",
						mainAxis: "end",
						// mainAxis: "start-flex",
						children : [
							new Button({
								content: "ENTER",
								id: "enter-button",
								activate: (self)=>{self.extensions.text.tempChangeSize(1.25)},
								deactivate:(self)=>{ self.extensions.text.revertSize()},
								onClick: ()=>{new StateManager().currentState.changeSubstate();},
							})
						]
					}),
				]
			})
		], color)
		this.div = this.overlay.element;
		this.enterButton = this.overlay.getElementById("enter-button");
		console.log("enter button: ", this.enterButton)
;	}

keyHandler(event){
	if (event.key === 'Enter') {
			event.preventDefault();
			return {change : "substate"};
	}
	return undefined;
}

enter(){
	// enterButton.element.style.color = "black";
}


exit(){
	// this.overlay.style.visibility = "hidden";
	// enterButton.element.style.color = "transparent";
}

animate(){
	this.enterButton.animate();
}
resize(){
	this.overlay.resize();
}
}

// const start = {'div': overlay.element, 'keyHandler': keyHandler,'resize' : ()=>{overlay.resize();}, "enter":enter, "exit":exit, "animate" : animate};
export { StartScreen};