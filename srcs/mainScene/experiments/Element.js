class Overlay{
	constructor(){
		this.element = document.createElement('div');
		this.element.style.backgroundColor = 'transparent';
		this.element.style.boxSizing = 'border-box';
		this.element.style.padding = '0';
		this.element.style.border = 'none';
		this.element.style.visibility = "hidden";
		document.body.appendChild(this.element);
	}
	add(child){
		if (! (child instanceof Element))
			child = child.element;
		this.element.appendChild(child);
	}
}

class FlexBox{
	constructor({dir, mainAxis = "center", crossAxis = "center", marginTopBottom = 0.5, children, flex = 0, full = false}){
		this.element = document.createElement('div');
		if (full)
		{
			this.element.style.height = '100%';
			this.element.style.width = '100%';

		}

		this.element.style.display = 'flex';
		this.element.style.flexDirection = dir;
		this.element.style.justifyContent = mainAxis;
		this.element.style.alignItems = crossAxis;
		this.element.style.marginTop = `${marginTopBottom}%`;
		this.element.style.marginBottom = `${marginTopBottom}%`;
		if (flex > 0)
			this.element.style.flex = flex;
		children.forEach(child => {
			if (! (child instanceof Element))
				child = child.element;
			this.element.appendChild(child);
		});
	}
}

class Text{
	constructor(content, flex = 0)
	{
		this.element = document.createElement('label');
		this.element.textContent = content;
		if (flex > 0)
			this.element.style.flex = flex;
	}
}

class Input{
	constructor(autofocus = "false", flex = 0)
	{
		this.element = document.createElement('input');
		this.element.type = 'text';
		this.element.autofocus = autofocus;
		this.element.style.textAlign = 'center';
		this.element.style.backgroundColor = 'transparent';
		this.element.style.border = 'none';
		this.element.style.outline = 'none';
		if (flex > 0)
			this.element.style.flex = flex;
	}
}

class Button{
	constructor(content, onClick, flex = 0)
	{
		this.element = document.createElement('button');
		this.element.textContent = content;
		// this.element.style.visibility = "hidden";
		// this.element.addEventListener('mouseover', ()=>{
		// 	this.element.className = `${this.className}-hover`;
		// });
		// this.element.addEventListener('mouseout', ()=> {
		// 	this.element.className = this.className;
		// });
		console.log("on click ? ", onClick);
		this.element.addEventListener('click', ()=>{
			console.log("clicked button");
			onClick();
		}); 
		if (flex > 0)
			this.element.style.flex = flex;
	}
}

export {Overlay, FlexBox, Text, Input, Button}