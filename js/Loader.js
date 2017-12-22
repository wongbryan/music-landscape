const ASSETS_PATH = 'assets/models/';
const FONT_ASSETS_PATH = 'assets/fonts/';
const TEXTURE_ASSETS_PATH = 'assets/images/';
const AUDIO_ASSETS_PATH = 'assets/sounds/';

var Loader = (function () {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.JSONLoader(manager);
    const fontLoader = new THREE.FontLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);
    const audioLoader = new THREE.AudioLoader(manager);
    const $progress = $('#progress');

    var reduceableModels = ['banana', 'raspberry', 'pumpkin'];

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

        var path;

        var reduceable = false;
        if(reduceableModels.includes(file))
            reduceable = true;

        if ( (mobile || isSafari) && reduceable )
            path = ASSETS_PATH + file + '-reduced.json';

        else
            path = ASSETS_PATH + file + '.json';
        
        loader.load( 
            path,

            function(geometry, materials){
                MODEL_DATA[file].geometry = geometry;

                // if (materials !== undefined)
                //     MODEL_DATA[file].materials = materials;
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

    this.loadAudio = function(file, ext) {
        audioLoader.load(
            AUDIO_ASSETS_PATH + file + ext,

            function(buffer) {
                AUDIO_DATA[file].buffer = buffer;
            }
        );
    }

    return this;
}());

for (var obj in MODEL_DATA) {

    Loader.loadModel(obj);

}

for (var key in FONTS_DATA) {
    Loader.loadFont(key);
}

for (var key in AUDIO_DATA) {
    var ext = AUDIO_DATA[key].ext;
    Loader.loadAudio(key, ext);
}

