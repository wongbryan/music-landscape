var CreateAutoplay = function(audio, timestamps, camera){
	var sound = document.createElement('AUDIO');
	sound.src = 'assets/sounds/fresh.mp3';
	// sound.currentTime = 0;

	function play(){
		sound.play();

		camera.controller.shiftPos(0);
		camera.pivot.speed = 1;

		var i = setInterval(function(){
			var cur = sound.currentTime;
			// console.log(cur);
			if (cur >= sound.duration){
				clearInterval(i);
				return;
			}
			checkTimestamps(cur);
		}, 50);
	}

	function checkTimestamps(cur){
		for (var key in timestamps){
			if(Math.round(10*cur)/10==Number.parseFloat(key)){
				if (timestamps[key].trig){
					continue;
				}
				console.log(key);
				var mag = timestamps[key].mag;
				bounceAll(fruits, mag);

				var lightkeys = timestamps[key].lightkeys;

				if(lightkeys){
					for( var i=0; i<lightkeys; i++){
						var index;	
						index = (lightkeys == 26) ? i : Math.floor(Object.keys(KEY_MAPPINGS).length * Math.random());
						var button = Object.keys(KEY_MAPPINGS)[index];
						KEY_MAPPINGS[button].border.play();
					}	
				}

				timestamps[key].trig = true;
			}
		}
	}

	function bounceAll(fruits, mag){
		for(var i=0; i<fruits.length; i++){
			fruits[i].applyImpulse(mag);
		}
	}

	return {
		play: play,
		sound: sound,
		timestamps: timestamps
	}
}