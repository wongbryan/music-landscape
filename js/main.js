var camera, outerCamera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;
var domEvents;
var activeCamera;

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
	for (var obj in OBJECTS){
		OBJECTS[obj].update();
	}
}

function loop() {
    update();
    renderer.render(scene, activeCamera);
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

    outerCamera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, .0001, 10000);
	outerCamera.position.set(0, 10, 15);

    controls = new THREE.OrbitControls(outerCamera, renderer.domElement);

    scene = new THREE.Scene();

    scene.add(camera);
	scene.add(outerCamera);

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

	var bananaGeom = new THREE.MeshPhongMaterial({
        color : new THREE.Color(0xff7eca),
        emissive : new THREE.Color(0x89174d),
        specular : new THREE.Color(0xbe045b),
        side : THREE.DoubleSide,
        shininess : 100,
        // flatShading : true
    });
	var RADIUS = 25, numPlanets = 5;
	for (var obj in OBJECTS){
		switch(obj){
			case('Universe'):
				var universe = InitUniverse(RADIUS, numPlanets, camera);
				scene.add(universe.mesh);
				OBJECTS[obj] = universe;
				break;
			case('Planet'):
				var planet = InitPlanet(bananaGeom);
				var index = 0;

				var angle = 2*Math.PI/numPlanets * index, 
				posX = RADIUS*Math.cos(angle),
				posZ = RADIUS*Math.sin(angle);

				planet.mesh.position.x = posX;
				planet.mesh.position.z = posZ;

				scene.add(planet.mesh);

				OBJECTS[obj] = planet;
				break;
			case('Planet2'):
				var planet = InitPlanet(bananaGeom);
				var index = 1;

				var angle = 2*Math.PI/numPlanets * index, 
				posX = RADIUS*Math.cos(angle),
				posZ = RADIUS*Math.sin(angle);

				planet.mesh.position.x = posX;
				planet.mesh.position.z = posZ;

				scene.add(planet.mesh);

				OBJECTS[obj] = planet;
				break;
			case('Planet3'):
				var planet = InitPlanet(bananaGeom);
				var index = 2;

				var angle = 2*Math.PI/numPlanets * index, 
				posX = RADIUS*Math.cos(angle),
				posZ = RADIUS*Math.sin(angle);

				planet.mesh.position.x = posX;
				planet.mesh.position.z = posZ;

				scene.add(planet.mesh);

				OBJECTS[obj] = planet;
				break;
			case('Planet4'):
				var planet = InitPlanet(bananaGeom);
				var index = 3;

				var angle = 2*Math.PI/numPlanets * index, 
				posX = RADIUS*Math.cos(angle),
				posZ = RADIUS*Math.sin(angle);

				planet.mesh.position.x = posX;
				planet.mesh.position.z = posZ;

				scene.add(planet.mesh);

				OBJECTS[obj] = planet;
				break;
			case('Planet5'):
				var planet = InitPlanet(bananaGeom);
				var index = 4;

				var angle = 2*Math.PI/numPlanets * index, 
				posX = RADIUS*Math.cos(angle),
				posZ = RADIUS*Math.sin(angle);

				planet.mesh.position.x = posX;
				planet.mesh.position.z = posZ;

				scene.add(planet.mesh);

				OBJECTS[obj] = planet;
				break;
			case('CenterPlanet'):
				CenterPlanet = InitCenterPlanet(bananaGeom);
			    scene.add(CenterPlanet.mesh);
			    OBJECTS['CenterPlanet'] = CenterPlanet;
				break;
		}
	}

    window.addEventListener('resize', resize);
    window.addEventListener('mousedown', toggleCamera);
    loop();
}