
var COL_LEFT =   0x0001;
var COL_RIGHT =  0x0002;
var COL_TOP =    0x0004;
var COL_BOTTOM = 0x0008;

var COL_X = COL_LEFT | COL_RIGHT;
var COL_Y = COL_TOP | COL_BOTTOM;





var Collisions = function(options) {
	
	var defaults = {
		emptyRects: [],
		actors: [],
	};
		
	var e = $.extend({}, defaults, options);
	for(x in e) this[x] = e[x];
}



// swap the positions
Collisions.prototype.frameMove = function(te) {
	for(var i = 0; i < this.actors.length; i++){
		this.actors[i].position.x = this.actors[i].nextpos.x;
		this.actors[i].position.y = this.actors[i].nextpos.y;
	}
};



Collisions.prototype.checkActorCollisions = function() {
	// ugly as ugly gets; optimize later
	for(var i = 0; i < this.actors.length; i++) {
		for(var j = i + 1; j < this.actors.length; j++) {
			var a = this.actors[i];
			var b = this.actors[j];
			if(a.ghost || b.ghost) continue;
			if(areColliding(a.nextpos, b.nextpos, a.minBound, b.minBound)) {
				a.colliders.push(b);
				b.colliders.push(a);
				
			//	console.log(a.type + " collides with " + b.type);
			}
			
		}
	}
	
};

function areColliding(a, b, ar, br) {
	var dx2 = (a.x - b.x) * (a.x - b.x);
	var dy2 = (a.y - b.y) * (a.y - b.y);
	var dr2 = (ar + br) * (ar + br);
	return (dx2 + dy2 > dr2) ? false : true;
}



Collisions.prototype.checkActorBounds = function() {
	
	for(var i = 0; i < this.actors.length; i++) {
		var a = this.actors[i];
		var res = this.inBounds(a.nextpos, a.minBound);
		// console.log(res);
		a.bumping = res;
		if(res != 0) {
			// fix actor...
			
			// console.log(a.type + ' is out of bounds');
			
			// really dumb, just don't let them move...
			if(res & COL_X) a.nextpos.x = a.position.x;
			if(res & COL_Y) a.nextpos.y = a.position.y;
			
			
			
			
		};
		
	};
	
}

// be really dumb for now
Collisions.prototype.inBounds = function(pt, r) {
	//console.log(this.emptyRects.length);
	var res = 0;
	for(var i = 0; i < this.emptyRects.length; i++) { 
		var bb = this.emptyRects[i];
	//	if(log) console.log(pt.x + ' ' + pt.y + ' ' + r);
		if(pt.x - r < bb.l) res |= COL_LEFT;
		if(pt.x + r > bb.r) res |= COL_RIGHT;
		if(pt.y - r < bb.t) res |= COL_TOP;
		if(pt.y + r > bb.b) res |= COL_BOTTOM;
	}
	return res;
};





// be really dumb for now
Collisions.prototype.subtractStaticRect = function(r) {
	this.emptyRects.push(rectc(r));
};



Collisions.prototype.addActor = function(obj) {
	if(typeof obj != 'object')
		return this.actors.push(obj);
	
	this.actors = this.actors.concat(obj);
};




















