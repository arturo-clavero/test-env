
class SwitchButtons {
	constructor(buttons,  nextKey="ArrowRight", prevKey="ArrowLeft"){
		this.buttons = buttons;
		//console.log("buttons L");
		//console.log(buttons);
		//this.switch_active(buttons[0], 0);
		this.activeIndex = 0;
		this.nextKey = nextKey;
		this.prevKey = prevKey;
	}
	switch_active(nextButton, index){
		
		if (index == undefined){
			this.buttons.forEach((button, i) => {
				if (button.id == buttonNext.id && button.content == buttonNext.content)
					index = i;
			})
			this.activeIndex = index;
		}
		// console.log("prev button cntent " , this.activeButton.element.textContent);
		// console.log("prev button " , this.activeButton);
		console.log("curr button cntent " , nextButton.element.textContent);
		console.log("curr button " , nextButton);
		console.log("curr index: ", index);
		this.activeButton?.deactivate();
		this.activeButton = nextButton;
		this.activeButton.activate();
		console.log("curr after button cntent " , nextButton.element.textContent);
		console.log("curr after button " , nextButton);
		console.log("curr after index: ", index);

	}
	switch(dir = "next"){
		if (dir == "next")
		{
			this.activeIndex += 1;
			if (this.activeIndex >= this.buttons.length)
				this.activeIndex = this.buttons.length - 1;
		}
		else if (dir == "prev")
		{
			this.activeIndex -= 1;
			if (this.activeIndex < 0)
				this.activeIndex = 0;
		}
		this.switch_active(this.buttons[this.activeIndex], this.activeIndex);
	}
	keyHandler(event){
		if (event.key === 'Enter') {
				event.preventDefault();
				console.log(this.activeButton);
				this.activeButton.onClick();
		}
		else if (event.key == this.nextKey)
			this.switch("next");
		else if (event.key == this.prevKey)
			this.switch("prev");
		else
			console.log("key: ", event.key);
	}
}

export {SwitchButtons}