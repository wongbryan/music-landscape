var Recorder;

(function(){

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e){
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
  activeAudio;

  for (var i=0; i<ACTIVE_KEYS.length; i++){
    var key = ACTIVE_KEYS[i];
    var path = AUDIO_ASSETS_PATH+ key + '.wav';
    sound_paths.push(path);
  }

  bufferLoader = new BufferLoader(
    context, 
    sound_paths,
    loadComplete
  );

  function loadComplete(bufferList){
    if (bufferLoader.calledback)
      return;

    destination = context.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(destination.stream);
    console.log(mediaRecorder);

    mediaRecorder.ondataavailable = function(e){
      chunks.push(e.data);
    }

    mediaRecorder.onstop = function(e){
      var blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
      activeAudio = document.createElement('audio');
      activeAudio.src = URL.createObjectURL(blob);
      audioRecordings[0] = activeAudio;
    }

    bufferLoader.calledback = true;

    // for (var i=0; i<bufferList.length; i++){
    //   var source = context.createBufferSource();
    //   source.buffer = bufferList[i];
    //   source.connect(destination);
    //   sources.push(source);
    // }

    for (var key in KEY_MAPPINGS){
      var index = ACTIVE_KEYS.indexOf(key);
      var buffer = bufferList[index];
      KEY_MAPPINGS[key].web_audio_buffer = buffer;
    }

    Recorder = {
      context: context,
      destination: destination,
      mediaRecorder: mediaRecorder,
      startRecording: startRecording,
      stopRecording: stopRecording,
      playRecording: playRecording,
      activeAudio: activeAudio,
      audioRecordings: audioRecordings
    }
  }

  function startRecording(){
    mediaRecorder.start();
  }

  function stopRecording(){
    mediaRecorder.stop();
  }

  function playRecording(){
    audioRecordings[0].play();
  } 

  bufferLoader.load();

})();

// window.onload = Recorder.init;

// var Recorder;

// (function(){
//   var context;
//   var bufferLoader;
//   var destination;
//   var mediaRecorder;
//   var sources = [];
//   var chunks = [];

//   var l;

//   var mediaStream;

//   var sound_paths = [];

//   for (var i=0; i<ACTIVE_KEYS.length; i++){
//     var key = ACTIVE_KEYS[i];
//     var path = AUDIO_ASSETS_PATH+ key + '.wav';
//     sound_paths.push(path);
//   }

//   // Fix up prefixing
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;
//   context = new AudioContext();

//   //load all key sound data into its own buffer
//   bufferLoader = new BufferLoader(
//     context,
//     sound_paths,
//     finishedLoading
//     );

//   bufferLoader.load();

//   mediaStream = new MediaStream();

//   function finishedLoading(bufferList) {
//     if(bufferLoader.calledback)
//       return;

//     bufferLoader.calledback = true;
//     //all sources will output data into a media stream destination
//     //record data in destination stream
//     destination = context.createMediaStreamDestination();
//     mediaRecorder = new MediaRecorder(destination.stream);
//     console.log(mediaRecorder);

//     l = mediaRecorder;
//     //create sources for each buffer
//     //buffer data will be read in and played through source
//     for(var i=0; i<bufferList.length; i++){
//       console.log(i);
//       var source = context.createBufferSource();
//       source.buffer = bufferList[i];
//       source.connect(destination);
//       sources.push(source);
//     }

//     mediaRecorder.ondataavailable = function(e){
//       chunks.push(e.data);
//     }

//     mediaRecorder.onstop = function(e){
//       var blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
//       document.getElementById('audio').src = URL.createObjectURL(blob);
//     }

//     Recorder = {
//       mediaRecorder: mediaRecorder,
//       destination: destination,
//     }

//   }

//   function startRecording(){
//     mediaRecorder.start();
//   }

//   function stopRecording(){
//     mediaRecorder.stop();
//   }

//   // return {
//   //   // init: init,
//   //   destination: destination,
//   //   mediaRecorder: mediaRecorder,
//   //   sources: sources
//   // }
// })();

// // window.onload = Recorder.init;