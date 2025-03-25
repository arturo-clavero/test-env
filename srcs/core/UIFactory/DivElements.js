import {BaseDivElement} from './Base'

class Overlay extends BaseDivElement{
	constructor(children = [], color, padding='5%', resizeFactor = 0.07, id = "overlay"){
		super(id, [new FlexBox({
									children: children, 
									width: "100%", 
									height: "100%", 
									dir: "column", 
									padding: padding
								})]);
		this.resizeFactor = resizeFactor;
		this.element.style.boxSizing = 'border-box';
		this.element.style.border = 'none';
		this.element.style.visibility = "hidden";
		document.body.appendChild(this.element);
		this.getElementsWith("text").forEach(element => { element.element.style.color = color;});
	}
	resize(){
		const w = this.element.offsetWidth;
		const h = this.element.offsetHeight;
		this.getElementsWith("size").forEach(element => { element.extensions.size.updateSize(w, h);});
		// const fontSize = Math.max( w  * this.resizeFactor, h * this.resizeFactor);
		const fontSize = (((w + h) / 2) * this.resizeFactor);
		this.getElementsWith("text").forEach(element => { element.extensions.text.updateSize(fontSize);});
	}
}

class FlexBox extends BaseDivElement {
	constructor({
			id = "flexbox",
			children = [],
			width, height,
			dir, mainAxis = "center", crossAxis = "center", flex = 0,
			marginTop = '0.5%', marginLeft= '0%', marginRight='0%', marginBottom= '0.5%', padding, 
		})
		{
			super(id, children);
			if (width) this.element.style.width = width;
			if (height) this.element.style.height = height;

			// if (full == "height" || full == "true")
			// 	this.element.style.height = '100%';
			// this.element.style.display = 'flex';
			if (dir)
				this.element.style.flexDirection = dir;
			this.element.style.justifyContent = mainAxis;
			this.element.style.alignItems = crossAxis;
			this.element.style.marginLeft = marginLeft;
			this.element.style.marginRight = marginRight;
			this.element.style.marginTop = marginTop;
			this.element.style.marginBottom = marginBottom;
			this.element.style.boxSizing = 'border-box';

			if (padding) this.element.style.padding = padding;
			// this.element.style.backgroundColor =  'rgba(255,255,255,0.1)';

			if (flex > 0) this.element.style.flex = flex;
		}
}

export {FlexBox, Overlay}