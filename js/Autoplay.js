var CreateAutoplay = function(audio, timestamps, camera){
	var sound = document.createElement('AUDIO');
	sound.src = 'assets/sounds/fresh.mp3';
	// sound.currentTime = 0;

	var isplaying = false;

	function isPlaying(){
		return isplaying;
	}

	function play(){
		isplaying = true;
		sound.play();
		dance.style.opacity = 0;
		setTimeout(()=>{
			dance.style.display = 'none';
		}, 300);

		camera.controller.shiftPos(2);
		camera.pivot.speed = 1;

		var i = setInterval(function(){
			var cur = sound.currentTime;
			// console.log(cur);
			if (cur >= sound.duration){
				clearInterval(i);
				dance.style.opacity = 1;
				setTimeout(()=>{
					dance.style.display = 'block';
				}, 300);

				for (var key in timestamps){
					timestamps[key].trig = false;
				}
				isplaying = false;
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

				if (timestamps[key].cameraToggle != undefined){
					camera.controller.shiftPos(timestamps[key].cameraToggle);
				}
				
				var mag = timestamps[key].mag;
				bounceAll(fruits, mag);

				var lightkeys = timestamps[key].lightkeys;

				if(lightkeys){
					for( var i=0; i<lightkeys; i++){
						var index;	
						index = (lightkeys == 26) ? i : Math.floor(Object.keys(KEY_MAPPINGS).length * Math.random());
						var button = Object.keys(KEY_MAPPINGS)[index];
						KEY_MAPPINGS[button].border.play();

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
		isPlaying: isPlaying,
		play: play,
		sound: sound,
		timestamps: timestamps
	}
}