var Recorder;

(function () {

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch (e) {
        console.err('Browser does not support the Web Audio API. Recordings will not be possible.');
        return;
    }

    var context,
        bufferLoader,
        destination,
        mediaRecorder,
        isRecording = false,
        sources = [],
        chunks = [],
        sound_paths = [],
        audioRecordings = [];

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

        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function (e) {
            try {
                var blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});

                if (blob.size == 0) {
                    throw new Error('No input given to record.');
                }

                var audio = document.createElement('audio');
                audio.src = URL.createObjectURL(blob);
                audioRecordings.push(audio);

                chunks = [];
            } catch (e) {
                console.error(e.message);
            }
        };

        bufferLoader.calledback = true;

        for (var key in KEY_MAPPINGS) {
            var index = ACTIVE_KEYS.indexOf(key);
            var buffer = bufferList[index];
            KEY_MAPPINGS[key].web_audio_buffer = buffer;
        }

        function getRecordingStatus() {
            return isRecording;
        }

        function startRecording() {
            $('#record').toggleClass('recording');
            isRecording = true;
            mediaRecorder.start();
        }

        function stopRecording() {
            $('#record').toggleClass('recording');
            mediaRecorder.stop();
            isRecording = false;
        }

        function playRecording() {
            audioRecordings[0].play();
        }

        Recorder = {
            context: context,
            destination: destination,
            mediaRecorder: mediaRecorder,
            isRecording: getRecordingStatus,
            startRecording: startRecording,
            stopRecording: stopRecording,
            playRecording: playRecording,
            audioRecordings: audioRecordings
        }
    }

    bufferLoader.load();

})();