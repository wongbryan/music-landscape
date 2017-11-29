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

    var spotLight2 = new THREE.SpotLight(0xffffff, .15, 0, .234, 1, 2);
    spotLight2.position.set(20, 80, -36);
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
	spotLight2.shadow.mapSize.height = 1024;

	spotLight2.shadow.camera.near = 1;
	spotLight2.shadow.camera.far = 200;
	spotLight2.shadow.camera.fov = 30;

    scene.add(spotLight2);

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

	for (var obj in MODEL_DATA) {
	    if (MODEL_DATA.hasOwnProperty(obj)) {
            let fruit = CreateFruit(MODEL_DATA[obj].geometry, MATERIALS['banana'].clone());
	        // need to add sound

            KEY_MAPPINGS[MODEL_DATA[obj].key] = {
                fruit: fruit,
                text: null,
                border: null
            };
        }
    }

    const ROWS = 3;
	// const ROW_OFFSET = 1.5;
	const COLS = 4;
	const SP = 4;

    for (let i = 0; i < ACTIVE_KEYS.length; i++) {
	    let k = ACTIVE_KEYS[i];

	    let r = parseInt(i / COLS, 10);
	    let c = parseInt(i % COLS, 10);

        let x = SP * (c - Math.floor(COLS / 2));
        let z = SP * (r - Math.floor(ROWS / 2));
        // x -= (c * ROW_OFFSET);

	    let fruit = KEY_MAPPINGS[k].fruit;
        fruit.mesh.position.set(x, 0, z);
        scene.add(fruit.mesh);
        fruit.defineConstraint();

        let border = CreateBorder();
        border.mesh.position.set(x + 2, 0, z + 2);
        KEY_MAPPINGS[k].border = border;
        scene.add(border.mesh);

        // draw text
        let text = CreateText(k);
        text.mesh.position.set(x - 1, 0.75, z + 1);
        text.mesh.rotation.x = -Math.PI / 2;
        KEY_MAPPINGS[k].text = text;
        scene.add(text.mesh);
    }

    document.addEventListener('keydown', (e) => {
        if ( !e.metaKey ) {
            e.preventDefault();
        }

        let key = codeToKey(e.keyCode);
        if (key) {
            let objs = KEY_MAPPINGS[key];

            if (objs.fruit) {
                objs.fruit.play();
            }
            if (objs.text) {
                objs.text.play();
            }
        }
    });

	scene.simulate();
	
    window.addEventListener('resize', resize);
    loop();
}