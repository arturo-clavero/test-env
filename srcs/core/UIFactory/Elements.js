import { BaseNonDivElement } from "./Base";
class Text extends BaseNonDivElement{
	constructor({id = "text", content, flex = 0, fontSize = 1, w, h})
	{
		super('label', id, flex, fontSize, w, h);
		this.element.textContent = content;
		this.element.style.textAlign = "center";
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
	constructor({id = "button", content, color, onClick, flex = 0, fontSize = 1, w, h, activate = ()=>{}, deactivate = ()=>{}})
	{
		super('label', id, flex, fontSize, w, h);
		this.isSelected = false;
		this.activate = ()=>{
			if (this.isSelected == false)
			{
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
		this.element.textContent = content;
		this.onClick = onClick;
		this.element.style.color = color;
		this.color = color;
		this.element.addEventListener('mouseover', ()=>{this.activate()});
		this.element.addEventListener('mouseout', ()=> { this.deactivate()});
		this.element.addEventListener('click', ()=>{ this.onClick();});
	}
	animate(){
		const r =  Math.random() * (100);
		if (r > 90)
		{
			if (this.element.style.color === "transparent") this.element.style.color = this.color;
			else if (r > 95) this.element.style.color = "transparent";
		}
	}
}

export {Text, Input, Button}