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
var boxes = [], fruits = [], clouds = [], pivots = [];

const WORLD_RADIUS = 150;

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
	for(var i=0; i<pivots.length; i++){
		pivots[i].rotation.y += .001 * pivots[i].speed;
	}

	for(var i=0; i<clouds.length; i++){
		clouds[i].update();
	}

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

    var numClouds = 7+Math.floor(Math.random()*7);
    var numPivots = 3;

    for(var i=0; i<numPivots; i++){
    	pivots[i] = new THREE.Object3D();
    	pivots[i].speed = 1 + Math.random()*2;
    }

    for(var i=0; i<numClouds; i++){
    	var index = Math.floor(Math.random()*numPivots);
    	console.log(index);
   
    	var angle = Math.random()*Math.PI*2;
    	var x = WORLD_RADIUS*Math.cos(angle),
    	y = Math.random()*50+10,
    	z = WORLD_RADIUS*Math.sin(angle)
    	var cloud = CreateCloud(pivots[index], x, y, z);

    	clouds.push(cloud);
    	scene.add(cloud.mesh);
    }


    var sphere = new THREE.Mesh(new THREE.SphereGeometry(.5), new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)}));

    var hemisphereLight = new THREE.HemisphereLight(0xfceafc,0x000000, .8)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	var shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Set the direction of the light  
	shadowLight.position.set(150, 75, 150);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);

	const platformWidth = 40,
	platformDepth = 25, 
	platformHeight = 150;

	// var groundMat = new THREE.MeshPhongMaterial({
 //        color: 0xffc6ff, 
 //        emissive: 0xc195c1,
 //        // metalness: 0,
 //        // roughness: 0,
 //        // side: THREE.DoubleSide
 //    });

 	var groundMat = new THREE.MeshPhongMaterial({
		color: 0xffd3ff,
		transparent:true,
		opacity:.8,
		shading:THREE.FlatShading,
	});

	ground_material = Physijs.createMaterial(
		groundMat,
		1., // high friction
		1. // low restitution
	);
	
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth),
		ground_material,
		0 // mass
	);

	ground.position.y = -(platformHeight/2+5);
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