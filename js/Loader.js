const ASSETS_PATH = 'assets/models/';
const TEXTURE_ASSETS_PATH = 'assets/images/';

var Loader = (function () {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.JSONLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);

    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
        //make a model from mesh, push to objects
    };

    manager.onLoad = function () {
        init();
    };

    this.loadModel = function(file) {
        loader.load( 
            ASSETS_PATH + file + '.json',

            function(geometry, materials){
                MODEL_DATA[file].geometry = geometry;

                if (materials !== undefined)
                    MODEL_DATA[file].materials = materials;
            }
        );
    };

    this.loadTexture = function(file){
        textureLoader.load(
            TEXTURE_ASSETS_PATH + file + '.png',

            function(texture){
                TEXTURE_DATA[file] = texture;
            }
        )
    };

    return this;
}());

for (var obj in MODEL_DATA ) {
    Loader.loadModel(obj);
}

for (var key in TEXTURE_DATA ){
    Loader.loadTexture(key);
}

