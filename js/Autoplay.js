var CreateAutoplay = function (audio, timestamps, camera) {
    var sound = document.createElement('AUDIO');
    sound.src = 'assets/sounds/fresh.mp3';
    sound.currentTime = 0;

    var _interval = null;

    function play() {
        $('#pause-overlay').removeClass('show');
        if(!mobile)
            $('.ui-bar').addClass('show');
        AutoplayProps.isPlaying = true;
        AutoplayProps.paused = false;

        sound.play();

        $ui.removeClass('show');

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

    function pause() {
        camera.pivot.speed = 0;
        sound.pause();
        AutoplayProps.paused = true;

        const $overlay = $('#pause-overlay');
        $overlay.addClass('show');

        let curr = `${format(sound.currentTime / 60)}:${format(sound.currentTime % 60)}`;
        let total = `${format(sound.duration / 60)}:${format(sound.duration % 60)}`;

        $overlay.find('.curr').html(curr);
        $overlay.find('.total').html(total);
    }

    function format(num) {
        let rounded = new String(parseInt(num, 10));
        while (rounded.length < 2) {
            rounded = '0' + rounded;
        }

        return rounded;
    }

    function stop() {
        if(!mobile)
            $('.ui-bar').removeClass('show');
        $('#pause-overlay').removeClass('show');

        clearInterval(_interval);
        camera.pivot.speed = 0;

        var tween = new TWEEN.Tween(camera.pivot.rotation).to(new THREE.Vector3(0, 0, 0), 400);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();

        camera.controller.shiftPos(2);
        sound.pause();
        sound.currentTime = 0;

        for (var key in timestamps) {
            timestamps[key].trig = false;
        }

        AutoplayProps.isPlaying = false;
        AutoplayProps.paused = false;


        if(mobile){
            document.querySelector('#title').style.opacity = 1;
        }
        else
            $ui.addClass('show');
        return;
    }

    function checkTimestamps(cur) {
        for (var key in timestamps) {
            if (Math.round(10 * cur) / 10 == Number.parseFloat(key)) {
                if (timestamps[key].trig) {
                    continue;
                }
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
        // isPlaying: props.isPlaying,
        // paused: props.paused,
        pause: pause,
        play: play,
        stop: stop,
        sound: sound,
        timestamps: timestamps
    }
}