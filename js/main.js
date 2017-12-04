'use strict';

Physijs.scripts.worker = '/lib/physijs_worker.js';
Physijs.scripts.ammo = '/lib/ammo.js';

var box, scene, ground_material, ground, light;
var camera, scene, renderer, controls;
var fruits = [], clouds = [], pivots = [];
var Autoplay, Listener, Recorder;

const WORLD_RADIUS = 150;

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    for (var i = 0; i < pivots.length; i++) {
        pivots[i].rotation.y += .001 * pivots[i].speed;
    }

    for (var i = 0; i < clouds.length; i++) {
        clouds[i].update();
    }

    controls.update();

    TWEEN.update();
}

function loop() {
    update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

function init() {
    // var container = document.getElementById('container');
    var canvas = document.getElementsByTagName('canvas')[0];
    renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: 'logzbuf', canvas: canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xbfe7ff);
    // container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 1000);
    camera.position.set(-313, 398, 313);
    camera.controller = CameraController(camera);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    Listener = new THREE.AudioListener();
    camera.add(Listener);

    var audioLoader = new THREE.AudioLoader();
	var sound = new THREE.PositionalAudio(Listener);
	
	Autoplay = CreateAutoplay(sound, AUDIO_DATA['fresh'].timestamps, camera);
	dance.onmousedown = Autoplay.play;

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -60, 0));
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
        }
    );

    var numClouds = 7 + Math.floor(Math.random() * 7);
    var numPivots = 3;

    for (var i = 0; i < numPivots; i++) {
        pivots[i] = new THREE.Object3D();
        pivots[i].speed = 1 + Math.random() * 2;
    }

    for (var i = 0; i < numClouds; i++) {
        var index = Math.floor(Math.random() * numPivots);

        var angle = Math.random() * Math.PI * 2;
        var x = WORLD_RADIUS * Math.cos(angle),
            y = Math.random() * 50 + 10,
            z = WORLD_RADIUS * Math.sin(angle)
        var cloud = CreateCloud(pivots[index], x, y, z);

        clouds.push(cloud);
        scene.add(cloud.mesh);
    }

    var hemisphereLight = new THREE.HemisphereLight(0xfceafc, 0x000000, .8)

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

    var groundMat = new THREE.MeshPhongMaterial({
        color: 0xffd3ff,
        transparent: true,
        opacity: 1,
        shading: THREE.FlatShading,
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

    ground.position.y = -(platformHeight / 2);
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
            audio: null,
            web_audio_buffer: null
        };

        let r, c, offsetX, maxRows = 3, maxCols;

        if (i <= 9) {
            r = 0;
            c = i;
            maxCols = 10;
            offsetX = 0;
        }
        else if (i <= 18) {
            r = 1;
            c = i % 10;
            maxCols = 9;
            offsetX = -SP;
        }
        else {
            r = 2;
            c = (i + 1) % 10;
            maxCols = 7;
            // offsetX =
            offsetX = -1.5 * SP;
        }

        let x = SP * (c - Math.floor(maxCols / 2));
        let z = SP * (r - Math.floor(maxRows / 2));
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
        fruit.mesh.position.set(x, 5, z);
        fruit.mesh.rotation.set(Math.random(), Math.random(), Math.random());
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

    document.querySelector('#start').addEventListener('click', () => {
        camera.controller.shiftPos(0);
        $('#buttonMask > .buttonContainer').addClass('started');
        initRest();
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

function initRest() {
    $('#cameraToggle > .title, .buttons > .button').each(function(i, b) {
        const delay = 100 * i;
        setTimeout(function () {
            $(b).css('opacity', 1);
        }, delay);
    });


    document.addEventListener('keydown', (e) => {
        if (!e.metaKey) {
            e.preventDefault();
        }

        if (Autoplay.isPlaying())
        	return;

        let key = codeToKey(e.keyCode);
        if (key) {
            let objs = KEY_MAPPINGS[key];

            if (objs) {
                if (objs.fruit) {
                    objs.fruit.play();
                }

                if (objs.text) {
                    objs.text.play();
                }

                if (objs.border) {
                    objs.border.play();
                }

                if (objs.audio) {
                    objs.audio.stop();
                    objs.audio.play();
                }

                if (objs.web_audio_buffer && Recorder.isRecording()) {
                    var source = Recorder.context.createBufferSource();
                    source.buffer = objs.web_audio_buffer;
                    source.connect(Recorder.destination);
                    source.start(0);
                }

            } else {
                if (!isNaN(key)) {
                    let i = parseInt(key, 10);
                    if (i > 0 && camera.controller.positions.length - 1 >= i - 1) {
                        camera.controller.shiftPos(i - 1);
                    }
                } else {
                    switch (key) {
                        case 'left arrow':
                            camera.controller.prev();
                            break;
                        case 'right arrow':
                            camera.controller.next();
                            break;
                        case 'spacebar':
                        	// if(Recorder.isRecording()){
                        	// 	Recorder.stopRecording();
                        	// }
                        	// else{
                        	// 	Recorder.startRecording();
                        	// }
                            break;
                        case 'down arrow':
                            // Recorder.playRecording();
                            break;
                        default:
                            break;
                    }
                }

            }
        }
    });
}
