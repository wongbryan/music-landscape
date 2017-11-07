var camera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;
var domEvents;

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

function update() {	
	for (var obj in OBJECTS){
		OBJECTS[obj].update();
	}
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
    camera.position.set(0, 0, 10);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new THREE.Scene();

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

	for (var i=0; i<pointLights.length; i++){
		scene.add(pointLights[i]);
		var helper = new THREE.PointLightHelper(pointLights[i], 1);
		scene.add(helper);
	}

	scene.add(ambientLight);
	scene.add(directionalLight);

	var bananaGeom = MODEL_DATA['banana'].geometry;
    Planet = InitPlanet(bananaGeom);
  	Planet.addToScene();

    OBJECTS['Planet'] = Planet;

    window.addEventListener('resize', resize);

    loop();
}