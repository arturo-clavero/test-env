import {BaseDivElement} from './Base'

class Overlay extends BaseDivElement{
	constructor(children = [], resizeFactor = 0.1, id = "overlay"){
		super(id, children);
		this.resizeFactor = resizeFactor;
		this.element.style.backgroundColor = 'red';
		this.element.style.boxSizing = 'border-box';
		this.element.style.padding = '0';
		this.element.style.border = 'none';
		this.element.style.visibility = "hidden";
		document.body.appendChild(this.element);
	}
	resize(){
		const w = this.element.offsetWidth;
		const h = this.element.offsetHeight;
		this.getElementsWith("size").forEach(element => { element.extensions.size.updateSize(w, h);});
		const fontSize = Math.min( w  * this.resizeFactor, h * this.resizeFactor);
		this.getElementsWith("text").forEach(element => { element.extensions.text.updateSize(fontSize);});
	}
}

class FlexBox extends BaseDivElement {
	constructor({dir, mainAxis = "center", crossAxis = "center", marginTop = '0.5%', marginLeft= '0%', marginBottom= '0.5%', children = [], flex = 0, full = false, id = "flexbox"}){
		super(id, children);
		if (full)
		{
			this.element.style.height = '100%';
			this.element.style.width = '100%';
		}
		this.element.style.display = 'flex';
		this.element.style.flexDirection = dir;
		this.element.style.justifyContent = mainAxis;
		this.element.style.alignItems = crossAxis;
		this.element.style.marginLeft = marginLeft;
		this.element.style.marginTop = marginTop;
		this.element.style.marginBottom = marginBottom;
		if (flex > 0) this.element.style.flex = flex;
	}
}

export {FlexBox, Overlay}