const ASSETS_PATH = '/assets/models/';
const LOADED_OBJECTS = {};

var Loader = (function () {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.JSONLoader(manager);

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

                if(materials!==undefined)
                    MODEL_DATA[file].materials = materials;
            }
        );
    };

    function meshLoader(file, customMaterials) {
        return function (geometry, materials) {
            const mat = customMaterials || materials;
            const mesh = new THREE.Mesh(geometry, mat);

            LOADED_OBJECTS[file] = mesh;

            switch(file) {
                case 'banana':
                    Avatar = new InitAvatar(mesh);
                    LOADED_OBJECTS[file] = Avatar;
                    break;
                default:
                    break;
            }

            return mesh;
        }
    };

    return this;
}());

// MODEL_DATA.forEach(obj => {
//     Loader.loadModel(obj.name, obj.material);
// });

for (var obj in MODEL_DATA ){
    Loader.loadModel(obj);
}