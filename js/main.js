'use strict';

Physijs.scripts.worker = '../lib/Physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

var initScene, render, box, loader, renderer, scene, ground_material, ground, light, camera;

var camera, outerCamera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;
var domEvents;
var activeCamera;
var force, offset;
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

	// var hemisphereLight = new THREE.HemisphereLight(0xffe6c9, 0x474747, .2);

	// hemisphereLight.position.set( 25, 67, 10 );

	// var spotLight1 = new THREE.SpotLight(0xffffff, .15, 0, .59, 1, 2);
 //    spotLight1.position.set(-50, 52, -31);
 //    spotLight1.castShadow = true;
 //    scene.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xffffff, .15, 0, .234, 1, 2);
    spotLight2.position.set(20, 80, -36);
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
	spotLight2.shadow.mapSize.height = 1024;

	spotLight2.shadow.camera.near = 1;
	spotLight2.shadow.camera.far = 200;
	spotLight2.shadow.camera.fov = 30;

    scene.add(spotLight2);

	// scene.add(hemisphereLight);

	// var ambientLight = new THREE.AmbientLight(0xaaaaaa, .97);
	// ambientLight.position.set( 20,-55,-20 );
	// scene.add(ambientLight);

	var groundMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, 
        emissive: 0xfcc8ed,
        metalness: 0,
        roughness: 0,
        side: THREE.DoubleSide
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

	for (var obj in MODEL_DATA) {
	    if (MODEL_DATA.hasOwnProperty(obj)) {
            let fruit = CreateFruit(MODEL_DATA[obj].geometry, MATERIALS['banana'].clone());
	        // need to add sound

            LOADED_OBJECTS[MODEL_DATA[obj].key] = fruit;
        }
    }

    const ROWS = 3;
	const COLS = 4;
	const SP = 10;

    for (let i = 0; i < ACTIVE_KEYS.length; i++) {
	    let k = ACTIVE_KEYS[i];

	    let r = i / ROWS;
	    let c = i % COLS;

        let x = SP * (r - Math.floor(ROWS / 2));
        let z = SP * (c - Math.floor(COLS / 2));

	    let fruit = LOADED_OBJECTS[k];
        fruit.mesh.position.set(x, 0, z);
        scene.add(fruit.mesh);
        fruit.defineConstraint();
    }

    document.addEventListener('keydown', (e) => {
        if ( !e.metaKey ) {
            e.preventDefault();
        }

        let key = codeToKey(e.keyCode);
        if (key) {
            let obj = LOADED_OBJECTS[key];
            if (obj) {
                obj.play();
            }
        }
    });

	scene.simulate();
	
    window.addEventListener('resize', resize);
    loop();
}