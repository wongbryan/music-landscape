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
    // loop thru objects
    Avatar.update();
    Land.update();
    updateCamera();
    pointLight.position.copy(Avatar.position);

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

    scene = new THREE.Scene();

    var directionalLight = new THREE.DirectionalLight(0xfff4f6, .7);
    directionalLight.position.set(-5, 5, 1);
    directionalLight.castShadow = true;
    var ambientLight = new THREE.AmbientLight(0x4f1830);
    pointLight = new THREE.PointLight(0xe1e1e1, .5, 0, 2);

    domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);
    scene.add(Land);

    for (obj in LOADED_OBJECTS) {
        if (LOADED_OBJECTS.hasOwnProperty(obj)) {
            scene.add(LOADED_OBJECTS[obj])
        }
    }

    window.addEventListener('resize', resize);

    loop();
}

OBJECTS_TO_LOAD.forEach(obj => {
    Loader.loadModel(obj.name, obj.material);
});