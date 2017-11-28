'use strict';

Physijs.scripts.worker = '../bower_components/Physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

var initScene, render, box, loader,
		renderer, scene, ground_material, ground, light, camera;

var camera, outerCamera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;
var domEvents;
var activeCamera;
var force, offset;
var jelly;
var boxes = [], fruits = [];

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// placeholder for now before figuring out how to structure Camera class
function updateCamera() {
    if (pov) {
        camera.position.copy(Avatar.position).add(new THREE.Vector3(0, 5, 10));
    } else {
        camera.lookAt(Avatar.position);
        camera.position.copy(Avatar.position).sub(new THREE.Vector3(0, 10, -10));
    }
}

function toggleCamera(){
	activeCamera = (activeCamera == camera) ? outerCamera : camera;
}

function update() {	
	TWEEN.update();
}

function loop() {
    update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

function init() {
    var container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xbfe7ff);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .0001, 10000);
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -60, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 1 );
			// physics_stats.update();
		}
	);

    scene.add(camera);

    // scene.fog = new THREE.FogExp2(0x8adcff, .015);

    var sphere = new THREE.Mesh(new THREE.SphereGeometry(.5), new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)}));

	var hemisphereLight = new THREE.HemisphereLight(0xffe6c9, 0x474747, .2);

	hemisphereLight.position.set( 25, 67, 10 );

	var shadowLight = new THREE.DirectionalLight(0xfff9ed, .45);

	shadowLight.position.set(-35, 25, -15);

	// shadowLight.castShadow = true;

	// shadowLight.shadow.camera.left = -25;
	// shadowLight.shadow.camera.right = 25;
	// shadowLight.shadow.camera.top = 25;
	// shadowLight.shadow.camera.bottom = -25;
	// shadowLight.shadow.camera.near = .01;
	// shadowLight.shadow.camera.far = 500;

	// shadowLight.shadow.mapSize.width = 512;
	// shadowLight.shadow.mapSize.height = 512;

	var helper = new THREE.CameraHelper( shadowLight.shadow.camera );
	scene.add( helper );

	scene.add(hemisphereLight);
	scene.add(shadowLight);

	var ambientLight = new THREE.AmbientLight(0xaaaaaa, .97);
	ambientLight.position.set( 20,-55,-20 );
	scene.add(ambientLight);

	var groundMat = new THREE.MeshPhongMaterial({
        color: 0xf4ade4, 
        shading: THREE.FlatShading,
        shininess: 20,
    });

	ground_material = Physijs.createMaterial(
		groundMat,
		1., // high friction
		1. // low restitution
	);
	
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add(ground);	

	var linear_lower = new THREE.Vector3(0, -5, 0),
		linear_upper = new THREE.Vector3(-10, -5, 0);

	// for (var i=0; i<5; i++){
	// 	var x = 10*(i-Math.floor(5/2));
	// 	var pos = new THREE.Vector3(x, 6, 0);
	// 	boxes[i] = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone(), pos);
	// 	scene.add(boxes[i].mesh);
	// 	boxes[i].defineConstraint();
	// 	boxes[i].pop();
	// }

	var rows = 3, cols = 3;
	var sp = 10;
	var index = 0;
	for (var i=0; i<rows; i++){
		for(var j=0; j<cols; j++){
			var texture, fruit;
			switch(index){
				case(0):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(1):
					texture = TEXTURE_DATA['banana'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(2):
					texture = TEXTURE_DATA['apple'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(3):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(4):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(5):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(6):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(7):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
				case(8):
					texture = TEXTURE_DATA['blueberry'];
					fruit = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone());
					break;
			}
			var c = CreateStaticCube(5, texture);
			var x = sp*(i-Math.floor(rows/2)),
			y = 3,
			z = sp*(j-Math.floor(cols/2));

			c.mesh.position.set(x, y, z);
			boxes.push(c);
			scene.add(c.mesh);

			fruit.mesh.position.set(x, 0, z);
			fruits.push(fruit);
			scene.add(fruit.mesh);
			fruit.defineConstraint();
			index++;
		}
	}

	// jelly = new THREE.Mesh(MODEL_DATA['jelly'].geometry, MATERIALS['bubbleGum'].clone());
	// jelly.position.set(0, 1, 0);
	// jelly.geometry.computeVertexNormals();
	// scene.add(jelly);

	// var box = new THREE.Mesh(MODEL_DATA['banana_cube'].geometry, MATERIALS['blueberry'].clone());
	// scene.add(box);

	scene.simulate();
	
    window.addEventListener('resize', resize);
    loop();
}