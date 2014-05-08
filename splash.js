






function SplashText(options) {
	
	var defaults = {
		speed: 3,
		color: 'purple',
		position: pt(200,200),
		
		innerRadius: 10,
		outerRadius: 20,
		spineRandomness: 2,
		spineDensity: 20,
		
		theta: 0,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'SplashText';
	
	
	this.render = function(ctx) {
		
		

		
		
		ctx.save();
		
		ctx.translate(this.position.x, this.position.y);
		
		// need to draw the text
		
//		ctx.lineWidth = 2;
//		ctx.closePath();
		
		ctx.fillStyle = 'yellow';
		ctx.fill();
		
		ctx.strokeStyle = 'red';
		ctx.stroke();
		
		ctx.restore();
	};
	
	
	this.frameMove = function(te) {
		
		
		
	};
	
	
	this.init = function() {
		
		
		
	}
	
	this.init();
	
}

















