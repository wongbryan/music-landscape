var camera, scene, renderer, controls;
var clock = new THREE.Clock();
var pointLight;
var pov;
const ASSETS_PATH = '/assets/models/';
const manager = new THREE.LoadingManager();
const loader = new THREE.JSONLoader(manager);

manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
};

manager.onLoad = function() {
	loop();
}

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// placeholder for now before figuring out how to structure Camera class
function updateCamera() {
    if (pov) {
        camera.position.copy(Avatar.mesh.position).add(new THREE.Vector3( 0, 5, 10 ));
    } else {
        camera.lookAt(Avatar.mesh.position);
        camera.position.copy(Avatar.mesh.position).sub(new THREE.Vector3( 0, 10, -10 ));
    }
}

function update() {
	// controls.update();

	Avatar.move();
	Land.update();
  updateCamera();
	pointLight.position.copy(Avatar.mesh.position);

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

    camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 1, 10000);
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

    var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    window.addEventListener('resize', resize);
    // domEvents.addEventListener(Avatar, 'click', function() {
    //   pov = true;
    // });

}

init();

function meshLoader(file, customMaterials = null) {
  return function(geometry, materials){
    let mat = customMaterials || materials;

    let obj = new THREE.Mesh(geometry, mat);
    scene.add(obj);

    switch (file) {
      case 'banana.json':
        Avatar.createMesh(obj);
        break;
      default: break;
    }

    return obj;
  }
}

let bananaFile = 'banana.json'
let bananaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf572bf),
    emissive: new THREE.Color(0x8c1228),
    roughness: .05,
    metalness: .48,
    side: THREE.DoubleSide,
    flatShading: true
});

function loadModel(file) {
  loader.load(
      ASSETS_PATH + file,
      meshLoader(file, bananaMaterial)
  );
}

loadModel('banana.json')
