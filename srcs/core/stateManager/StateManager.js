import * as THREE from 'three';

class StateManager {
    constructor(states = []) {
		if (StateManager.instance)
			return StateManager.instance;
        this.states = states;
		if (this.states.length > 0) this.changeState(0);
		this.forcedRedirect = false;
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
		window.addEventListener('popstate', (event) => {
			if (event.state)
				console.log("window changing state")
				this.changeState(event.state.num, false);
		  });
		StateManager.instance = this;
	}
    changeState(index = this.currentStateIndex + 1, shouldPushHistory = true) {
        if (this.currentStateIndex == index || index < 0)
			return;
		console.log("changing state to ", index);
		console.log("current index is ", this.currentStateIndex);
		if (this.currentState && this.currentState.exit() == "cancelled" && !this.forcedRedirect)
			return "cancelled";
		console.log("exited from current state");
		if (index >= this.states.length)
			index = 0;
        this.currentStateIndex = index;
        this.currentState = this.states[this.currentStateIndex];
		if (shouldPushHistory)
			window.history.pushState({ num : this.currentStateIndex }, '', window.location.href);
		this.setAllowedDirection();
		console.log("entering new state: ", this.currentStateIndex)
        this.currentState.enter();
    }
	setAllowedDirection(){
		if (this.currentStateIndex === 0)
			this.allowedDirection = 1;
		else
			this.allowedDirection = 0;
	}
    handleKeyPress(event) {
		const view = this.currentState?.handleKeyPress(event);
		if (view && view.change === "state")
		{
			console.log("click changing state?")
			this.changeState(view.index || undefined);
		}
    }
    resize() {
		this.states.forEach(state => {
		state.resize();
	});
}
	animate() { 
		this.states.forEach(state => {
			state.animate();
		});
	}
	isActive() { return this.currentState?.isActive(); }
	which() {console.log("state: ", this.currentStateIndex, this.currentState.name, "substate: ", this.currentState.currentSubstateIndex, this.currentState.currentSubstate?.name);}
}

export { StateManager }