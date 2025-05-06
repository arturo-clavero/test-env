import * as THREE from 'three';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three/webgpu';
import { get_friends } from './fakeFriendsList';
import {width, height, length, glass} from './friendMachine'
import { MainEngine } from '../../utils/MainEngine';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { shuffleArray, updateLabel} from './utils';
const radius = 0.3;
const min_spheres = 5
const max_spheres = 5
const engine = new MainEngine();
let duration = 3000;
let scrollVelocity = 0;
let velocityDecay = 0.95; 
let lastKeyTime = Date.now();

export class SphereGroup {
	constructor(){
		if (SphereGroup.instance)
			return SphereGroup.instance
		this.self = null;
		this.f = 0.5;
		this.total_x = height - (2 * this.f)
		this.total_z = length - (2 * this.f)	
		this.queue = []
		this.instanceGroup = []
		this.count = 0;
		this.position = "0"
		this.animate_motion = null
		this.midSphere = null
		this.delay_motion = null
		this.motion = "0"
		SphereGroup.instance = this
	}
	add(obj){
		this.instanceGroup.push(obj)
		this.count += 1;
		if (this.self)
		{
			this.self.add(obj.self)
			return this.count;
		}
		else
		{
			this.queue.push(obj.self)
			return this.count;
		}
	}
	async init(){
		this.self = new THREE.Group();
		this.queue.forEach(obj=>this.self.add(obj))
		this.friends_list = await get_friends()
		if (this.friends_list == null)
			this.friends_list = []
		this.total_spheres = this.friends_list.length < min_spheres ? min_spheres : this.friends_list.length > max_spheres ? max_spheres : this.friends_list.length;
		if (this.total_spheres % 2 == 0)
			this.total_spheres -=1
		// this.mode = this.friends_list.length < min_spheres ? -1 : this.friends_list.length > max_spheres ? 1 : 0;
		for (let i = 0; i < this.total_spheres; i++)
			new Sphere()
		glass.self.add(this.self)
	}
	random_position(travel = false){
		if (this.position == "random")
			return
		this.position = "random"
		this.gridSize = Math.ceil(Math.sqrt(this.total_spheres));
		this.cellIndices = [];
		for (let x = 0; x < this.gridSize; x++) {
			for (let y = 0; y < this.gridSize; y++) {
				this.cellIndices.push({x, y});
			}
		}
		shuffleArray(this.cellIndices);
		this.instanceGroup.forEach(sp=>sp.random_position(travel, this.cellIndices, this.gridSize, this.f, this.total_x, this.total_z))
		if (travel)
		{
			this.change_motion("travel")
			console.log("travel in tandom!", duration)
		}
	}
	scroll_position(dir = 0)
	{
		const now = Date.now();
		if (this.position == "scroll") 
		{
			lastKeyTime = now;
			return
		}
		this.position = "scroll";
		if (dir != 0)
		{
			const timeDiff = now - lastKeyTime;
			lastKeyTime = now;
			scrollVelocity *= velocityDecay;
			scrollVelocity = Math.min(scrollVelocity + 0.1, 1);
			const speedFactor = 1 + scrollVelocity * 11; //AMP UP!
			duration = 3000 / speedFactor;
		}
		this.instanceGroup.forEach(sp=>sp.scroll_position(this.total_spheres, dir))
		this.change_motion("travel")
	}
	resize(){
		// for (let i = 0; i < this.total_spheres; i++){
		// 	updateLabel(this.instanceGroup[i].label, this.instanceGroup[i].self, engine.camera, engine.renderer)
		// }
	}
	animate(){
		this.instanceGroup.forEach(sphere=>sphere.label.lookAt(engine.camera))
		this.animate_motion(Date.now())
	}
	change_motion(motion){
		const actions = {
			"spin" : this.spin,
			"travel" : this.travel,
			"float" : this.float,
		}
		if (this.motion == "travel")
		{
			this.delay_motion = motion;
			console.log("delaying motion ", motion)
		}
		else
		{
			this.animate_motion = actions[motion]
			this.motion = motion
		}
	}
	spin(t){
		this.self.rotation.z += 0.002
		this.float(t)
	}
	travel(t){
		let finished = 0;
		console.log("travel")
		for (let i = 0; i < this.instanceGroup.length; i++){
			finished += this.instanceGroup[i].travel(t)
		}
		if (finished == this.total_spheres)
		{
			console.log("finished")
			this.instanceGroup.forEach(sp=>sp.allow_float())
			this.duration = 3000
			if (this.position == "scroll")
				this.position = "arrived"
			this.motion = "0"
			if (this.delay_motion)
			{
				console.log("delayed motion apply")
				this.change_motion(this.delay_motion)
				this.delay_motion = null
			}
			else
				this.change_motion("float");
		}
	}
	float(t){
		this.instanceGroup.forEach(sphere=>sphere.float(t))
	}
	
}

export class Sphere {
	constructor(){
		// this.geometry = new THREE.SphereGeometry(radius, 32, 32)
		// this.material = new MeshStandardMaterial({color: 0xff00ff, side: THREE.FrontSide})
		// this.self = new THREE.Mesh(this.geometry, this.material)
		this.self = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new MeshStandardMaterial({color: 0xff00ff, side: THREE.FrontSide}))
		this.self.userData.instance = this;
		this.self.position.set(0, 0, 0);
		this.i = new SphereGroup().add(this);
		this.secondTarget = null;
		this.animationStartTime = null;
		this.inSecondLeg = false;
		this.add_label()
	}
	random_position(travel = false, cellIndices, gridSize, f, total_x, total_z){
		const {x, y} = cellIndices[this.i];
		let min_x = ((- height / 2) + f) + (total_x * (x/ gridSize))
		let min_z = ((- length / 2) + f) + (total_z * (y/ gridSize))
		let max_x = min_x + (total_x / gridSize);
		let max_z = min_z + (total_z / gridSize);
		const pos = new THREE.Vector3(
			min_x + ((max_x - min_x) * 0.5),
			THREE.MathUtils.randFloat((- width / 2 ) +f , (width / 2) - f),
			min_z + ((max_z - min_z) * 0.5),
		);
		if (!travel)
		{
			this.self.position.copy(pos);
			this.allow_float()
		}
		else
		{
			console.log("trael shere")
			this.targetX = pos.x
			this.targetY = pos.y
			this.targetZ = pos.z
			this.animationStartTime = Date.now()
			this.startPosition.x = this.self.position.x
			this.startPosition.y = this.self.position.y
			this.startPosition.z = this.self.position.z
		}
	}
	scroll_position(total, dir){
		this.position = "scroll"
		console.log("this i : ", this.i)
		this.i += dir;

		if (this.i < 1 )
		{
			this.i = total;
			this.secondTarget = true;
		}
		else if (this.i > total)
		{
			this.i = 1;
			this.secondTarget = true;
		}
		console.log("this i : ", this.i)
		let f = 0.5;
		const minX = -width / 2 + f;
		const maxX = minX + width - f - f;
		const minY = -height / 2 + f / 2;
		const maxY =  minY + height - f;
		const minZ = -length / 2 + f ;
		const maxZ = minZ + length - f -f;
		const factor = (1 / 5) + ((total - 5) / (15 - 5)) * (1 - 1 / 5);
		const t = (this.i - 1) / (total - 1); // normalize index from 0 to 1
		this.targetZ = maxZ - t * (maxZ - minZ);// adjust minZ/maxZ as needed
		const curveY = Math.sin(t * Math.PI); // same arch
		this.targetY = minY + curveY * (maxY - minY);
		if (this.i == Math.ceil(total / 2)) 
		{
			new SphereGroup().midSphere = this;
			console.log(this.i)
			this.targetY = maxY + radius;
		}
		const curveX = 1 - Math.sin(t * Math.PI);  // 1 → 0 → 1
		this.targetX = minX + curveX * ((maxX - minX ) * factor); 
		this.startPosition = this.self.position.clone();
		this.animationStartTime = Date.now();
		if (this.secondTarget)
		{
			this.secondTarget = new THREE.Vector3(this.targetX, this.targetY, this.targetZ)
			this.targetX = 0;
			this.targetY = 0;
			if (this.i == 1)
			{
				this.targetZ = - length / 2 - radius;
				this.secondStart = new THREE.Vector3(this.targetX, this.targetY, length / 2 + radius )
			}
			else
			{
				this.targetZ = length / 2 + radius;
				this.secondStart = new THREE.Vector3(this.targetX, this.targetY,  - length / 2 - radius )
			}
		}
	}
	allow_float(){
		this.baseZ = this.self.position.z;
		this.amplitude = 0.015 + Math.random() * 0.01;
		this.frequency = 2 + Math.random() * 1.5,
		this.offset = Math.random() * Math.PI * 2;
		this.floatStartTime = Date.now() + Math.random() * 500
	}
	travel(now){
		let len = this.secondTarget ? duration / 2 : duration;
		const elapsed = now - this.animationStartTime;
		const t = Math.min(elapsed / len, 1);
		if (t >= 1)
		{
			if (this.secondTarget && !this.inSecondLeg)
			{
				this.inSecondLeg = true;
				this.startPosition = new THREE.Vector3(this.secondStart.x, this.secondStart.y, this.secondStart.z)
				this.self.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z)
				this.targetX = this.secondTarget.x;
				this.targetY = this.secondTarget.y;
				this.targetZ = this.secondTarget.z;
				this.animationStartTime = now;
				return 0;
			}
			else
			{
				this.secondTarget = null;
				this.secondStart = null;
				this.inSecondLeg = false;
				return 1
			}
		}
		const sx = this.startPosition.x;
		const sy = this.startPosition.y;
		const sz = this.startPosition.z;
		const tx = this.targetX;
		const ty = this.targetY;
		const tz = this.targetZ;
		const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
		const easedT = easeOutCubic(t);
		this.self.position.set(
			THREE.MathUtils.lerp(sx, tx, easedT),
			THREE.MathUtils.lerp(sy, ty, easedT),
			THREE.MathUtils.lerp(sz, tz, easedT)
		);
		return 0
	}
	float(t){
		if (t < this.floatStartTime) return;
		if (!this.hasStartedFloat) {
			this.baseZ = this.self.position.z;
			this.hasStartedFloat = true;
		}
		const floatElapsed = (t - this.floatStartTime) / 1000;
		const delta = Math.sin(floatElapsed * this.frequency + this.offset) * this.amplitude;
		const rampUp = Math.min(floatElapsed / 1.0, 1); 
		this.self.position.z = this.baseZ + delta * rampUp;
	}
	async add_friend(index)
	{
		this.friend = await get_friends(index);
		const img = document.createElement('img');
		img.src = this.friend.avatar;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'cover';
		this.div.appendChild(img);
	}
	hideAvatar() {
		this.div.style.visibility = 'hidden';
		console.log("hide");
	}
	showAvatar() {
		this.div.style.visibility = 'visible';
		console.log("show");
	}	
	add_label(){
		this.div = document.createElement('div');
		this.div.className = 'label';
		this.div.style.width = '40px';
		this.div.style.height = '40px';
		this.div.style.borderRadius = '50%';
		this.div.style.overflow = 'hidden';
		this.div.style.backgroundColor = "white";
		this.div.style.visibility = 'visible';
		this.div.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)';
		this.overlay = document.createElement('div');
		this.overlay.style.position = 'absolute';
		this.overlay.style.top = '0';
		this.overlay.style.left = '0';
		this.overlay.style.width = '100%';
		this.overlay.style.height = '100%';
		this.overlay.style.borderRadius = '59%';
		this.overlay.style.background = `
		radial-gradient(
			circle at 50% 50%,
			transparent 40%,
			rgba(0, 0, 0, 0.4) 80%,
			rgba(0, 0, 0, 0.8)
		)
		`;
		this.div.appendChild(this.overlay);
		this.label = new CSS3DObject(this.div);
		// this.label.userData.isLabel = true;
		this.label.position.set(0, 0, 0)
		this.label.rotation.x -= Math.PI/2;
		this.label.scale.set(0.012, 0.012, 0.012);
		this.self.add(this.label);
	}
}
