






var HUD = function(options) {
	
	var defaults = {
		color: 100,
		intensity: 10,
		widgets: [],
		
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'HUD';
	
}


HUD.prototype.render = function(ctx) {
	
	for(var i = 0; i < this.widgets.length; i++) {
		var w = this.widgets[i];
		
		ctx.save();
		
		ctx.translate(w.pos.x, w.pos.y);
		w.w.render(ctx);
		
		ctx.restore();
	}
};


HUD.prototype.frameMove = function(te) {
	for(var i = 0; i < this.widgets.length; i++) {
		this.widgets[i].w.frameMove(te);
	}
};




HUD.prototype.addWidget = function(w, x, y) {
	this.widgets.push({
		w: w,
		pos: pt(x,y),
	});
	
}










var HUDHearts = function(_otter) {
	
	this.otter = _otter;
	this.maxHearts = 5;
}

HUDHearts.prototype.render = function(ctx) {
	var hearts =  Math.ceil(this.otter.hp / (100 / this.maxHearts));
	//console.log(hearts);
	var left = 0;
	
	for(var i = 0; i < hearts; i++) { 
		ctx.drawImage(images.heart, (this.maxHearts * 25) - left, 0);
		left += 25;
	};
	
	// draw a half-heart if needed
};


HUDHearts.prototype.frameMove = function(te) {
	
};




var HUDBubbles = function(_otter) {
	
	this.otter = _otter;
	this.maxBubbles = 7;
	
}

HUDBubbles.prototype.render = function(ctx) {
	var bubbles =  Math.ceil(this.otter.breath / (this.otter.maxBreath / this.maxBubbles));
	//console.log(bubbles);
	var left = 0;
	
	for(var i = 0; i < bubbles; i++) { 
		ctx.drawImage(images.bubble_icon, left, 0);
		left += 25;
	};
	
	// draw a half-heart if needed
};


HUDBubbles.prototype.frameMove = function(te) {
	
};





var HUDList = function(options) {
	var defaults = {
		list: [],
		icon: null,
		textOffset: pt(0,0),
		imgScale: 1,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'HUDList';
}

HUDList.prototype.render = function(ctx) {
	var num = 0;
	for(var i = 0; i < this.list.length; i++) {
		if(this.list[i].hp > 0) num++;
	}
	//console.log(bubbles);
	
	ctx.save();
	 
	
	ctx.font = ' 25px Sans Serif';
	ctx.fillText(
		num, 
		(this.icon.width * this.imgScale) + this.textOffset.x, 
		this.textOffset.y);
	
	ctx.scale(this.imgScale, this.imgScale);
	ctx.drawImage(this.icon, 0, 0);
	
	ctx.restore();
};


HUDList.prototype.frameMove = function(te) {
	
};







