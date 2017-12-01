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
var Autoplay, Listener;

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

	// controls.update();

	TWEEN.update();
}

function loop() {
    update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

function init() {
    var container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: 'logzbuf'});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xbfe7ff);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 1000);
    camera.position.set(-50, 20, 50);
    camera.controller = CameraController(camera);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    Listener = new THREE.AudioListener();
    camera.add(Listener);

    var audioLoader = new THREE.AudioLoader();
	var sound = new THREE.PositionalAudio(Listener);

	// audioLoader.load('assets/sounds/swum.mp3', function(buffer){
	// 	console.log(buffer);
	// 	sound.setBuffer(buffer);
	// 	sound.setRefDistance(20);
		
	// });

	Autoplay = CreateAutoplay(sound, AUDIO_DATA['fresh'].timestamps, camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -60, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 1 );
		}
	);

    // scene.add(camera);

    var numClouds = 7+Math.floor(Math.random()*7);
    var numPivots = 3;

    for(var i=0; i<numPivots; i++){
    	pivots[i] = new THREE.Object3D();
    	pivots[i].speed = 1 + Math.random()*2;
    }

    for(var i=0; i<numClouds; i++){
    	var index = Math.floor(Math.random()*numPivots);
   
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
	
	var shadowLight = new THREE.DirectionalLight(0xffffff, .5);
	
	shadowLight.position.set(150, 75, 150);
	
	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -100;
	shadowLight.shadow.camera.right = 100;
	shadowLight.shadow.camera.top = 100;
	shadowLight.shadow.camera.bottom = -100;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	var shadowLight2 = shadowLight.clone();
	shadowLight2.castShadow = false;
	shadowLight2.intensity = .2;
	shadowLight2.position.set(-150, 75, -150);

	var shadowLight3 = shadowLight.clone();
	shadowLight3.castShadow = false;
	shadowLight3.intensity = .1;
	shadowLight3.position.set(0, 125, 0);
	
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
	scene.add(shadowLight2);
	scene.add(shadowLight3);

	const platformWidth = 60,
	platformDepth = 25, 
	platformHeight = 150;

	const height = 50,
	radius = 30;

 	var groundMat = new THREE.MeshPhongMaterial({
		color: 0xffd3ff,
		transparent:true,
		opacity:1,
		shading:THREE.FlatShading,
	});

	ground_material = Physijs.createMaterial(
		groundMat,
		1., // high friction
		1. // low restitution
	);
	
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth),
		// new THREE.ConeGeometry(radius, height, 32, 1),
		ground_material,
		0 // mass
	);

	ground.position.y = -(platformHeight/2);
	// ground.position.y = -height/2;
	// ground.rotation.x = Math.PI;
	// ground.rotation.y = Math.PI/4;
	ground.receiveShadow = true;
	scene.add(ground);

    const ROWS = 3;
	const ROW_OFFSET = 2;
	const COLS = 4;
	const SP = 4;

    for (let i = 0; i < ACTIVE_KEYS.length; i++) {
	    let k = ACTIVE_KEYS[i];

	    KEY_MAPPINGS[k] = {
	    	fruit: null,
	    	text: null,
	    	border: null,
	    	audio: null
	    };

	    let r, c, offsetX, maxRows = 3, maxCols;

	    if (i<=9){
	    	r = 0;
	    	c = i;
	    	maxCols = 10;
	    	offsetX = 0;
	    }
	    else if (i<=18){
	    	r = 1;
	    	c = i%10;
	    	maxCols = 9;
	    	offsetX = -SP;
	    }
	    else{
	    	r = 2;
	    	c = (i+1)%10;
	    	maxCols = 7;
	    	// offsetX = 
	    	offsetX = -1.5*SP;
	    }

	    let x = SP * (c - Math.floor(maxCols/2));
	    let z = SP * (r - Math.floor(maxRows/2));
	    x += (r * ROW_OFFSET);
	    x += offsetX;

        let numFruits = Object.keys(MODEL_DATA).length,
        fruitIndex = Math.floor(numFruits*Math.random()),
        fruitData = MODEL_DATA[Object.keys(MODEL_DATA)[fruitIndex]];

	    let fruit = CreateFruit(
	    	fruitData.geometry,
	    	fruitData.materials.clone(),
	    	fruitData.scale,
	    	fruitData.force,
	    	null
	    );

	    KEY_MAPPINGS[k].fruit = fruit;
	    fruits.push(fruit);
        fruit.mesh.position.set(x, 0, z);
        scene.add(fruit.mesh);

        fruit.defineConstraint();

        let square = CreateKey();
        square.mesh.position.set(x, .1, z);
        KEY_MAPPINGS[k].border = square;
        scene.add(square.mesh);

        let text = CreateText(k);
        text.mesh.position.set(x - 1, .2, z + 1);
        text.mesh.rotation.x = -Math.PI / 2;
        KEY_MAPPINGS[k].text = text;
        scene.add(text.mesh);

        let path = 'assets/sounds/' + k + '.wav';
        let audio = CreateAudio(path);
        KEY_MAPPINGS[k].audio = audio;

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

            if (objs.border) {
                objs.border.play();
            }

            if (objs.audio){
            	objs.audio.stop();
            	objs.audio.play();
            }
        }
    });

	scene.simulate();

	camera.pivot = new THREE.Object3D();
	camera.pivot.add(camera);
	camera.pivot.speed = 0;
	scene.add(camera.pivot);
	pivots.push(camera.pivot);
	
    window.addEventListener('resize', resize);
    loop();
}