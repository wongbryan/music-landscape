var SoundRecorder;

(function () {

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch (e) {
        console.err('Browser does not support the Web Audio API. Recordings will not be possible.');
        return;
    }

    var recorder,
        context,
        bufferLoader,
        destination,
        sources = [],
        chunks = [],
        sound_paths = [],
        audioRecordings = [];

    var isRecording = false;
    
    for (var i = 0; i < ACTIVE_KEYS.length; i++) {
        var key = ACTIVE_KEYS[i];
        var path = AUDIO_ASSETS_PATH + key + '.wav';
        sound_paths.push(path);
    }

    bufferLoader = new BufferLoader(
        context,
        sound_paths,
        loadComplete
    );

    function loadComplete(bufferList) {

        if (bufferLoader.calledback)
            return;

        destination = context.createMediaStreamDestination();

        bufferLoader.calledback = true;

        recorder = new Recorder(destination);

        for (var key in KEY_MAPPINGS) {
            var index = ACTIVE_KEYS.indexOf(key);
            var buffer = bufferList[index];
            KEY_MAPPINGS[key].web_audio_buffer = buffer;
        }

        function getRecordingStatus() {
            return recorder.recording;
        }

        function record() {
            $('#record').toggleClass('recording');
            recorder.clear();
            recorder.record();
        }

        function stop() {
            $('#record').toggleClass('recording');
            recorder.stop();
            recorder.exportWAV(function(blob){
                var url = URL.createObjectURL(blob);
                var audio = document.createElement('audio');
                audio.src = url;
                audio.loop = true;
                audioRecordings.push(audio);

                let i = audioRecordings.length-1;

                let $loops = $('#loops-drawer');
                
                let $loop = $('<div>', {class: 'loop'});
                let $controls = $('<div>', {class: 'controls'});
                let $icon = $('<i>', {class: 'fa fa-play show'});
                let $iconPause = $('<i>', {class: 'fa fa-pause hide'});
                (function() {
                    $icon[0].addEventListener('click', () => {
                        SoundRecorder.audioRecordings[i].play();
                        $iconPause.removeClass('hide');
                        $iconPause.addClass('show');
                        $icon.removeClass('show');
                        $icon.addClass('hide');
                    });
                }(i));

                (function() {
                    $iconPause[0].addEventListener('click', () => {
                        SoundRecorder.audioRecordings[i].pause();
                        SoundRecorder.audioRecordings[i].currentTime = 0;
                        $icon.removeClass('hide');
                        $icon.addClass('show');
                        $iconPause.removeClass('show');
                        $iconPause.addClass('hide');
                    });
                }(i));

                $loop.append('<div class="title">Loop ' + i+1 + '</div>');
                $controls.append($icon);
                $controls.append($iconPause);
                $loop.append($controls);

                $loops.append($loop);
                // $('#loops-drawer').html($loops);
                // $('#bottom').toggleClass('showLoops');
            });

            isRecording = false;
        }

        function playRecording() {
            audioRecordings[0].play();
        }

        SoundRecorder = {
            recorder: recorder,
            context: context,
            destination: destination,
            isRecording: getRecordingStatus,
            record: record,
            stop: stop,
            playRecording: playRecording,
            audioRecordings: audioRecordings
        }
    }

    bufferLoader.load();

})();