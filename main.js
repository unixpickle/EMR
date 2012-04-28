var stage = null;
var currentCharge = null;

function loadCharges () {
	var canvas = document.getElementById('canvas');
	stage = new Stage(canvas);
	stage.charges.push(new Charge(new Point(200, 200), 30, 6));
	stage.charges.push(new Charge(new Point(400, 200), 30, 6));
	stage.draw();
}

function mouseDown (event) {
	stage.mouseDown(event);
}

function mouseMove (event) {
	stage.mouseDrag(event);
}

function mouseUp (event) {
	stage.mouseUp(event);
}

function editCharge (aCharge) {
	currentCharge = aCharge;
	document.getElementById('controls').style.visibility = 'visible';
	document.getElementById('charge_input').value = aCharge.charge + '';
}

function deleteCharge () {
	stage.removeCharge(currentCharge);
	stage.draw();
	currentCharge = null;
	document.getElementById('controls').style.visibility = 'hidden';
}

function doneEdit () {
	currentCharge.charge = parseInt(document.getElementById('charge_input').value);
	currentCharge = null;
	stage.draw();
	document.getElementById('controls').style.visibility = 'hidden';
}