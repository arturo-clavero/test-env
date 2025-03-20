class BaseDivElement{
	constructor(){
		this.element = document.createElement('div');
		this.childElements = [];
	}
	add(element){
		if (! (element instanceof Element))
		{
			this.childElements.push(element);
			element = element.element;
		}
		this.element.appendChild(element);
	}
	getElementById(id){
		for (let child of this.childElements) {
			if (child instanceof BaseDivElement)
			{
				let child_found = child.getElementById(id);
				if (child_found != undefined)
					return child_found;
			}
			if (child.element.id == id)
				return child;
		};
		return undefined;
	}
	getElementsWith(type, elements){
		if (!elements)
			elements = [];
		for (let child of this.childElements) {
			if (child instanceof BaseDivElement)
				elements = child.getElementsWith(type, elements);
			else if (child.extensions && child.extensions[type] != undefined)
				elements.push(child);
			else
				console.log("no extensions of ", type, "for: ", child.element);
		};
		return elements;
	}
}

class Overlay extends BaseDivElement{
	constructor(children = [], id = "overlay"){
		super();
		// this.element = document.createElement('div');
		this.element.style.backgroundColor = 'transparent';
		this.element.style.boxSizing = 'border-box';
		this.element.style.padding = '0';
		this.element.style.border = 'none';
		this.element.style.visibility = "hidden";
		this.element.id = id;
		document.body.appendChild(this.element);
		children.forEach(child => {this.add(child);});
	}
}

class FlexBox extends BaseDivElement {
	constructor({dir, mainAxis = "center", crossAxis = "center", marginTopBottom = 0.5, children = [], flex = 0, full = false, id = "flexbox"}){
		super();
		this.element.id = id;
		// this.element = document.createElement('div');
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
		if (flex > 0) this.element.style.flex = flex;
		children.forEach(child => {this.add(child);});
	}
}



class BaseNonDivElement {
	constructor(type, id, flex, fontSize, w, h){
		this.element =  document.createElement(type);
		this.element.id = id;
		if (flex > 0)
			this.element.style.flex = flex;
		this.extensions = {
				text : new TextExtension(this.element, fontSize),
				size : undefined
		}
		if ( w != undefined && h != undefined)
			this.extensions.size = new SizedExtension(this.element, w, h);
	}

}

class TextExtension {
	constructor(element, fontSize){
		this.element = element;
		this.fontSizeFactor = fontSize;
	}
	updateSize(newFontsize) {
		console.log("update size for ", this.element);
		console.log("new : ", newFontsize);
		console.log("factor: ", this.fontSizeFactor);
		this.currFontSize = newFontsize * this.fontSizeFactor;
		console.log("the update is: ", this.currFontSize);
		this.element.style.fontSize = `${this.currFontSize}px`;
	}
	tempChangeSize(factor){
		this.prevFontSize = this.currFontSize;
		this.currFontSize *= factor;
		this.element.style.fontSize = `${this.currFontSize}px`;
	}
	revertSize(){
		this.currFontSize = this.prevFontSize;
		this.element.style.fontSize = `${this.currFontSize}px`;
	}
}

class SizedExtension{
	constructor(element, width, height){
		this.element = element;
		this.widthFactor = width;
		this.heightFacor = height;
	}
	updateSize(newWidth, newHeight){
		this.element.style.width = `${newWidth * this.widthFactor}px`;
		this.element.style.height = `${newHeight * this.heightFacor}px`;
	}
}

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
	constructor({id = "button", content, onClick, flex = 0, fontSize = 1, w, h})
	{
		super('label', id, flex, fontSize, w, h);
		// this.element.style.pointerEvents = 'all';
		this.element.textContent = content;
		// this.element.style.visibility = "hidden";
		this.element.addEventListener('mouseover', ()=>{ this.extensions.text.tempChangeSize(1.25);});
		this.element.addEventListener('mouseout', ()=> { this.extensions.text.revertSize(1.25);});
		this.element.addEventListener('click', ()=>{ onClick();}); 
	}
	animate(){
		const r =  Math.random() * (10);
		if (r > 9)
		{
			if (this.element.style.color === "transparent") this.element.style.color = "black";
			else this.element.style.color = "transparent";
		}
	}
}

export {Overlay, FlexBox, Text, Input, Button,}