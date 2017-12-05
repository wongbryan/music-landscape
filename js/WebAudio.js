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
                audioRecordings.push(audio);
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