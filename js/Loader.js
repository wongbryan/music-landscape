const ASSETS_PATH = 'assets/models/';
const FONT_ASSETS_PATH = 'assets/fonts/';
const TEXTURE_ASSETS_PATH = 'assets/images/';

var Loader = (function () {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.JSONLoader(manager);
    const fontLoader = new THREE.FontLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);
    const $progress = $('#progress');


    manager.onProgress = function (item, loaded, total) {
        let percent = Math.ceil(loaded / total * 100);


        $progress.find('.percent').html(percent + '%');
        $progress.find('.bar').css({ 'height':  percent + '%' });

        if (percent >= 100) {
            setTimeout(() => {
                $('#progress').fadeOut()
            }, 350);
        }
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

    this.loadFont = function(file) {
        fontLoader.load(
            FONT_ASSETS_PATH + file + '.typeface.json',

            function(font) {
                FONTS_DATA[file].font = font;
            }
        );
    };

    return this;
}());

for (var obj in MODEL_DATA) {
    Loader.loadModel(obj);
}

for (var key in TEXTURE_DATA) {
    Loader.loadTexture(key);
}

for (var key in FONTS_DATA) {
    Loader.loadFont(key);
}

