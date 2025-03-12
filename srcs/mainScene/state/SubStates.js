class SubStates{
	constructor(update, keyControls){
		this.div_content;
		this.div_style;
		this.html_div;
		this.game_div;
		this.active = false;
		this.keyControls = keyControls();
		this.update = update();

	}
	update(divs)
	{


	}
	is_active(){
		return this.is_active;
	}

}

export {SubStates}