"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Clock exercise: rotate hands correctly
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, dat, $*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	var faceMaterial = new THREE.MeshLambertMaterial( { color: 0xFFECA9 } );
	var markMaterial = new THREE.MeshLambertMaterial( { color: 0x89581F } );
	var mark12Material = new THREE.MeshLambertMaterial( { color: 0xE6880E } );
	var minuteHandMaterial = new THREE.MeshLambertMaterial( { color: 0x226894 } );
	var hourHandMaterial = new THREE.MeshLambertMaterial( { color: 0xE02BFB } );

	// clock
	var clock = new THREE.Mesh(
		new THREE.CylinderGeometry( 75, 75, 10, 32 ), faceMaterial );
		//new THREE.CubeGeometry( 150, 5, 150 ), faceMaterial );
	clock.position.y = 5;
	scene.add( clock );

	// marks
	var cube = new THREE.Mesh(
		new THREE.CubeGeometry( 20, 4, 15 ), mark12Material );
	cube.position.x = 60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.x = -60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.z = 60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.z = -60;
	cube.position.y = 9;
	scene.add( cube );

  // YOUR CODE HERE:
  // The dimensions and rotation angles of the hands are correct
  // you just have find a way to perform them in the correct order

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 70, 4, 4 ), minuteHandMaterial );
	cube.position.y = 14;
	cube.position.x = 70/2 - 10;
	
	var minuteHand = new THREE.Object3D();
	minuteHand.add( cube );
	minuteHand.rotation.y = -60 * Math.PI / 180;

	scene.add(minuteHand );

	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry( 0.5, 32, 16 ), hourHandMaterial );
	sphere.position.y = 18;	// move the hand above the other hand
	sphere.position.x = 50/2 - 10;

	sphere.scale.x = 50;
	sphere.scale.y = 4;
	sphere.scale.z = 4;

	var hourHand = new THREE.Object3D();
	hourHand.add( sphere );
	hourHand.rotation.y = 30 * Math.PI/180;

	scene.add( hourHand );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 30, canvasRatio, 1, 10000 );
	camera.position.set( -420, 400, 100 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	fillScene();

}
function drawHelpers() {
	if (ground) {
		Coordinates.drawGround({size:10000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
		drawHelpers();
	}
	renderer.render(scene, camera);
}



function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	var gui = new dat.GUI();
	gui.add( effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}

try {
	init();
	setupGui();
	drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}

