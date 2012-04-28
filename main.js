var stage = null;

function loadCharges () {
	var canvas = document.getElementById('canvas');
	stage = new Stage(canvas);
	stage.charges.push(new Charge(new Point(200, 200), 30, 6));
	stage.charges.push(new Charge(new Point(400, 200), 30, 6));
	stage.draw();
}

function mouseDown (event) {
	console.log('this is a test');
	stage.mouseDown(event);
}

function mouseMove (event) {
	stage.mouseDrag(event);
}

function mouseUp (event) {
	stage.mouseUp(event);
}