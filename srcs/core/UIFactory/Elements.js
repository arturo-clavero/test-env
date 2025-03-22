import { BaseNonDivElement } from "./Base";
class Text extends BaseNonDivElement{
	constructor({id = "text", content, flex = 0, fontSize = 1, w, h})
	{
		super('label', id, flex, fontSize, w, h);
		this.element.textContent = content;
	}
}

class Input extends BaseNonDivElement{
	constructor({id = "input", autofocus = "false", flex = 0, fontSize = 1, w = 0.9, h = 0.1})
	{
		super('input', id, flex, fontSize, w, h);
		this.element.type = 'text';
		this.element.autofocus = autofocus;
		this.element.style.textAlign = 'center';
		this.element.style.backgroundColor = 'transparent';
		this.element.style.border = 'none';
		this.element.style.outline = 'none';
	}
}

class Button extends BaseNonDivElement{
	constructor({id = "button", content, onClick, flex = 0, fontSize = 1, w, h, activate, deactivate})
	{
		super('label', id, flex, fontSize, w, h);
		this.isSelected = false;
		this.activate = ()=>{
			if (this.isSelected == false)
			{
				console.log('activate');
				activate(this);
				this.isSelected = true;
			}
		}
		this.deactivate = ()=>{
			if (this.isSelected == true)
			{
				deactivate(this);
				this.isSelected = false;
			}
		}
		// this.element.style.pointerEvents = 'all';
		this.element.textContent = content;
		this.onClick = onClick;
		// this.element.style.visibility = "hidden";
		this.element.addEventListener('mouseover', ()=>{this.activate()});
		this.element.addEventListener('mouseout', ()=> { this.deactivate()});
		this.element.addEventListener('click', ()=>{ this.onClick();}); 
	}
	animate(){
		const r =  Math.random() * (100);
		if (r > 90)
		{
			if (this.element.style.color === "transparent") this.element.style.color = "black";
			else if (r > 95) this.element.style.color = "transparent";
		}
	}
}

export {Text, Input, Button}