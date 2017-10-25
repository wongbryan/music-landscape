var camera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function init() {
	var container = document.getElementById( 'container' );
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCSoftShadowMap;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xbfe7ff);
	container.appendChild( renderer.domElement );
	
	camera = new THREE.PerspectiveCamera( 105, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0, -25, 20);
	// controls = new THREE.OrbitControls(camera, renderer.domElement);
	// controls.rotateSpeed = 2.0;
	// controls.panSpeed = 0.8;
	// controls.zoomSpeed = 1.5;

	scene = new THREE.Scene();

	var directionalLight = new THREE.DirectionalLight(0xfff4f6, .7);
	directionalLight.position.set(-5, 5, 1);
	directionalLight.castShadow = true;
	var ambientLight = new THREE.AmbientLight(0x4f1830);
	pointLight = new THREE.PointLight(0xe1e1e1, .5, 0, 2);

	scene.add(ambientLight);
	scene.add(directionalLight);
	scene.add(pointLight);
	scene.add(Land);
	scene.add(Avatar);

    var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

	window.addEventListener('resize', resize);
	domEvents.addEventListener(Avatar, 'click', function() {
	    pov = true;
    });

    loop();
}

// placeholder for now before figuring out how to structure Camera class
function updateCamera() {
    if (pov) {
        camera.position.copy(Avatar.position).add(new THREE.Vector3( 0, 5, 10 ));

    } else {
        camera.lookAt(Avatar.position);
        camera.position.copy(Avatar.position).sub(new THREE.Vector3( 0, 10, -10 ));
    }
}

function update() {
	// controls.update();
	Avatar.move();
	Land.update();
    updateCamera();
	pointLight.position.copy(Avatar.position);
}

function loop() {
	update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}

init();