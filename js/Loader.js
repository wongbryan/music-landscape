const ASSETS_PATH = '/assets/models/';
const LOADED_OBJECTS = {};

const KEYCODES = {
    32 : "spacebar",
    37 : "left arrow",
    38 : "up arrow",
    39 : "right arrow",
    40 : "down arrow",
    48 : "0",
    49 : "1",
    50 : "2",
    51 : "3",
    52 : "4",
    53 : "5",
    54 : "6",
    55 : "7",
    56 : "8",
    57 : "9",
    65 : "a",
    66 : "b",
    67 : "c",
    68 : "d",
    69 : "e",
    70 : "f",
    71 : "g",
    72 : "h",
    73 : "i",
    74 : "j",
    75 : "k",
    76 : "l",
    77 : "m",
    78 : "n",
    79 : "o",
    80 : "p",
    81 : "q",
    82 : "r",
    83 : "s",
    84 : "t",
    85 : "u",
    86 : "v",
    87 : "w",
    88 : "x",
    89 : "y",
    90 : "z",
};

function keyToCode(key) {
    return Object.keys(KEYCODES)[Object.values(KEYCODES).indexOf(key)];
}

function codeToKey(code) {
    return KEYCODES[code];
}

document.addEventListener('keydown', (e) => {
    if ( !e.metaKey ) {
        e.preventDefault();
    }

    let key = codeToKey(e.keyCode);
    if (key) {
        let obj = KEYCODES[key];
        if (obj) {
            obj.play();
        }
    }
});

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

                if(materials !== undefined)
                    MODEL_DATA[file].materials = materials;
            }
        );
    };

    function meshLoader(file, customMaterials) {
        return function (geometry, materials) {
            const mat = customMaterials || materials;
            const mesh = new THREE.Mesh(geometry, mat);

            LOADED_OBJECTS[file] = mesh;

            // KEY_MAPPINGS[key] = mesh;
            // use eval for switch function?

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

for (var obj in MODEL_DATA ) {
    Loader.loadModel(obj);
}