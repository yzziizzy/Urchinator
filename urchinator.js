



/*



otter floating animation

rocks, fish, seaweed, etc

extra leaves on the kelp bases for decoration/deterioration

menu




assets:
	fish
	urchins
	decorations
	menus and gfx

*/


var images = {};


var img_to_load = {
	otter_swimming: 'art/otter-swimming.png',
	otter_floating: 'art/otter-floating.png',
	otter_eating: 'art/otter-eating.png',
	kelp_icon: 'art/kelp-icon.png',
	bubble_icon: 'art/bubble-breath.png',
	sea_urchin_icon: 'art/sea-urchin-icon.png',
	heart: 'art/heart.png',
	bubble: 'art/bubble-effect.png',
	holdfast1_1: 'art/holdfast1-1.png',
	holdfast1_2: 'art/holdfast1-2.png',
	holdfast1_3: 'art/holdfast1-3.png',
	holdfast1_4: 'art/holdfast1-4.png',
	holdfast1_5: 'art/holdfast1-5.png',
	holdfast2_1: 'art/holdfast2-1.png',
	holdfast2_2: 'art/holdfast2-2.png',
	holdfast2_3: 'art/holdfast2-3.png',
	holdfast2_4: 'art/holdfast2-4.png',
	holdfast2_5: 'art/holdfast2-5.png',
	holdfast3_1: 'art/holdfast3-1.png',
	holdfast3_2: 'art/holdfast3-2.png',
	holdfast3_3: 'art/holdfast3-3.png',
	holdfast3_4: 'art/holdfast3-4.png',
	holdfast3_5: 'art/holdfast3-5.png',
}

var _inputdata = {
	pressed: {},
	down: {},
};

$(document).ready(function() {
	
	
	var imgs = Object.keys(img_to_load).length;
	var maxImgs = imgs;
	function loadcb() {
		imgs--;
		$('.loading-progress').css({width: ((maxImgs-imgs)*100)/maxImgs + '%'});
		if(imgs == 0) {
		//	$('.loading').hide();
			$('.loading, .loadbar').hide();
			$('.play').show();
			waitingOnUser = true;
		}
	}
	
	for(var k in img_to_load) {
		images[k] = new Image();
		images[k].onload = loadcb;
		images[k].src = img_to_load[k];
	}
	
		// init input stuff

	$(document).keydown(function(e) {
		_inputdata.down[e.which] = 1;
		_inputdata.down[e.which] |= 0;
		e.preventDefault();
	});
	$(document).keyup(function(e) {
		_inputdata.down[e.which] = 0;
		_inputdata.pressed[e.which] = (_inputdata.pressed[e.which]>>>0) + 1;
		e.preventDefault();
	});
	
	
});

var extStop = false;
var extCallback = function() {};
function newgame(gm) {
	
	extCallback = function() {
		game_lvl = gm;
		extStop = false;
		extCallback = function() {};
		game(game_lvl);
	};
	extStop = true;
}
	
function game(hardness) {
	
	hardness = hardness || 5; 
	
	var runGame = true;
	
	var w = $(window);
	
	var canvas = $('.scribble-canvas');
	
	var ctx = canvas[0].getContext("2d");
				
	
	ctx.drawBox = function(x,y, style, width) {
		this.beginPath();
		this.rect(x - 3, y - 3, 6, 6);
		if(!(width > 1)) width = 1; 
		this.lineWidth = width;
		this.strokeStyle = style;
		this.stroke();
	}
		
	

	
		
	function checkinputs() {
		var curinput = {
			down: _inputdata.down,
			pressed: _inputdata.pressed,
		};
		
 		_inputdata.pressed = {};
// 			pressed: {},
// 			down: {},
// 		};
		return curinput;
	}
	
	
	
// 	w.resize(function(){
// 		canvas.attr({width: w.width(), height: w.height()});
// 	});
// 	w.trigger('resize');
// 	
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame	|| 
			window.webkitRequestAnimationFrame	|| 
			window.mozRequestAnimationFrame		|| 
			window.oRequestAnimationFrame		|| 
			window.msRequestAnimationFrame		|| 
			function(callback){
				window.setTimeout(callback, 1000 / 30);
				};
	})();
			
	function frame(info){
		
		checkVictory();
		checkDefeat();
		checkInterrupt();
	//	info = info || {};
		
		//info.ii 
		var lol = checkinputs();
	//	info.ii = lol;
	//	console.log(lol);
// 	//	console.log(info.ii);
		draw(info, lol);
		
		if(runGame) window.requestAnimFrame(frame);
	}
	
	
	var gameinfo = {
		numUrchins: 1 + hardness,
		numKelps: (3 + hardness * 1.5)|0,
	};
	
	var hud = new HUD();
	
	var collisions = new Collisions();
	
	var splashText = new SplashText();
	var waves = new Waves();
	var mud = new Mud();
	var otters = [];
	var urchins = [];
	var kelps = [];
	var seaweeds = [];
	

	seaweeds.push( new Seaweed({}) );
	otters.push( new Otter({}) );
	
	
	for(var i = 0; i < gameinfo.numUrchins; i++) {
		urchins.push( new Urchin({position: pt(Math.random() * 900 + 50, 200)}) );
	}
	for(var i = 0; i < gameinfo.numKelps; i++) {
		kelps.push( new Kelp({position: pt(Math.random() * 900 + 50, 428)}) );
	}
	
//	boxen.push(new RoundedBox({}));
	
	collisions.subtractStaticRect(rect(0,450,0,1000));
	
	collisions.addActor(urchins);
	collisions.addActor(seaweeds);
	collisions.addActor(otters);
	collisions.addActor(kelps);
	
	hud.addWidget(new HUDHearts(otters[0]), 990 - (6*25), 20);
	hud.addWidget(new HUDBubbles(otters[0]), 10, 20);
	hud.addWidget(new HUDList({
		list: kelps, 
		icon: images.kelp_icon,
		textOffset: pt(2, 35),
		imgScale: .7,
	}), 750, 10);
	hud.addWidget(new HUDList({
		list: urchins, 
		icon: images.sea_urchin_icon,
		textOffset: pt(5, 30),
		imgScale: 1,
	}), 650, 15);
	
	var d = new Date();
	var lastframe = d.getTime();
	
	
	frame();
	
	
	function draw(info, ii) {
		var d = new Date();
		var now = d.getTime();
		
		// time elapsed (since last frame)
		var te = (now - lastframe) / 1000.0;
		lastframe = now;
		
		var w = ctx.canvas.width;
		var h = ctx.canvas.height;
		ctx.clearRect(0, 0, w, h);
		
	//	console.log(ii.pressed);
		
		otters[0].uiDirection.x = 0;
		otters[0].uiDirection.y = 0;
		otters[0].uiAcc = false;
		if(ii.down[37]) {
			//console.log(ii);
			otters[0].uiDirection.x = -1;
			otters[0].uiAcc = true;
		}
		if(ii.down[39]) {
			//console.log(ii);
			otters[0].uiDirection.x = 1;
			otters[0].uiAcc = true;
		}
		if(ii.down[38]) {
			//console.log(ii);
			otters[0].uiDirection.y = -1;
			otters[0].uiAcc = true;
		}
		if(ii.down[40]) {
			//console.log(ii);
			otters[0].uiDirection.y = 1;
			otters[0].uiAcc = true;
		}
		if(ii.pressed[32]) {
			//console.log(ii);
			otters[0].takeBite();
		//	otters[0].dropItem();
		}
		if(ii.down[32]) {
			//console.log(ii);
			otters[0].mouthOpen = true;
		//	otters[0].dropItem();
		}
		else {
			otters[0].mouthOpen = false;
		}
		
		
		splashText.frameMove(te);
		waves.frameMove(te);
		mud.frameMove(te);
		
		// other shit here
 		kelps.map(function(q) { q.frameMove(te) });
 		urchins.map(function(q) { q.frameMove(te) });
 		otters.map(function(q) { q.frameMove(te) });

		seaweeds.map(function(q) { q.frameMove(te) });
		
		collisions.checkActorCollisions();
		collisions.checkActorBounds();
		collisions.frameMove(te);
		
		hud.frameMove(te);
		
		splashText.render(ctx);
		waves.render(ctx);
		mud.render(ctx);
		
		// other shit here
		seaweeds.map(function(q) { q.render(ctx) });
		kelps.map(function(q) { q.render(ctx) });
		urchins.map(function(q) { q.render(ctx) });
		otters.map(function(q) { q.render(ctx) });
		
		hud.render(ctx);
	//	console.log('lol');
	}
	

	function distance(from, to) {
		var x = to.x - from.x;
		var y = to.y - from.y;
		return Math.sqrt(x*x + y*y);
	}
	
	
	
	function checkVictory() {
		var urchinsAlive = 0;
		for(var i = 0; i < urchins.length; i++) {
			if(urchins[i].hp > 0) urchinsAlive++;
		}
		if(urchinsAlive == 0) win();
	}
	
	
	function checkDefeat() {
		var kelpsAlive = 0;
		for(var i = 0; i < kelps.length; i++) {
			if(kelps[i].hp > 0) kelpsAlive++;
		}
		
		var otterDead = false;
		if(otters[0].hp == 0) otterDead = true;
		
		if(otterDead || kelpsAlive == 0) lose();
	}

	function checkInterrupt() {
		if(extStop) {
			runGame = false;
			setTimeout(extCallback, 100);
		}
	}
	

	
	function win() {
		runGame = false;
		game_lvl++;
		waitingOnUser = true;
		$('.victory').show();
	}
	
	function lose() {
		runGame = false;
		waitingOnUser = true;
		$('.defeat').show();
	}
	
	
	
};