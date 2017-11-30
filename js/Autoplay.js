var CreateAutoplay = function(path){
	var audio = CreateAudio(path);
	var timestamps = [0, 100, 200, 300, 400, 500];

	function checkTimestamp(){
		var cur = audio.cur;
		console.log(cur);
		for(var i=0; i<timestamps.length; i++){
			if (cur==timestamps[i]){
				console.log('match');
			}
		}
	}

	function play(){
		audio.play();

		var interval = setInterval(function(){
			console.log('hello');
			checkTimestamp();
		}, 10);
	}
	return {
		play: audio.play,
		pause: audio.pause
	}
}