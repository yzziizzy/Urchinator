






var Otter = function(options) {
	
	var defaults = {
	
		maxBreath: 7,
		breath: 7,
		drownRate: 20,
		
		// wiggle while swimming
		wiggleTheta: 0,
		wiggleAngle: 0,
		maxWiggle: .1,
		wiggleSpeed: 15.4,
		
		theta: 0,
		position: pt(500, 330),
		nextpos: pt(500, 330),
		
		speed: 0,
		maxSpeed: 300,
		acc: 200.5,
		drag: 100,
		dragSurface: 300,
		angularAcc: 4.1,
		
		surfaceSpeed: 0,
		
		uiAcc: false,
		uiDirection: pt(0,0),
		
		onSurface: 1,
		
		
		force: pt(0,0),
		
		
		bouyancy: 2,
		terminalVelocity: 5,
		
		ghost: false,
		colliders: [],
		minBound: 20,
		bumping: 0,
		
		hp: 100,
		eatRate: 11,
		mouthOpen: false,
		
		curHolding: null,
		holdVector: pt(30, -30),
		holdVectorFloating: pt(30, -20),
		holdVectorSwimming: pt(30, 30),
		
		noseVector: pt(100, 0),
		bubbleEmitter: new Emitter({
			objConst: ImageSprite,
			constOpts: {image: images.bubble},
			position: pt(500, 200),
		}),
			
		state: 'floating',
		
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Otter';
	
	this.init();
}

var pi_2 = Math.PI/2;

function pointedLeft(th) {
	if(th > pi_2 && th <= 3*pi_2) return true; 
	return false;
}
	


Otter.prototype.render = function(ctx) {
	
	ctx.save();
	
	
	ctx.translate(this.position.x , 
					this.position.y );
	//	ctx.scale(-1, this.uiDirection.x > 0 ? 1 : -1);
	ctx.rotate(this.theta + this.wiggleAngle);
	
	var img = images.otter_swimming;
	
	if(this.state == 'eating' || this.state == 'floating') {
		img = this.mouthOpen ? images.otter_eating : images.otter_floating;
		
		if(pointedLeft(this.theta)) ctx.scale(1,-1);
	}
	
	ctx.translate( - images.otter_swimming.width / 2, 
					- images.otter_swimming.height / 2);
	
// 		ctx.beginPath();
// 		ctx.rect(0, 0, 60, 20);
// 		ctx.lineWidth = 6;
// 		ctx.closePath();
// 		ctx.fillStyle = "brown";
// 		ctx.fill();
	

	
	ctx.drawImage(img, 0, 0);
	
	ctx.restore();
	
	
	this.bubbleEmitter.render(ctx);
};


Otter.prototype.frameMoveSurface = function(te) {
	
	
	// on the surface, theta really means nothing
	// movement is lateral, pressing down will dive
	
	this.theta = (this.theta + (Math.PI*2)) % (Math.PI*2);
	
	var dt = 0; // super hacky
	if(this.theta < pi_2 && this.theta > 0) {
		// going right, pointed down
		dt = 0 - this.theta;
	}
	else if(this.theta > 3*pi_2) {
		// still going right, pointed up
		dt = (Math.PI*2) - this.theta;
	}
	else if(this.theta > pi_2 && this.theta < Math.PI) {
		// going left, pointed down
		dt = this.theta - Math.PI;
	}
	else {
		// going left, pointed up
		dt = Math.PI - this.theta;
	}
	this.theta += dt * te * 3;
	this.theta = (this.theta + (Math.PI*2)) % (Math.PI*2);
	
	
	// need to level out...
	

	
//	this.theta = (this.theta + Math.PI*2) % Math.PI*2;
	if(0 == this.uiDirection.x) {
		if(this.surfaceSpeed > 0)
			this.surfaceSpeed = Math.min(300,this.surfaceSpeed - this.dragSurface*te);
		else
			this.surfaceSpeed = Math.max(-300, this.surfaceSpeed + this.dragSurface*te);
	}
	else {
		//this.surfaceSpeed += this.uiDirection.x * te * this.acc;
		
		if(this.surfaceSpeed <  0 && !pointedLeft(this.theta)) { 
			this.theta = (this.theta + (Math.PI)) % (Math.PI*2);
		}
			
		if(this.surfaceSpeed >  0 && pointedLeft(this.theta)) {
			this.theta = (this.theta + (Math.PI)) % (Math.PI*2);
		}
		
		this.surfaceSpeed = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.surfaceSpeed + this.uiDirection.x *2* this.acc*te));
		
	}
	
	
// 	if(this.surfaceSpeed > .01) {
// 		this.theta = -0.1;
// 		
// 	}
// 	else if(this.surfaceSpeed < -.01) {
// 		this.theta = Math.PI;
// 		
// 	}
// 	
	
//	console.log(this.surfaceSpeed + ' ' + this.speed)
	
	this.force.x = this.surfaceSpeed;
	this.force.y = 0; 
	//this.speed * Math.sin(this.theta);
	
	if(this.uiDirection.y > 0) {
		this.force.y = (this.speed) / 3;
	}
	
}



Otter.prototype.frameMoveSwimming = function(te) {
	
	// update speed
	if(this.uiAcc) {
		this.speed = Math.min(this.speed + te * this.acc, this.maxSpeed);
	}
	else {
		this.speed = Math.max(this.speed - te * this.drag, 0);
	}
	
	
	// update wiggle theta
	this.wiggleTheta = (this.wiggleTheta 
						+ this.wiggleSpeed * te 
						* (this.speed / this.maxSpeed)) % (2*Math.PI); 
	this.wiggleAngle = this.maxWiggle * Math.sin(this.wiggleTheta);
	
	
	// update theta
	var tt = (Math.atan2(this.uiDirection.y, this.uiDirection.x) + (2*Math.PI)) % (2*Math.PI);
	var pi2 = Math.PI*2;

	
	function getShortAngle2(at, target) {
		// rotate at to 0
		target -= at;
		
		// normalize target
		target = (target + pi2) % pi2;
		
		if(target > Math.PI) { // quicker to take the back route
			return target - pi2;
		}
		else { // target is small and positive, the shortest distance
			return target; 
		}
	}
	
	dt = getShortAngle2(this.theta, tt);
	
	if(this.uiAcc && Math.abs(dt) > .1) {
		this.theta = 
			(this.theta + te * this.angularAcc * (dt > 0 ? 1 : -1))
			%  (2*Math.PI);
	}
	
	// update swimming force
	this.force.x += this.speed * Math.cos(this.theta);
	this.force.y += this.speed * Math.sin(this.theta);
	
	
}



Otter.prototype.frameMove = function(te) {
	
	
	this.checkState(te);
	
	this.force.x = 0;
	this.force.y = 0;
	
	// bouyancy
	if(this.position.y > 50) {
		this.force.y = -10;
	}
	else {
		this.force.y = 50;
	}
// 		
	
	if(this.state == 'eating' || this.state == 'floating') {
		
		if(pointedLeft(this.theta)) this.holdVector.y = Math.abs(this.holdVectorFloating.y);
		else this.holdVector.y = -Math.abs(this.holdVectorFloating.y);
	}
		
	
	
	if(this.state == 'swimming') {
		this.frameMoveSwimming(te);
	}
	else {
		this.frameMoveSurface(te);
	}
	

	
	
	this.nextpos.y =  this.position.y + this.force.y * te;
	this.nextpos.x = this.position.x + this.force.x * te;
	
	
	// move teh bubble emitter
	
	var tmpx =  this.noseVector.x * Math.cos(this.theta) - this.noseVector.y * Math.sin(this.theta);
	var tmpy =  this.noseVector.x * Math.sin(this.theta) + this.noseVector.y * Math.cos(this.theta);
	
	this.bubbleEmitter.position.x = this.position.x + tmpx;
	this.bubbleEmitter.position.y = this.position.y + tmpy;
	
	this.bubbleEmitter.frameMove(te);
	
	this.colliders = [];
};



Otter.prototype.checkState = function(te) {
	
	if(this.breath == 0) {
		this.subHP(te * this.drownRate);
	//	console.log('otter is drowning! ' + this.hp);
	}
	
	if(this.hp == 0) {
		this.state = 'dead';
	}
	
	if(this.state == 'swimming') {
		// subtract breath
		this.subBreath(te);
		
		this.holdVector = this.holdVectorSwimming;
		
		// check collisions
		if(!this.curHolding) {
			for(var i = 0; i < this.colliders.length; i++) {
				if(this.canEat(this.colliders[i])) {
					//console.log('otter catches urchin');
					this.curHolding = this.colliders[i];
					this.curHolding.state = 'caught';
					this.curHolding.caughtBy = this;
					break;
				};
			}
		}
		
		if(this.position.y <= 55) {
			this.state = 'floating';
			this.surfaceSpeed = this.speed * Math.cos(this.theta);
			
			console.log('otter is floating ' + this.surfaceSpeed);
		}
	}
	
	// check for when the player dives
	if(this.state == "floating" || this.state == 'eating') {
		this.subBreath(te * -4);
		
		this.holdVector = this.holdVectorFloating;
		
		if(this.position.y > 80) {
			this.state = 'swimming'; 
			console.log('otter is swimming');
			return;
		}
	}
	
	if(this.state == 'floating' && this.canEat(this.curHolding)) {
		this.state = 'eating';
		console.log('otter starts eating');
		return;
	}
	
	if(this.state == 'eating') {
	//	this.eat(te);
//		console.log('urchin hp: ' + this.curHolding.hp);
	}
	
	
};




var foodvalue = {
	Urchin: .1,
	
	
};

Otter.prototype.canEat = function(obj) {
	if(!obj) return false;
	return foodvalue[obj.type] > 0; 
};


Otter.prototype.eat = function(amount) {
	var t = this.curHolding.type;
	
	if(!this.canEat(this.curHolding)) {
		this.subHP(5);
		return;
	};
	
	var hplost = this.curHolding.subHP(amount);
	this.subHP(-hplost * foodvalue[t]);
	
	if(this.curHolding.hp == 0) {
		this.dropItem();
		this.state = 'floating';
	}
};

Otter.prototype.dropItem = function() {
	if(!this.curHolding) return;
	this.curHolding.state = 'default';
	this.curHolding.caughtBy = null;
	this.curHolding = null;
	this.state = 'swimming';
};


Otter.prototype.takeBite = function() {
	if(this.state == 'swimming') {
		this.dropItem();
		return;
	}
	
	if(this.state == 'eating') {
		this.eat(this.eatRate);
	}
	
};


Otter.prototype.subHP = function(amount) {
	var old = this.hp;
	this.hp -= amount;
	if(this.hp < 0) this.hp = 0;
	if(this.hp > 100) this.hp = 100;
	return old - this.hp;
}
Otter.prototype.subBreath = function(amount) {
	var old = this.breath;
	this.breath -= amount;
	if(this.breath < 0) this.breath = 0;
	if(this.breath > this.maxBreath) this.breath = this.maxBreath;
	return old - this.breath;
}


Otter.prototype.init = function() {
	
	
};



















