var CreateAutoplay = function (audio, timestamps, camera) {
    var sound = document.createElement('AUDIO');
    sound.src = 'assets/sounds/fresh.mp3';
    sound.currentTime = 0;

    var isPlaying = false;
    var _interval = null;

    function play() {
        isPlaying = true;
        sound.play();

        $('#controls').toggleClass('dancing');

        camera.controller.shiftPos(2);
        camera.pivot.speed = 1;

        _interval = setInterval(function () {
            var cur = sound.currentTime;
            if (cur >= sound.duration) {
                stop();
            }
            checkTimestamps(cur);
        }, 50);
    }

    function stop() {
        clearInterval(_interval);
        camera.pivot.speed = 0;

        var tween = new TWEEN.Tween(camera.pivot.rotation).to(new THREE.Vector3(0, 0, 0), 400);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();

        camera.controller.shiftPos(2);
        sound.pause();
        sound.currentTime = 0;

        $('#controls').toggleClass('dancing');

        for (var key in timestamps) {
            timestamps[key].trig = false;
        }
        isPlaying = false;
        return;
    }

    function checkTimestamps(cur) {
        for (var key in timestamps) {
            if (Math.round(10 * cur) / 10 == Number.parseFloat(key)) {
                if (timestamps[key].trig) {
                    continue;
                }
                console.log(key);
                if (timestamps[key].cameraToggle != undefined) {
                    camera.controller.shiftPos(timestamps[key].cameraToggle);
                }

                var mag = timestamps[key].mag;
                bounceAll(fruits, mag);

                var lightkeys = timestamps[key].lightkeys;

                if (lightkeys) {
                    for (var i = 0; i < lightkeys; i++) {
                        var index;
                        index = (lightkeys == 26) ? i : Math.floor(Object.keys(KEY_MAPPINGS).length * Math.random());
                        var button = Object.keys(KEY_MAPPINGS)[index];
                        KEY_MAPPINGS[button].border.play();

                        KEY_MAPPINGS[button].text.play();
                    }
                }

                if(timestamps[key].pixelate != undefined){
                	var time = timestamps[key].pixelate;
                	composer.pixelate(time);
                }

                if(timestamps[key].wavify != undefined){
                	var time = timestamps[key].wavify;
                	composer.wavify(time);
                }

                if(timestamps[key].spin != undefined){
                	var time = timestamps[key].spin;
                	camera.controller.spin(time);
                }

                timestamps[key].trig = true;
            }
        }
    }

    function bounceAll(fruits, mag) {
        for (var i = 0; i < fruits.length; i++) {
            fruits[i].applyImpulse(mag);
        }
    }

    return {
        isPlaying: isPlaying,
        play: play,
        stop: stop,
        sound: sound,
        timestamps: timestamps
    }
}