var canvas,ctx;
var width,height;
var grid;

function randrange(min,max) {
	var range = max-min;
	return Math.random()*range + min;
}

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
		for (x=0; x<this.cols; x++) {
			for (y=0; y<this.rows; y++) {
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
		//console.log(x,y,row,col);
	},
};

function Tile(light,light_range,light_speed) {
	this.light = light;
	this.light_offset = 0;
	this.light_range = light_range;
	this.light_speed = light_speed;
};

Tile.prototype = {
	getColor: function() {
		var c = this.light + this.light_offset;
		c = Math.max(0,c);
		c = Math.min(255,c);
		return tinycolor({r:c,g:c,b:c}).toHexString();
	},
	update: function(dt) {
		this.light_offset += this.light_speed*dt;
		if (Math.abs(this.light_offset) > this.light_range) {
			this.light_offset -= this.light_speed * dt;
			this.light_speed *= -1;
		}
	},
};

function fullscreen() {
	var windowAspect = window.innerWidth / window.innerHeight;


	var canvasAspect = grid.aspect;
	if (windowAspect > canvasAspect) { // window
		height = window.innerHeight;
		width = height * canvasAspect;
	}
	else {
		width = window.innerWidth;
		height = width / canvasAspect;
	}

	var margin = 1.5;

	width -= 2*margin*width/grid.cols;
	height -= 2*margin*height/grid.rows;

	canvas.width = width;
	canvas.height = height;
	center();
}

var center = function() {
	document.body.style.marginTop = (window.innerHeight - height)/2 + "px";
	document.body.style.marginLeft = (window.innerWidth - width)/2 + "px";
};

window.addEventListener("resize", function() {
	fullscreen();
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
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	grid = new Grid(11,11);
	setupInput();
	fullscreen();
	requestAnimationFrame(tick);
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
	canvas.addEventListener('touchstart',	wrapFunc(touchStart));
}

