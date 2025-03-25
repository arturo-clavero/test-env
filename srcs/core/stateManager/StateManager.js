import * as THREE from 'three';

class StateManager {
    constructor(states = []) {
		if (StateManager.instance)
			return StateManager.instance;
        this.states = states;
		if (this.states.length > 0) this.changeState(0);
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
		window.addEventListener('popstate', (event) => {
			if (event.state)
				this.changeState(event.state.num, false);
		  });
		StateManager.instance = this;
	}
	addState(states){
		if (!(Array.isArray(states)))
			this.states.push(states)
		else
		{
			for (let i = 0; i < states.length; i++)
				this.states.push(states[i]);
		}
		if (! this.currentState)
			this.changeState(0);
	}
    changeState(index = this.currentStateIndex + 1, shouldPushHistory = true) {
        if (this.currentStateIndex == index || index < 0)
			return;
		if (this.currentState) this.currentState.exit();
		if (index >= this.states.length)
			index = 0;
        this.currentStateIndex = index;
        this.currentState = this.states[this.currentStateIndex];
		if (shouldPushHistory)
			window.history.pushState({ num : this.currentStateIndex }, '', window.location.href);
		this.setAllowedDirection();
        this.currentState.enter();
    }
	setAllowedDirection(){
		if (this.currentStateIndex === 0)
			this.allowedDirection = 1;
		// else if (this.currentStateIndex === this.states.length - 1)
		// 	this.allowedDirection = -1;
		else
			this.allowedDirection = 0;
	}
    handleKeyPress(event) {
		const view = this.currentState?.handleKeyPress(event);
		if (view && view.change === "state")
			this.changeState(view.index || undefined);
    }
    resize() {this.currentState?.resize(); }
	animate() { 
		this.states.forEach(state => {
			state.animate();
		});
	 }
	isActive() { return this.currentState?.isActive(); }
	which() {console.log("state: ", this.currentStateIndex, this.currentState.name, "substate: ", this.currentState.currentSubstateIndex, this.currentState.currentSubstate?.name);}
}

export { StateManager }