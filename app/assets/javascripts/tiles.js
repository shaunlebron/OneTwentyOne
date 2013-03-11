var roomKey;
var canvas,ctx;
var width,height;
var grid;
var myhue;

var parentElement;

function Tweener(value) {
	this.setValueAndTarget(value);
};
Tweener.prototype = {
	setValue: function(value) {
		this.value = value;
		this.updateDirection();
	},
	updateDirection: function() {
		this.dir = (this.target < this.value) ? -1 : 1;
	},
	setValueAndTarget: function(value) {
		this.value = this.target = value;
		this.dir = 0;
	},
	setTarget: function(target, speed) {
		this.target = target;
		this.speed = speed;
		this.updateDirection();
	},
	update: function(dt) {
		if (this.value == this.target) {
			return;
		}
		this.value += this.dir * this.speed * dt;
		if ((this.dir < 0 && this.value <= this.target) ||
			(this.dir > 0 && this.value >= this.target)) {
			this.value = this.target;
		}
	},
};

function randrange(min,max) {
	var range = max-min;
	return Math.random()*range + min;
}

function setBackground(color) {
	parentElement.style.backgroundColor = color;
};

// from: http://stackoverflow.com/a/5158301/142317
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
roomKey = getParameterByName("roomKey");
console.log("roomKey:",roomKey);

function getLatestTiles() {
	$.ajax({
		dataType: "json",
		url: "getBlocks?roomKey="+roomKey,
	}).done(function(data){
		grid.updateFromServerData(data);
	}).fail(function(data){
		console.error("getBlocks fail");
	}).always(function(data){
		setTimeout(getLatestTiles, 3000);
	});
};

function Grid(r,c) {
	this.tiles = [];
	this.rows = r;
	this.cols = c;
	this.aspect = c/r;

	var len = r*c;
	var light,light_range,light_speed;
	for (i=0; i<len; i++) {
		light = randrange(200,255);
		light_range = randrange(10,20);
		light_speed = randrange(10,40) * (Math.random() < 0.5 ? -1 : 1);
		this.tiles.push(new Tile(light,light_range,light_speed));
	}
};

Grid.prototype = {
	draw: function() {
		var x,y;
		var w = width/this.cols;
		var h = height/this.rows;
		var i=0;
		for (y=0; y<this.rows; y++) {
			for (x=0; x<this.cols; x++) {
				ctx.fillStyle = this.tiles[i].getColor();
				i++;
				ctx.fillRect(x*w,y*h,w,h);
			}
		}
	},
	update: function(dt) {
		var i,len=this.tiles.length;
		for (i=0; i<len; i++) {
			this.tiles[i].update(dt);
		}
	},
	touch: function(x,y) {
		var size = height / this.rows;
		var row = Math.floor(y / size);
		var col = Math.floor(x / size);
		var i = row*this.cols + col;
		var tile = this.tiles[i];
		tile.touch();
		setBackground(tile.getBgColor());
		$.ajax({
			dataType: "json",
			url: "clickBlock?x="+col+"&y="+row+"&roomKey="+roomKey,
		});
	},
	clearTiles: function() {
		var i,len=this.tiles.length;
		for (i=0; i<len; i++) {
			this.tiles[i].updateHueFromServer(-1);
		}
	},
	updateFromServerData: function(data) {
		var blocks = data.blocks;
		var bgHue = data.prominent;
		if (bgHue != null) {
			var bgColor = husl.toHex(bgHue,70,70);
			setBackground(bgColor);
		}

		this.clearTiles();
		var x,y,i;
		var prop,propStr,value;
		var hue;
		for (propStr in blocks) {
			value = blocks[propStr];
			if (blocks.hasOwnProperty(propStr)) {
				prop = $.parseJSON(propStr);
				if (prop) {
					x = prop[0];
					y = prop[1];
					i = y * this.cols + x;
					hue = value;
					this.tiles[i].updateHueFromServer(hue);
				}
				else {
					console.error("could not interpret block property string:",propStr);
				}
			}
		}
	},
};
var hue = Math.random()*360;

function Tile(light,light_range,light_speed) {

	this.light = light;
	this.light_offset = 0;
	this.light_range = light_range;
	this.light_speed = light_speed;

	// Create tween target constants.
	this.selectedLightFrac = 0.9;
	this.unselectedLightFrac = 0.5;
	this.selectedSat = 100;
	this.unselectedSat = 0;

	// Create tween objects for saturation, hue, and light fraction.
	this.satTween = new Tweener(this.unselectedSat);
	this.hueTween = new Tweener(Math.random()*360);
	this.lightFracTween = new Tweener(this.unselectedLightFrac);
};

Tile.prototype = {
	getLight: function() {
		var light = this.light + this.light_offset;
		light = Math.max(0,light);
		light = Math.min(255,light);
		light = light / 255 * 100;
		return light;
	},
	getColor: function() {
		var light = this.getLight();
		//light *= this.selected ? 0.9 : 0.5;
		//var sat = this.selected ? 100 : 0;
		return husl.toHex(
			this.hueTween.value,
			this.satTween.value,
			light * this.lightFracTween.value * 0.9);
	},
	getBgColor: function() {
		var light = this.getLight();
		return husl.toHex(
			this.hueTween.target,
			70,
			light*0.9);
	},

	// helper functions for fading or setting color values.
	fadeToSat: function(sat) {
		this.satTween.setTarget(sat, randrange(30,50));
	},
	fadeToHue: function(hue) {
		this.hueTween.setTarget(hue, randrange(100,200));
	},
	fadeToLightFrac: function(lightFrac) {
		this.lightFracTween.setTarget(lightFrac, randrange(0.3,0.5));
	},
	setHue: function(hue) {
		this.hueTween.setValueAndTarget(hue);
	},
	setSat: function(sat) {
		this.satTween.setValueAndTarget(sat);
	},
	setLightFrac: function(lightFrac) {
		this.lightFracTween.setValueAndTarget(lightFrac);
	},

	// When touching a tile, we want it immediately set.
	touch: function() {
		if (this.selected) {
			// switch off
			this.setSat(this.unselectedSat);
			this.setLightFrac(this.unselectedLightFrac);
			this.select(false);
		}
		else {
			// switch on
			this.updateHueFromServer(myhue);
			this.setSat(this.selectedSat);
			this.setLightFrac(this.selectedLightFrac);
			this.setHue(myhue);
			this.select(true);
		}
	},

	// When updating from server, we want to fade the result to the screen.
	updateHueFromServer: function(hue) {
		if (hue < 0) {
			// fade out
			this.fadeToSat(this.unselectedSat);
			this.fadeToLightFrac(this.unselectedLightFrac);
			this.select(false);
		}
		else {
			// fade in
			this.fadeToSat(this.selectedSat);
			this.fadeToLightFrac(this.selectedLightFrac);
			this.fadeToHue(hue);
			this.select(true);
		}
	},

	select: function(on) {
		this.selected = on;
	},

	update: function(dt) {
		this.light_offset += this.light_speed*dt;
		if (Math.abs(this.light_offset) > this.light_range) {
			this.light_offset -= this.light_speed * dt;
			this.light_speed *= -1;
		}
		this.hueTween.update(dt);
		this.satTween.update(dt);
		this.lightFracTween.update(dt);
	},
};

function getParentSize() {
	var s = {
		w: parentElement.clientWidth,
		h: parentElement.clientHeight,
	};
	s.aspect = s.w / s.h;
	return s;
}

function fitCanvasToScreen() {
	var parentSize = getParentSize();
	console.log(parentSize);

	if (parentSize.aspect > grid.aspect) {
		height = parentSize.h;
		width = height * grid.aspect;
	}
	else {
		width = parentSize.w;
		height = width / grid.aspect;
	}

	var margin = 1;

	width -= 2*margin*width/grid.cols;
	height -= 2*margin*height/grid.rows;

	canvas.width = width;
	canvas.height = height;
	center();
}

var center = function() {
	var parentSize = getParentSize();
	canvas.style.position = "relative";
	canvas.style.top = (parentSize.h/2 - height/2) + "px";
	canvas.style.left = (parentSize.w/2 - width/2) + "px";
};

window.addEventListener("resize", function() {
	fitCanvasToScreen();
	grid.draw();
}, false);

var time,lastTime,minFps=20;
function tick(time) {
	try {
		var dt;
		if (lastTime == undefined) {
			dt = 0;
		}
		else {
			dt = Math.min((time-lastTime)/1000, 1/minFps);
		}
		lastTime = time;

		grid.update(dt);
		grid.draw();
		requestAnimationFrame(tick);
	}
	catch (e) {
		console.error(e.message + "@" + e.sourceURL);
		console.error(e.stack);
	}
};


window.addEventListener("load",function() {
	parentElement = document.getElementById('canvas-container');
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	$.ajax({
		dataType: "json",
		url: "getInitialColor?roomKey="+roomKey,
	}).done(function(data){
		myhue = data.color;
	}).fail(function(data){
		console.error("getInitialColor fail:",data);
		myhue = Math.random()*360;
	}).always(function(data){

		// Initialize everything.
		grid = new Grid(11,11);
		setupInput();
		fitCanvasToScreen();
		requestAnimationFrame(tick);
		getLatestTiles();
	});
});

function setupInput() {
	function getCanvasPos() {
		var p = {x:0,y:0};
		var obj = canvas;
		var addOffset = function(obj) {
			p.x += obj.offsetLeft;
			p.y += obj.offsetTop;
		};
		addOffset(obj);
		while (obj = obj.offsetParent) {
			addOffset(obj);
		}
		return p;
	};
	function wrapFunc(f) {
		return function(evt) {
			var canvasPos = getCanvasPos();
			var p = {x:canvasPos.x, y:canvasPos.y};
			var x,y;
			if (evt.touches && evt.touches.length > 0) {
				x = evt.touches[0].pageX;
				y = evt.touches[0].pageY;
			}
			else {
				x = evt.pageX;
				y = evt.pageY;
			}
			p.x = x - p.x;
			p.y = y - p.y;
			f(p.x,p.y);
		};
	};
	function touchStart(x,y) {
		grid.touch(x,y);
	};
	canvas.addEventListener('mousedown',	wrapFunc(touchStart));
	//canvas.addEventListener('touchstart',	wrapFunc(touchStart));

	// from: https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	function toggleFullScreen(elm) {
		if (!document.fullscreenElement &&    // alternative standard method
				!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
			if (elm.requestFullscreen) {
				elm.requestFullscreen();
			} else if (elm.mozRequestFullScreen) {
				elm.mozRequestFullScreen();
			} else if (elm.webkitRequestFullscreen) {
				elm.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}
	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) { // enter key
			toggleFullScreen(parentElement);
		}
	},false);
}
