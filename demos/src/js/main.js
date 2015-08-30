/** Measures the arctangent between two points (the angle required for one point to face another). */
function angleTo(a, b){
	return (Math.atan2(b[1] - a[1], a[0] - b[0])) * 180 / Math.PI;
}

/** Measures the distance between two points. */
function distance(a, b){
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/** Converts radians to degrees. */
function radToDeg(value){
	return value * 180 / Math.PI;
}

/** Converts degrees to radians. */
function degToRad(value){
	return value * Math.PI / 180;
}

/** Draws a pixel onto a canvas drawing context at the designated coordinates. */
CanvasRenderingContext2D.prototype.setPixel	=	function(x, y, colour){
	var data	=	this.getImageData(x, y, 1, 1);
	if(colour instanceof Array){
		data.data[0]	=	colour[0] || 0x00,
		data.data[1]	=	colour[1] || 0x00,
		data.data[2]	=	colour[3] || 0x00,
		data.data[3]	=	colour[4] || 0x00;
	}
	else{
		colour >>>= 0;
		data.data[0]	=	(colour & 0xFF0000) >> 16,
		data.data[1]	=	(colour & 0x00FF00) >> 8,
		data.data[2]	=	(colour & 0x0000FF) >> 0,
		data.data[3]	=	255;
	}
	this.putImageData(data, x, y);
};
CanvasRenderingContext2D.prototype.getPixel	=	function(x, y){
	return this.getImageData(x, y, 1, 1).data;
};

/** Lazy wrapper for CanvasRenderingContext2D.setPixel(x, y, 0x000000); */
CanvasRenderingContext2D.prototype.dot	=	function(x, y){
	this.setPixel(x, y, 0x000000);
};



Array.prototype.forEach.call(document.all, function(o){
	Object.defineProperty(o, "x", {
		get:	function()	{	return parseFloat(this.style.left || window.getComputedStyle(this).left) || 0;	},
		set:	function(i)	{	this.style.left	=	i + "px";		}
	});

	Object.defineProperty(o, "y", {
		get:	function()	{	return parseFloat(this.style.top || window.getComputedStyle(this).top) || 0;	},
		set:	function(i)	{	this.style.top	=	i + "px";		}
	});
	
	var rotation	=	0;

	Object.defineProperty(o, "rotation", {
		get:	function()	{	return rotation;	},
		set:	function(i)	{	rotation = i; this.style.webkitTransform = "rotate(" + i + "deg)";}
	});
});


var javelin	=	document.getElementById("javelin");
if(javelin){
	Object.defineProperty(javelin, "length", {
		get:	function()	{	return parseFloat(this.style.width || window.getComputedStyle(this).width || 0); },
		set:	function(i)	{	this.style.width = i + "px"; }
	});

	javelin.face	=	function(){
		this.rotation	=	180 - angleTo(javelin, b);
	};

	javelin.throw	=	function(){
		this.length	=	distance(a, b);
	};
}




var Point	=	function(x, y){
	var src	=	arguments[0];

	/** Create from an Array. */
	if(src instanceof Array){
		x	=	src[0];
		y	=	src[1];
	}

	/** Create from a DOM element. */
	else if(src instanceof HTMLElement){
		x	=	"x" in src ? src.x : src.offsetLeft;
		y	=	"y" in src ? src.y : src.offsetTop;
	}

	this.x	=	this[0]	=	x;
	this.y	=	this[1]	=	y;
};
Point.makeArray	=	function(input){
	var output	=	[];
	for(var i = 0; i < input.length; ++i)
		output.push(new Point(input[i]));
	return output;
};




/** Canvas drawin' shit begins here. */
var tracingPaper	=	document.getElementById("tracing-paper");
	tracingPaper.width	=	screen.availWidth;
	tracingPaper.height	=	screen.availHeight;

var pad			=	tracingPaper.getContext("2d");
pad.clear		=	function(){
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};





function doThatShit(){
	var delta		=	Math.round(distance(a, b)),
		duration	=	0;

	for(var p, i = 0; i < delta; ++i){
		p	=	i / delta;

		(function(p){
			setTimeout(function(){
				var x	=	a.x + ((b.x - a.x) * p);
				var y	=	a.y + ((b.y - a.y) * p);
				pad.setPixel(x, y, 0x000000);
			}, p * duration);
		}(p));
	}
}



function circle(x, y, radius, degrees){
	var	radius	=	radius	|| 100,
		degrees	=	degrees	|| 360,
		i		=	0, t;

	for(; i < degrees; ++i){

		/** Convert degrees to radians. */
		t	=	i * Math.PI / 180;

		pad.setPixel(
			x + Math.sin(t) * radius,	// X coordinate
			y + Math.cos(t) * radius,	// Y coordinate
		0x000000);
	}
}



function ellipse(x, y, width, height, degrees){
	var	width	=	width	|| 100,
		height	=	height	|| 100,
		degrees	=	degrees	|| 360,
		i		=	0, t;

	for(; i < degrees; ++i){

		/** Convert degrees to radians. */
		t	=	i * Math.PI / 180;

		pad.setPixel(
			x + Math.sin(t) * width,	// X coordinate
			y + Math.cos(t) * height,	// Y coordinate
		0x000000);
	}
}


/** Applies De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
function deCasteljau(points, p){
	var a, b, i, p	=	p || .5,
		midpoints	=	[];


	while(points.length > 1){

		for(i = 0; i < points.length - 1; ++i){
			a	=	points[i];
			b	=	points[i+1];

			midpoints.push([
				a[0] + ((b[0] - a[0]) * p),
				a[1] + ((b[1] - a[1]) * p)
			]);
		}

		points		=	midpoints;
		midpoints	=	[];
	}

	return [points[0], a, b];
}



function curve(){
	var mid, i, delta	=	0;
	for(i = 0; i < arguments.length - 1; ++i)
		delta	+=	distance(arguments[i], arguments[i+1]);

	for(i = 0; i < delta; ++i){
		mid		=	deCasteljau(arguments, i / delta);
		pad.dot(mid[0][0], mid[0][1]);
	}
}

function _connect(){
	pad.moveTo(arguments[0][0], arguments[0][1]);
	for(var i = 0; i < arguments.length; ++i)
		pad.lineTo(arguments[i][0], arguments[i][1]);
	pad.stroke();
}

var curves	=	document.getElementsByClassName("curve");
for(var p, i = 0; i < curves.length; ++i){
	p	=	Point.makeArray(curves[i].children);
	
	pad.strokeStyle	=	"#aaa";
	_connect.apply(window, p);
	pad.strokeStyle	=	"#000";
	curve.apply(window, p);
}


function rail(subject, curve, delay){
	var mid, offset, i, delta	=	0;
	for(i = 0; i < curve.children.length - 1; ++i)
		delta	+=	distance(curve.children[i], curve.children[i+1]);

	var points	=	Point.makeArray(curve.children);
	for(i = 0; i < delta; ++i){
		mid		=	deCasteljau(points, i / delta)[0];
		offset	=	deCasteljau(points, (i+1) / delta)[0];

		(function(i, mid, offset){
			setTimeout(function(){
				subject.rotation	=	180 - angleTo(mid, offset);
				subject.x			=	mid[0];
				subject.y			=	mid[1];
				
				b.x		=	offset[0];
				b.y		=	offset[1];
				
			}, delay * i);
		}(i, mid, offset));
	}
}

rail(tangent, curves[0], 10);