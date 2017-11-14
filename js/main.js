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
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 1 );
			// physics_stats.update();
		}
	);

    scene.add(camera);

    scene.fog = new THREE.FogExp2(0x8adcff, .015);

	var directionalLight = new THREE.DirectionalLight(0xfff4f6, .7);
	directionalLight.position.set(-5, 5, 1);
	directionalLight.castShadow = true;
	var ambientLight = new THREE.AmbientLight(0xfa7cf2);
	var pointLights = [];
	var decayDist = 100;
	pointLights[0] = new THREE.PointLight(0xffffff, 1, decayDist);
	pointLights[1] = new THREE.PointLight(0xffffff, 1, decayDist);
	pointLights[2] = new THREE.PointLight(0xffffff, 1, decayDist);

	pointLights[0].position.set(0, 50, 50);
	pointLights[1].position.set(-50, 0, 50);
	pointLights[2].position.set(50, -50, 50);

	scene.add(ambientLight);
	scene.add(directionalLight);

	// Ground
	ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial(),
		.8, // high friction
		.3 // low restitution
	);
	
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add(ground);	

	var mat = new THREE.MeshBasicMaterial();
	var pos = new THREE.Vector3(0, 0, 0);
	box = CreateCube(MODEL_DATA['banana'].geometry, mat, pos);
	scene.add(box.mesh);

	scene.simulate();
	// window.addEventListener('mousedown', function(){
	// 	box.applyImpulse(force, offset);
	// });
    window.addEventListener('resize', resize);
    loop();
}