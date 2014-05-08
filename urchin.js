






var Urchin = function(options) {
	
	var defaults = {
		speed: 3,
		color: '#c96fc5',
		colorCore: '#531f2c',
		position: pt(200,350),
		nextpos: pt(200,350),
		
		alpha: 1,
		
		innerRadius: 10,
		outerRadius: 20,
		spineRandomness: 2,
		spineDensity: 20,
		
		theta: 0,
		state: 'falling',
		currentFood: null,
		eatRate: 10,
		
		direction: Math.random() > .5 ? 1 : -1,
		
		force: pt(0,0),
		
		bouyancy: 2,
		terminalVelocity: 5,
		
		ghost: false,
		colliders: [],
		minBound: 10,
		bumping: 0,
		
		hp: 100,
		caughtBy: null,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Urchin';
	
	this.init();
	
}
	
Urchin.prototype.render = function(ctx) {
	
	

	
	
	ctx.save();
	
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.theta);
	
	ctx.beginPath();
	ctx.moveTo(this.innerpoints[0].x, this.innerpoints[0].y);
	
	for(var i = 0; i < this.spineDensity; i++) {
		ctx.lineTo(this.innerpoints[i].x, this.innerpoints[i].y);
		ctx.lineTo(this.outerpoints[i].x, this.outerpoints[i].y);
	}
	
	
	ctx.lineWidth = 2;
	ctx.closePath();
	
	ctx.globalAlpha = this.alpha;
	
	ctx.fillStyle = this.colorCore;
	ctx.fill();
	
	if(this.state == 'dead')
		ctx.strokeStyle = 'black';
	else
		ctx.strokeStyle = this.color;
	
	ctx.stroke();
	
	ctx.restore();
};


Urchin.prototype.frameMove = function(te) {
	
	this.checkState(te);
	//if(this.caught) this.isMoving = false;
	
	if(this.state == 'dead') {
		this.alpha = Math.max(this.alpha - te * .1, 0);
	};
	
	if(this.state == 'caught') {
		var c = this.caughtBy;
		
		var tmpx =  c.holdVector.x * Math.cos(c.theta) - c.holdVector.y * Math.sin(c.theta);
		var tmpy =  c.holdVector.x * Math.sin(c.theta) + c.holdVector.y * Math.cos(c.theta);
		
		this.nextpos.x = c.position.x + tmpx;
		this.nextpos.y = c.position.y + tmpy;
		
		
		return;
	}
	
	if(this.position.y < 440) {
		this.force.y = 50.9;
	}
	else {
		this.force.y = 0;
	}
	
	if(this.bumping & COL_LEFT) this.direction = 1;
	if(this.bumping & COL_RIGHT) this.direction = -1;
	if(this.bumping & COL_X) this.force.x = 50 * this.direction;
	
	
	
	this.nextpos.y = this.position.y + this.force.y * te;
	this.nextpos.x = this.position.x + this.force.x * te;
	
	
	if(this.state == 'foraging') {
		this.theta = (this.theta + te * .1 * this.direction) % 360;
		
		
	}
	
	
	this.colliders = [];
};



Urchin.prototype.checkState = function(te) {
	
	if(this.state == 'default') this.state = 'falling';
	
	if(this.hp == 0) {
		this.state = 'dead';
		this.type = 'DeadUrchin';
		return;
	}
	
	// the sea otter sets the caught state
	if(this.state == 'caught') {
		this.currentFood = null;
		this.force.x = 0;
		this.force.y = 0;
		
		return;
	}
	
	// check to see if it hits the floor
	if(this.state == 'falling' && this.position.y >= 438) {
		this.state = 'foraging'; 
		
		// set out
		this.force.x = 50 * this.direction;
		
		return;
	}
	
	// check for kelp collisions
	if(this.state == 'foraging') {
		for(var i = 0; i < this.colliders.length; i++) {
			if(this.colliders[i].type == 'Kelp') {
				this.state = 'eating';
				this.currentFood = this.colliders[i];
				this.force.x = 0;
			};
		}
	}
	
	if(this.state == 'eating') {
		this.currentFood.subHP(this.eatRate * te);
		if(this.currentFood.hp == 0) {
			this.state = 'foraging';
			this.force.x = 50 * this.direction;
		}
	}
	
	
	
	
}

Urchin.prototype.subHP = function(amount) {
	var old = this.hp;
	this.hp -= amount;
	if(this.hp < 0) this.hp = 0;
	if(this.hp > 100) this.hp = 100;
	return old - this.hp;
}



Urchin.prototype.init = function() {
	
	this.innerpoints = [];
	this.outerpoints = [];
	
	var spinearc = 2*Math.PI / this.spineDensity; 
	for(var i = 0; i < this.spineDensity; i++) {
		var x,y;
		
		x = Math.cos(i * spinearc) * this.innerRadius;
		y = Math.sin(i * spinearc) * this.innerRadius;
		
		this.innerpoints.push(pt(x,y));
	}
	
	var halfspinearc = spinearc / 2;
	for(var i = 0; i < this.spineDensity; i++) {
		var x,y;
		
		x = Math.cos(i * spinearc + halfspinearc) * this.outerRadius + ((Math.random() * 2 - 1) * this.spineRandomness);
		y = Math.sin(i * spinearc + halfspinearc) * this.outerRadius + ((Math.random() * 2 - 1) * this.spineRandomness);
		
		this.outerpoints.push(pt(x,y));
	}
	
	
	
	
}


















