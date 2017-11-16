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
var boxes = [];

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

    camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, .0001, 10000);
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

	var directionalLight = new THREE.DirectionalLight(0xfff4f6, .7);
	directionalLight.position.set(-5, 5, 1);
	directionalLight.castShadow = true;
	var ambientLight = new THREE.AmbientLight(0xfa7cf2);
	var pointLights = [];

	var distDecay = 20, decay = 2;
	pointLights[0] = new THREE.PointLight(0xffffff, 1, distDecay, decay);
	pointLights[1] = new THREE.PointLight(0xffffff, 1, distDecay, decay);
	pointLights[2] = new THREE.PointLight(0xffffff, 1, distDecay, decay);

	pointLights[0].position.set(-5, 10, 10);
	pointLights[1].position.set(-15, 5, 7);
	pointLights[2].position.set(15, 10, -5);

	for (var i=0; i<pointLights.length; i++){
		scene.add(pointLights[i]);
		var s = sphere.clone();
		var p =pointLights[i].position;
		s.position.set(p.x, p.y, p.z);
		scene.add(s);
	}

	scene.add(ambientLight);
	scene.add(directionalLight);

	// Ground
	var mat = new THREE.MeshBasicMaterial();
	ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial(),
		1., // high friction
		1. // low restitution
	);
	
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		mat,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add(ground);	

	var linear_lower = new THREE.Vector3(0, -5, 0),
		linear_upper = new THREE.Vector3(-10, -5, 0);

	for (var i=0; i<5; i++){
		var x = 10*(i-Math.floor(5/2));
		var pos = new THREE.Vector3(x, 6, 0);
		boxes[i] = CreateCube(MODEL_DATA['banana'].geometry, MATERIALS['bubbleGum'].clone(), pos);
		scene.add(boxes[i].mesh);
		boxes[i].defineConstraint();
	}

	scene.simulate();
	
    window.addEventListener('resize', resize);
    loop();
}