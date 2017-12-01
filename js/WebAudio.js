// var AudioRecorder = function(path){
//   var context,
//   bufferLoader,
//   destination,
//   mediaRecorder,
//   source,
//   chunks;

//   try {
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     context = new AudioContext();
//   }
//   catch(e){
//     console.err('Browser does not support Web Audio API. Recordings will not be possible.');
//     return;
//   }

//   bufferLoader = new BufferLoader(
//     context, 
//     [
//       'assets/sounds/fresh.mp3'
//     ]
//   )

// }

var audio = document.getElementById('audio');

window.onload = init;
var context;
var bufferLoader;
var destination;
var mediaRecorder;
var source1;
var chunks = [];

var mediaStream;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'assets/sounds/fresh.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();

  mediaStream = new MediaStream();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  source1 = context.createBufferSource();
  source1.buffer = bufferList[0];

  destination = context.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(destination.stream);

  mediaRecorder.ondataavailable = function(e){
    chunks.push(e.data);
  }

  mediaRecorder.onstop = function(e){
    var blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
    document.getElementById('audio').src = URL.createObjectURL(blob);
  }

  source1.connect(destination);
  // source1.start(0);
}

function startRecording(){
  mediaRecorder.start();
  source1.start(0);
}

function stopRecording(){
  mediaRecorder.stop();
  source1.stop(0);
}