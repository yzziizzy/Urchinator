






var Emitter = function(options) {
	
	var defaults = {
		list: [],
		maxCount: 10,
		freq: .5,
		minLife: 2,
		maxLife: 4,
		objConst: null,
		emitTimer: 0,
		position: pt(0,0),
		constOpts: {},
		paused: false,
		minY: 50,// complete hack
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Emitter';
	
	this.init();
}



Emitter.prototype.render = function(ctx) {
	
	ctx.save();
	
	
	for(var i = 0; i < this.list.length; i++) {
		var o = this.list[i];
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(o.oPos.x, o.oPos.y);
		o.obj.render(ctx);
	}
	
	ctx.restore();
};




Emitter.prototype.frameMove = function(te) {
	
	this.emitTimer += te;
	
	this.checkEmit();
	
	var nl = [];
	for(var i = 0; i < this.list.length; i++) {
		var o = this.list[i];
		o.paramt += o.rate * te;
		if(o.paramt <= 1) { 
			o.obj.frameMove(te, o.paramt);
			
			// hack 
			if(o.obj.position.y + o.oPos.y < 50) continue;
			
			nl.push(o);
		}
	}
	
	this.list = nl;
};


Emitter.prototype.checkEmit = function() {
	//paused
	if(this.paused) return;
	
	// maxed out
	if(this.list.length >= this.maxCount) return;
	
	// not time yet
	if(this.emitTimer < this.freq) return;
	
	// emit one
	this.emitTimer -= this.freq;
	this.emit();
}


Emitter.prototype.emit = function() {
	
	var tlife = this.minLife + (Math.random() * (this.maxLife - this.minLife));
	
	this.list.unshift({
		obj: new this.objConst(this.constOpts),
		oPos: ptc(this.position),
		paramt: 0,
		rate:  1/tlife,
	});
	
	
};



Emitter.prototype.init = function() {
	
	
};








var ImageSprite = function(options) {
	
	var defaults = {
		image: null,
		position: pt(0,0),
		scale: 1,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'ImageSprite';
	
//	this.init();
}





ImageSprite.prototype.render = function(ctx) {
	
	ctx.save();
	
	ctx.translate(this.position.x, this.position.y);
	ctx.scale(this.scale, this.scale);
	
	if(this.image)
		ctx.drawImage(this.image, 0, 0);
	else 
		console.log(this.image);
	
	ctx.restore();
};




ImageSprite.prototype.frameMove = function(te, paramt) {
	
	this.position.y -= 80 * te;
	
	this.scale = .3 + (paramt * .7);
	
};






