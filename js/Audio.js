var CreateAudio = function(path){
	var audio = document.createElement('AUDIO');
	audio.src = path;

	function stop(){
		audio.currentTime = 0;
	}

	function play(){
		audio.play();
	}

	function pause(){
		audio.pause();
	}

	return {
		stop: stop,
		play: play,
		pause: pause,
		cur: audio.cur
	}
}