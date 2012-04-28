function Stage (canvas) {
	this.canvas = canvas;
	this.charges = [];
	this.drag = null;
}

Stage.prototype.netForceOnPoint = function (point) {
	var force = new Point(0, 0);
	for (var i = 0; i < this.charges.length; i++) {
		var charge = this.charges[i];
		force = force.add(charge.forceOnPoint(point, -1));
	}
	return force;
}

Stage.prototype.shouldDrawForceArrow = function (point) {
	for (var i = 0; i < this.charges.length; i++) {
		var charge = this.charges[i];
		if (charge.containsPoint(point)) return false;
	}

	var vec = this.netForceOnPoint(point);
	var startPoint = new Point(point.x - vec.x / 2, point.y - vec.y / 2);
	var endPoint = new Point(point.x + vec.x / 2, point.y + vec.y / 2);
	var mainAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
	var endX = Math.cos(mainAngle) * 6 + endPoint.x;
	var endY = Math.sin(mainAngle) * 6 + endPoint.y;
	var arrowTip = new Point(endX, endY);
	for (var i = 0; i < this.charges.length; i++) {
		var charge = this.charges[i];
		if (charge.containsPoint(startPoint)) return false;
		if (charge.containsPoint(endPoint)) return false;
		if (charge.containsPoint(arrowTip)) return false;
	}

	return true;
}

Stage.prototype.draw = function () {
	var ctx = this.canvas.getContext('2d');
	ctx.fillStyle = '#630';
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
	// draw force arrows
	var spacing = 20;
	for (var x = spacing; x <= this.canvas.width - spacing; x += spacing) {
		for (var y = spacing; y <= this.canvas.height - spacing; y += spacing) {
			var point = new Point(x, y);
			if (this.shouldDrawForceArrow(point)) {
				this.drawForceArrow(point, ctx);
			}
		}
	}
	
	// draw charges
	ctx.fillStyle = '#ACF';
	for (var i = 0; i < this.charges.length; i++) {
		var charge = this.charges[i];
		ctx.beginPath();
		ctx.arc(charge.pos.x, charge.pos.y, charge.radius, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
	}
}

Stage.prototype.drawForceArrow = function (point, ctx) {
	ctx.strokeStyle = '#FFF';
	var vec = this.netForceOnPoint(point);
	var startPoint = new Point(point.x - vec.x / 2, point.y - vec.y / 2);
	var endPoint = new Point(point.x + vec.x / 2, point.y + vec.y / 2);

	ctx.beginPath();
	ctx.moveTo(startPoint.x, startPoint.y);
	ctx.lineTo(endPoint.x, endPoint.y);
	ctx.stroke();
	ctx.closePath();

	// stupid little arrow
	
	// calculate end point
	var mainAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
	var endX = Math.cos(mainAngle) * 6 + endPoint.x;
	var endY = Math.sin(mainAngle) * 6 + endPoint.y;
	
	// calculate side points
	var angle = Math.atan2(-(startPoint.x - endPoint.x), startPoint.y - endPoint.y);
	var xoff = Math.cos(angle) * 3;
	var yoff = Math.sin(angle) * 3;
	
	// fill the arrow
	ctx.fillStyle = '#FFF';
	ctx.beginPath();
	ctx.moveTo(endPoint.x + xoff, endPoint.y + yoff);
	ctx.lineTo(endX, endY);
	ctx.lineTo(endPoint.x - xoff, endPoint.y - yoff)
	ctx.fill();
	ctx.closePath();
}

Stage.prototype.mouseDown = function (event) {
	// find the charge at this point
	var point = new Point(event.offsetX, event.offsetY);
	var charge = null;
	for (var i = 0; i < this.charges.length; i++) {
		var theCharge = this.charges[i];
		if (theCharge.containsPoint(point)) {
			charge = theCharge;
			break;
		}
	}
	if (charge != null) {
		this.drag = new DragContext(charge, point, charge.pos);
	} else {
		this.drag = null;
		stage.charges.push(new Charge(point, 30, 6));
		this.draw();
	}
}

Stage.prototype.mouseDrag = function (event) {
	if (this.drag) {
		var point = new Point(event.offsetX, event.offsetY);
		this.drag.handleDrag(point);
		this.draw();
	}
}

Stage.prototype.mouseUp = function (event) {
	if (this.drag) {
		if (!this.drag.moved) {
			editCharge(this.drag.charge);
		}
	}
	this.drag = null;
}

Stage.prototype.removeCharge = function (charge) {
	var nc = new Array();
	for (var i = 0; i < this.charges.length; i++) {
		if (this.charges[i] != charge) {
			nc.push(this.charges[i]);
		}
	}
	this.charges = nc;
}

function DragContext (charge, pi, ci) {
	this.charge = charge;
	this.pi = pi;
	this.ci = ci;
	this.moved = false;
}

DragContext.prototype.handleDrag = function (point) {
	this.moved = true;
	var center = this.ci.add(point.sub(this.pi));
	this.charge.pos = center;
}