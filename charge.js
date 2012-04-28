function Charge (point, radius, charge) {
	this.charge = charge;
	this.pos = point;
	this.radius = radius;
}

Charge.prototype.containsPoint = function (point) {
	var dist = point.distance(this.pos);
	return (dist < this.radius);
}

Charge.prototype.forceOnPoint = function (point, charge) {
	var x = point.x;
	var y = point.y;
	var k = 10000;
	var angle = Math.atan2(y - this.pos.y, x - this.pos.x);
	var force = k * (charge * this.charge) / Math.pow(point.distance(this.pos), 2);
	return pointVector(angle, force);
}