






var Seaweed = function(options) {
	
	var defaults = {
		speed: 3,
		fillColor: 'green',
		strokeColor: 'forest',
		position: pt(200, 400),
		nextpos: pt(200, 400),
		
		wavelen: 120,
		phase: 0,
		height: 300,
		
				
		colliders: [],
		minBound: 10,
		bumping: 0,
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Seaweed';
	
}
	
Seaweed.prototype.render = function(ctx) {
	
	var maxw = ctx.canvas.width;
	
	var cx, xy;
	
	ctx.save();
	
// 		ctx.translate(0, 50);
// 		
// 		ctx.beginPath();
// 		
// 		ctx.moveTo(0, 0);
// 		
// 		cy = Math.sin(this.phase) * this.intensity;
// 		
// 		for(var i = 0; i * this.wavelen <= 1000; i+=2) {
// 			//cy = 30;
// 			ctx.quadraticCurveTo( cy, this.wavelen * i - (this.wavelen / 2), this.wavelen * (i), 0);
// 			ctx.quadraticCurveTo(-cx, this.wavelen * i + (this.wavelen / 2), this.wavelen * (i + 1), 0);
// 			
// 			
// 		}
// 		
// 		
// 
// 		ctx.lineWidth = 3;
// 		
// 		
// 		ctx.lineTo(1200, 0);
// 		ctx.lineTo(1200, 1200);
// 		ctx.lineTo(-200, 1200);
// 		ctx.lineTo(-200, 0);
// 		
// 		ctx.closePath();
// 		
// 		ctx.fillStyle = "#aabbff";
// 		ctx.fill();
// 		
// 		ctx.strokeStyle = '#112277';
// 		ctx.stroke();
	
	ctx.restore();
};


Seaweed.prototype.frameMove = function(te) {
	
//	this.
	//console.log(te);
//	console.log(this.phase);
	this.phase += 0.8 * te;
	this.phase = this.phase % (Math.PI * 2);
	
};


















