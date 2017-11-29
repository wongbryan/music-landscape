var CreateAudio = function(path){
	var audio = document.createElement('AUDIO');
	audio.src = path;

	function play(){
		audio.currentTime = 0;
		audio.play();
	}

	return {
		play: play,
	}
}