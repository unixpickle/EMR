function Point (x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.distance = function (aPoint) {
	return Math.sqrt(Math.pow(aPoint.x - this.x, 2) + Math.pow(aPoint.y - this.y, 2));
}

Point.prototype.add = function (aPoint) {
	return new Point(this.x + aPoint.x, this.y + aPoint.y);
}

Point.prototype.sub = function (aPoint) {
	return new Point(this.x - aPoint.x, this.y - aPoint.y);
}

function pointVector (angle, mag) {
	var x = Math.cos(angle) * mag;
	var y = Math.sin(angle) * mag;
	return new Point(x, y);
}