var Recorder;

(function () {

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch (e) {
        console.err('Browser does not support Web Audio API. Recordings will not be possible.');
        return;
    }

    var context,
        bufferLoader,
        destination,
        mediaRecorder,
        sources = [],
        chunks = [],
        sound_paths = [],
        audioRecordings = [],
        activeAudio = document.createElement('audio');

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
        mediaRecorder = new MediaRecorder(destination.stream);
        console.log(mediaRecorder);

        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function (e) {
            var blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});
            activeAudio.src = URL.createObjectURL(blob);
            audioRecordings[0] = activeAudio;
        };

        bufferLoader.calledback = true;

        // for (var i=0; i<bufferList.length; i++){
        //   var source = context.createBufferSource();
        //   source.buffer = bufferList[i];
        //   source.connect(destination);
        //   sources.push(source);
        // }

        for (var key in KEY_MAPPINGS) {
            var index = ACTIVE_KEYS.indexOf(key);
            var buffer = bufferList[index];
            KEY_MAPPINGS[key].web_audio_buffer = buffer;
        }

        Recorder = {
            context: context,
            destination: destination,
            mediaRecorder: mediaRecorder,
            isRecording: isRecording,
            startRecording: startRecording,
            stopRecording: stopRecording,
            playRecording: playRecording,
            activeAudio: activeAudio,
            audioRecordings: audioRecordings
        }
    }

    function startRecording() {
        mediaRecorder.start();
    }

    function stopRecording() {
        mediaRecorder.stop();
    }

    function playRecording() {
        audioRecordings[0].play();
    }

    bufferLoader.load();

})();