var canvas,ctx;
var width,height;
var grid;
var myhue;

function randrange(min,max) {
	var range = max-min;
	return Math.random()*range + min;
}

function setBackground(color) {
	document.body.style.backgroundColor = color;
};

function getLatestTiles() {
	$.ajax({
		dataType: "json",
		url: "getBlocks",
	}).always(function(data){
		console.log("getBlocks always:");
		console.log(data);
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
		tile.toggleSelect();
		tile.hue = myhue;
		setBackground(tile.getBgColor());
		$.ajax({
			dataType: "json",
			url: "clickBlock?x="+col+"&y="+row,
		});
	},
};
var hue = Math.random()*360;

function Tile(light,light_range,light_speed) {
	var num = 3;
	this.hue = Math.round(randrange(0,num))*(360/num);
	this.saturation = 0;
	this.light = light;
	this.light_offset = 0;
	this.light_range = light_range;
	this.light_speed = light_speed;
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
		light *= this.selected ? 0.9 : 0.5;
		var sat = this.selected ? 100 : 0;
		return husl.toHex(this.hue,sat,light*0.9);
	},
	getBgColor: function() {
		var light = this.getLight();
		//return tinycolor({h:this.hue, s:50, v:light}).toHexString();
		return husl.toHex(this.hue,70,light*0.9);
	},
	toggleSelect: function() {
		this.selected = !this.selected;
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

	var margin = 1;

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

	$.ajax({
		dataType: "json",
		url: "getInitialColor",
	}).done(function(data){
		console.log("getInitialColor done:",data);
		myhue = data.color;
	}).fail(function(data){
		console.log("getInitialColor fail:",data);
		myhue = 0;
	}).always(function(data){
		console.log("getInitialColor always:",data);

		// Initialize everything.
		grid = new Grid(11,11);
		setupInput();
		fullscreen();
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
}
