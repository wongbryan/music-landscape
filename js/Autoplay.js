var CreateAutoplay = function(audio, timestamps){
	var sound = document.createElement('AUDIO');
	sound.src = 'assets/sounds/fresh.mp3';

	function play(){
		sound.play();

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
				var mag = timestamps[key].mag;
				bounceAll(fruits, mag);

				var lightkeys = timestamps[key].lightkeys;

				if(lightkeys){
					for( var i=0; i<lightkeys; i++){	
						var index = Math.floor(Object.keys(KEY_MAPPINGS).length * Math.random());
						var button = Object.keys(KEY_MAPPINGS)[index];
						KEY_MAPPINGS[button].text.play();
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