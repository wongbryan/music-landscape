var camera, scene, renderer, controls;
var clock = new THREE.Clock();

function resize(){
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
	renderer.setClearColor(0xededed);
	container.appendChild( renderer.domElement );
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0, 0, 10);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.rotateSpeed = 2.0;
	controls.panSpeed = 0.8;
	controls.zoomSpeed = 1.5;

	scene = new THREE.Scene();

	var directionalLight = new THREE.DirectionalLight(0xfff4f6, .7);
	directionalLight.position.set(-10, 10, 0);
	directionalLight.castShadow = true;
	var ambientLight = new THREE.AmbientLight(0xffeff3);

	scene.add(ambientLight);
	scene.add(directionalLight);

	scene.add(Land);
	scene.add(Avatar);

	window.addEventListener('resize', resize);
}

function update(){
	controls.update();
	Avatar.move();
	Land.update();
}

function animate(){
	update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate);
}

init();
animate();