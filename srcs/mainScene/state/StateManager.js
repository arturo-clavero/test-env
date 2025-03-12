class StateManager{
	constructor(){
		if (StateManager.instance)
			return StateManager.instance;
		this.states = [];
		this.curr_state_index = 0;
		window.addEventListener('onKeyPress', (event) => {this.onKeyPress(event)});
		StateManager.instance = this;
	}
	curr_state(){ 
		return (this.states[this.curr_state_index])
	}
	update_state()
	{
		this.curr_state_index = this.curr_state_index + 1;
		if (this.curr_state_index >= this.states.length)
			this.curr_state_index = 0;
		this.curr_state().move_camera();
		this.curr_state().init();
	}
	onKeyPress(event){
		if (this.curr_state().curr_substate().keyControls(event) == "next")
			this.update_state();
	}
}

export { StateManager }