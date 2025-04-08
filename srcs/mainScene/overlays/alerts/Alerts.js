
class AlertManager{
	constructor(){
		if (AlertManager.instance)
			return AlertManager.instance;
		this.queue = [];
		AlertManager.instance = this;
		this.currentAlert = null;
	}
	add_alert(alert){
		if (!this.currentAlert && this.queue.length == 0)
			this.display_latest_alert(alert);
		else if (alert.priority > this.currentAlert.priority)
		{
			this.queue.push = this.currentAlert;
			this.currentAlert.hide(true);
			this.display_latest_alert(alert);
		}
		else if (alert.canQueue == true)
		{
			let index = -1;
			for (let i = 0; i < this.queue.length(); i++){
				if (alert.priority > this.queue[i].priority)
				{
					index = i;
					break;
				}
			}
			if (index == -1)
				this.queue.push(alert);
			else
				this.queue.splice(index, 0, alert);
		}
	}
	display_latest_alert(alert){
		this.currentAlert = alert;
		this.currentAlert.show();
	}
	remove_latest_alert(alert){
		if (this.currentAlert != alert)
			return;
		this.currentAlert.hide();
		this.currentAlert = null;
		if (this.queue.length > 0)
			this.display_latest_alert(this.queue.shift())
	}
}


class Alert{
	constructor(children, type, priority, enter = ()=>{}, exit = ()=>{}, canQueue = true){
		this.style_div();
		this.append_children(children);
		this.type = type;//ALERT | WARNING | INFO
		this.priority = priority;
		this.enter = enter;
		this.exit = exit;
		this.canQueue = canQueue;
		this.hide(true);
	}
	style_div(){
		let popup = document.createElement("div");
		popup.style.position = "fixed";
		popup.style.top = "10px";
		popup.style.left = "50%";
		popup.style.transform = "translateX(-50%)";
		popup.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
		popup.style.color = "white";
		popup.style.padding = "8px 15px";
		popup.style.borderRadius = "5px";
		popup.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.8)";
		popup.style.fontSize = "16px";
		popup.style.whiteSpace = "nowrap";
		popup.style.zIndex = "1000";
		popup.style.textAlign = "center";
		popup.id = "popup-message";
		this.div = popup;
	}
	append_children(children){
		for (let i = 0; i < children.length; i++){
			this.div.appendChild(children[i].element)
		}
		document.body.appendChild(this.div);
	}
	show(){
		this.div.style.display = "absolute";
		this.enter()

	}
	hide(later = "false"){
		this.div.style.display = "none";
		if (!later)
			this.exit()
	}
}

export {AlertManager, Alert}