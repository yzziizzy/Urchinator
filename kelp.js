






var Kelp = function(options) {
	
	var defaults = {
		speed: 3,
		stipeColor: 'green',
		stipeColorDead: 'brown',
		bladeColor: 'olive',
		bladderColor: 'olive',
		holdfastColor: 'brown',
		position: pt(400,430),
		nextpos: pt(400,450),
		
		hp: 100,
		
		alpha: 1,
		
		stipeHeight: 350,
		bladeSeparation: 30,
		bladeLength: 40,
		
		holdfastType: Math.floor(Math.random() * 3) + 1,
		
		wiggleTheta: 0,
		wiggleSpeed: 1,
		
		ghost: false,
		colliders: [],
		minBound: 10,
		bumping: 0,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Kelp';
	
	this.init();
	
}
	
Kelp.prototype.render = function(ctx) {
	
	

	
	
	ctx.save();
	
	ctx.translate(this.position.x, this.position.y);
	
	
	// draw the stipe. the base od the stipe is at 0,0. the holdfast goes down below it
// 		ctx.beginPath();
// 		ctx.moveTo(0, 0);
	
	var t = Math.cos(this.wiggleTheta);
	var t2 = Math.cos(this.wiggleTheta + 45);
	

	ctx.globalAlpha = this.alpha;
	
	// draw the left side
	ctx.beginPath();
	ctx.moveTo(0, 0);
	
	
	var t = Math.cos(this.wiggleTheta);
	var t2 = Math.cos(this.wiggleTheta + 45);
	
	var pc = Math.ceil(this.stipeHeight / 10);
	var inc = this.stipeHeight / pc;
	
	for(var i = 0; i < pc; i++) {
		//var y = ;
		var close = (i == 0) ? 0 : 8;
		ctx.lineTo(
			-close + Math.sin((i / 10) * Math.PI) * t * 10 - Math.sin((i / 7) * Math.PI) * t2 * 7
			, i * -inc);
	}
	
	
	// draw the top
	var ep = pc + 1;
	ctx.quadraticCurveTo( 
		// control point
		Math.sin((ep / 10) * Math.PI) * t * 10 - Math.sin((ep / 7) * Math.PI) * t2 * 7
		, -inc * ep
		// end point
		,8 + Math.sin(((pc-1) / 10) * Math.PI) * t * 10 - Math.sin(((pc-1) / 7) * Math.PI) * t2 * 7
		, -inc * (pc-1)
	);

	
	// draw the right side
	
	for(var i = pc - 1; i >= 0; i--) {
		//var y = ;
		var close = (i == 0) ? 0 : 8;
		ctx.lineTo(
			close + Math.sin((i / 10) * Math.PI) * t * 10 - Math.sin((i / 7) * Math.PI) * t2 * 7
			, i * -inc);
	}
	
	
	ctx.lineWidth = 1;
	ctx.closePath();
	ctx.fillStyle = this.bladeColor;
	ctx.fill();
	
	
	// draw the stipe
	ctx.beginPath();
	ctx.moveTo(0, 0);
	for(var i = 0; i < pc; i++) {
		//var y = ;
		ctx.lineTo(
			Math.sin((i / 10) * Math.PI) * t * 10 - Math.sin((i / 7) * Math.PI) * t2 * 7
			, i * -inc);
	}
	
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.stipeColor;
	
	ctx.stroke();
	
	
	// draw the holdfasts
	ctx.translate( - images.holdfast1_1.width / 2, 0);
	
	var eatlevel = Math.min(5, 6 - Math.ceil(this.hp/20)); // hack
	
	ctx.drawImage(images['holdfast' + this.holdfastType + '_' + eatlevel], 0, 0);
	
	ctx.restore();
};



Kelp.prototype.renderBlade = function(ctx, pos, lr) {
	
	
};


Kelp.prototype.frameMove = function(te) {
	this.wiggleTheta = (this.wiggleTheta + te * this.wiggleSpeed) % 360;
	
	if(this.hp == 0) {
		this.ghost = true;
		this.alpha = Math.max(this.alpha - te * .2, 0);
	};
	
	this.colliders = [];
};

Kelp.prototype.subHP = function(amount) {
	var old = this.hp;
	this.hp -= amount;
	if(this.hp < 0) this.hp = 0;
	if(this.hp > 100) this.hp = 100;
	return old - this.hp;
}


Kelp.prototype.init = function() {
	
	this.stipeHeight = 260 + Math.random() * 100;

	
	this.nextpos = ptc(this.position);
	
	this.bonePos = [];
	this.boneVel = [];
	this.boneForce = [];
	
	var bonelen = 20;
	var bonecount = Math.ceil(this.stipeHeight / bonelen);
	var remainderHeight = this.stipeHeight - Math.floor(this.stipeHeight / bonelen);
	
	
	var len = 0;
	var y = 0;
	for(var i = 0; i < bonecount; i++) {
		len += bonelen;
		
		
	}
	
	
	
	function addBone(x,y) {
		this.bonePos.push(pt(x,y));
		this.boneVel.push(pt(0,0));
		this.boneForce.push(pt(0,-2));
	}
	
	
	this.wiggleTheta = Math.random() * 360;
	this.wiggleSpeed = Math.random() + .5;
	
	
}

















