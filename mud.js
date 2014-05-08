






var Mud = function(options) {
	
	var defaults = {
		speed: 3,
		color: 100,
		intensity: 10,
		
		wavelen: 120,
		phase: 0,
		
		
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
	
	this.type = 'Mud';
	
	this.init();
}


Mud.prototype.render = function(ctx) {
	
	var maxw = ctx.canvas.width;
	
	var cx, xy;
	//	ctx.drawBox(150,150, 'green', 6);
	
	ctx.save();
	
	ctx.translate(0, 450);
	
	ctx.beginPath();
	
	ctx.moveTo(0, 0);
	
	for(var i = 0; i < this.points.length; i++) {
		ctx.lineTo(this.points[i].x * 1000, -this.points[i].y * 30);
	}
	
	
	
	ctx.lineWidth = 3;
	
	
	ctx.lineTo(1200, 0);
	ctx.lineTo(1200, 1200);
	ctx.lineTo(-200, 1200);
	ctx.lineTo(-200, 0);
	
	ctx.closePath();
// 		
	ctx.fillStyle = "#9A7D3A";
	ctx.fill();
	
	ctx.strokeStyle = '#7A5D1A';
	ctx.stroke();
	
// 		for(var i = 0; i < this.points.length; i++) {
// 			ctx.drawBox(this.points[i].x * 800, -this.points[i].y * 30, 'red', 2);
// 		}

	
	ctx.restore();
};


Mud.prototype.frameMove = function(te) {
	
// 	//	this.
// 		console.log(te);
// 	console.log(this.phase);
// 		this.phase += 0.8 * te;
// 		this.phase = this.phase % (Math.PI * 2);
	
};




Mud.prototype.collides = function(p, r) {
	// check to see if it's deep enough ever
/*		
	var mindepth = 450 - (30 * .2);
	
	if(p.y + r < mindepth) return false;*/
	
	
	// check if it collided with us at that spot
	
// 		var closest = closestSpan(p.x);
// 		// find the y for it
// 		var slope = (closest[1].y - closest[0].y) / (closest[1].x - closest[0].x);
// 		
// 		var ty = 
	
		
	// fancy shit up there, but the floor is basically flat.
	return (p.y + r > 450);
	
}


function closestSpan(tx) {
	for(var i = 0; i < points.length - 1; i++) { // shitty linear seach, do binary later
		if(points[i].x * 1000 <= tx && points[i+1] >= tx) 
			return [points[i], points[i+1]];
	}
	return null;
}


Mud.prototype.init = function() {
	
	var pointct = this.lvlwidth / 20;
	var maxVariation = .2;
	
	
	var points = [
		pt(0.0, 0.0),
		pt(1.0, 0.0)
	];
	
	function subdivide(leftpt, depth) {
		if(depth <= 0) return;
		
		var lefty = points[leftpt];
		var righty = points[leftpt + 1];
		var x = ((righty.x - lefty.x) / 2) + lefty.x;
		var y = ((righty.y + lefty.y) / 2) + (Math.random() * maxVariation);
		
		points.splice(leftpt + 1, 0, pt(x,y));
		
		subdivide(leftpt + 1, depth - 1);
		subdivide(leftpt, depth - 1);
	}
	
	
	subdivide(0, 4);
	
	this.points = points;
	
}




















