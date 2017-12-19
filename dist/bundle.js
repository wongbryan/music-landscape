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
var CreateAutoplay = function (audio, timestamps, camera) {
    var sound = document.createElement('AUDIO');
    sound.src = 'assets/sounds/fresh.mp3';
    sound.currentTime = 0;

    var _interval = null;

    function play() {
        $('#pause-overlay').removeClass('show');
        if(!mobile)
            $('.ui-bar').addClass('show');
        AutoplayProps.isPlaying = true;
        AutoplayProps.paused = false;

        sound.play();

        $ui.removeClass('show');

        camera.controller.shiftPos(2);
        camera.pivot.speed = 1;

        _interval = setInterval(function () {
            var cur = sound.currentTime;
            if (cur >= sound.duration) {
                stop();
            }
            checkTimestamps(cur);
        }, 50);
    }

    function pause() {
        camera.pivot.speed = 0;
        sound.pause();
        AutoplayProps.paused = true;

        const $overlay = $('#pause-overlay');
        $overlay.addClass('show');

        let curr = `${format(sound.currentTime / 60)}:${format(sound.currentTime % 60)}`;
        let total = `${format(sound.duration / 60)}:${format(sound.duration % 60)}`;

        $overlay.find('.curr').html(curr);
        $overlay.find('.total').html(total);
    }

    function format(num) {
        let rounded = new String(parseInt(num, 10));
        while (rounded.length < 2) {
            rounded = '0' + rounded;
        }

        return rounded;
    }

    function stop() {
        if(!mobile)
            $('.ui-bar').removeClass('show');
        $('#pause-overlay').removeClass('show');

        clearInterval(_interval);
        camera.pivot.speed = 0;

        var tween = new TWEEN.Tween(camera.pivot.rotation).to(new THREE.Vector3(0, 0, 0), 400);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();

        camera.controller.shiftPos(2);
        sound.pause();
        sound.currentTime = 0;

        for (var key in timestamps) {
            timestamps[key].trig = false;
        }

        AutoplayProps.isPlaying = false;
        AutoplayProps.paused = false;


        if(mobile){
            document.querySelector('#title').style.opacity = 1;
        }
        else
            $ui.addClass('show');
        return;
    }

    function checkTimestamps(cur) {
        for (var key in timestamps) {
            if (Math.round(10 * cur) / 10 == Number.parseFloat(key)) {
                if (timestamps[key].trig) {
                    continue;
                }
                if (timestamps[key].cameraToggle != undefined) {
                    camera.controller.shiftPos(timestamps[key].cameraToggle);
                }

                var mag = timestamps[key].mag;
                bounceAll(fruits, mag);

                var lightkeys = timestamps[key].lightkeys;

                if (lightkeys) {
                    for (var i = 0; i < lightkeys; i++) {
                        var index;
                        index = (lightkeys == 26) ? i : Math.floor(Object.keys(KEY_MAPPINGS).length * Math.random());
                        var button = Object.keys(KEY_MAPPINGS)[index];
                        KEY_MAPPINGS[button].border.play();

                        KEY_MAPPINGS[button].text.play();
                    }
                }

                if(timestamps[key].pixelate != undefined){
                	var time = timestamps[key].pixelate;
                	composer.pixelate(time);
                }

                if(timestamps[key].wavify != undefined){
                	var time = timestamps[key].wavify;
                	composer.wavify(time);
                }

                if(timestamps[key].spin != undefined){
                	var time = timestamps[key].spin;
                	camera.controller.spin(time);
                }

                timestamps[key].trig = true;
            }
        }
    }

    function bounceAll(fruits, mag) {
        for (var i = 0; i < fruits.length; i++) {
            fruits[i].applyImpulse(mag);
        }
    }

    return {
        // isPlaying: props.isPlaying,
        // paused: props.paused,
        pause: pause,
        play: play,
        stop: stop,
        sound: sound,
        timestamps: timestamps
    }
}
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
  this.calledback = false;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
var CameraController = function(camera){
	var cur = 0;
	var positions = [
        new THREE.Vector3(-50, 20, 50),
		new THREE.Vector3(0, 3.5, 18),
		new THREE.Vector3(0, 25, 0.1),
	];

	function shiftPos(index){
		var target = positions[index];
		var cameraPos = camera.position;
		var tween = new TWEEN.Tween(cameraPos).to(target, 800);
		tween.easing(TWEEN.Easing.Quadratic.InOut);
		tween.onUpdate(function(){
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		});

		tween.start();

        $('.buttons > .active').removeClass('active');
        $('.buttons').children()[index].classList.add('active');
	}

	function next(){
		var next = (cur == positions.length-1) ? 0 : (cur+1);
		shiftPos(next);
		cur = next;
	}

	function prev() {
        var prev = (cur == 0) ? positions.length - 1 : (cur-1);
        shiftPos(prev);
        cur = prev;
	}

	function reset(){
		cur = 0;
		shiftPos(0);
		camera.pivot.speed = 0;

		var cur = camera.pivot.rotation;
		var target = new THREE.Vector3(0, 0, 0);
		var tween = new TWEEN.Tween(cur).to(target, 300);
		tween.start();
	}

	function spin(time){
		var cur = camera.pivot.rotation;
		var target = new THREE.Vector3();
		target.x = camera.pivot.rotation.x;
		target.y = camera.pivot.rotation.y+(4*Math.PI);
		target.z = camera.pivot.rotation.z;

		var tween = new TWEEN.Tween(cur).to(target, time*1000);
		tween.easing(TWEEN.Easing.Quadratic.InOut);
		tween.start();
	}

	const $buttons = $('#cameraToggle > .buttons')
	for (let i = 0; i < positions.length; i++) {
        let $button = $("<li>", {class: "button", id: i});
        $button.html(i + 1);
        $buttons.append($button);
	}

	$buttons[0].addEventListener('click', (e) => {
		if (e.target.classList.contains('button')) {
			let newInd = parseInt(e.target.id, 10);
			shiftPos(newInd);
		}
	});

	return {
		positions: positions,
		next: next,
		prev: prev,
		shiftPos: shiftPos,
		reset: reset,
		spin: spin
	}

}
var CreateCloud = function(pivot, x, y, z){
	var mesh = new THREE.Object3D();

	var mat = new THREE.MeshPhongMaterial({
		color: 0x3f3772,
		emissive: 0xcbd9ef,
        side: THREE.DoubleSide
	});

	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){

		var geom = (Math.random()>.4) ? new THREE.SphereGeometry(20, 6, 6) : new THREE.BoxGeometry(20,20,20);

		var m = new THREE.Mesh(geom, mat); 
		
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

		if (isSafari || mobile){
			m.castShadow = false;
		}
		else
			m.castShadow = true;

		m.receiveShadow = false;

		mesh.add(m);
	}

	mesh.position.set(x, y, z);

	pivot.add(mesh);

	var speed = Math.random()*.8 + .8;
	function update(){
		mesh.rotation.x += speed*.0015;
	}

	return {
		mesh: pivot,
		update: update
	}
}
const KEYCODES = {
    27: "escape",
    32: "spacebar",
    37: "left arrow",
    38: "up arrow",
    39: "right arrow",
    40: "down arrow",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    191: "/",
};

function keyToCode(key) {
    return Object.keys(KEYCODES)[Object.values(KEYCODES).indexOf(key)];
}

function codeToKey(code) {
    return KEYCODES[code];
}

const MATERIALS = {
    'bubbleGum': new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf572bf),
        emissive: new THREE.Color(0x8c1228),
        roughness: .05,
        metalness: .48,
        side: THREE.DoubleSide,
        flatShading: true,
        morphTargets: true,
        // map : texture
    }),

    'banana': new THREE.MeshStandardMaterial({
        color: 0xbe9a47,
        emissive: 0x676925,
        roughness: .16,
        flatShading: false,
        metalness: 0
    }),

    'lemon': new THREE.MeshStandardMaterial({
        color: 0xbe9a47,
        emissive: 0x676925,
        roughness: .16,
        flatShading: false,
        metalness: 0
    }),

    'starfruit': new THREE.MeshStandardMaterial({
        color: 0xbe9a47,
        emissive: 0x676925,
        roughness: .16,
        flatShading: false,
        metalness: 0
    }),

    'pineapple': new THREE.MeshStandardMaterial({
        color: 0xfedd3a,
        emissive: 0x6f4014,
        roughness: 1,
        flatShading: false,
        metalness: .5
    }),

    'blueberry': new THREE.MeshStandardMaterial({
        color: 0x5c70fb,
        emissive: 0x1235ae,
        roughness: 0,
        flatShading: false,
        metalness: 0
    }),

    'apple': new THREE.MeshStandardMaterial({
        color: 0xfc1820,
        emissive: 0x760314,
        roughness: .1,
        flatShading: false,
        metalness: .5
    }),

    'grapes': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'pear': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'raspberry': new THREE.MeshStandardMaterial({
        color: 0xd9486b,
        emissive: 0x790f15,
        roughness: .14,
        flatShading: false,
        metalness: .3
    }),

    'watermelon': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'pumpkin': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'orange': new THREE.MeshStandardMaterial({
        color: 0xfcfa37,
        emissive: 0xbd4215,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'key': new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
    }),

    'text': new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        overdraw: 0.5,
        side: THREE.DoubleSide
    }),

};

const MODEL_DATA = {
    'banana': {
        geometry: null,
        force: .4,
        materials: MATERIALS['banana'],
        key: 'q',
        sound: '',
        scale: .4
    },
    'blueberry': {
        force: 0.07,
        geometry: null,
        materials: MATERIALS['blueberry'],
        key: 'e',
        sound: '',
        scale: .6
    },
    'apple': {
        scale: 0.27,
        force: 5,
        geometry: null,
        materials: MATERIALS['apple'],
        key: 'a',
        sound: '',
        scale: .1
    },
    'pear': {
        force: 0.06,
        geometry: null,
        materials: MATERIALS['pear'],
        key: 'd',
        sound: '',
        scale: .65
    },
    'raspberry': {
        force: 0.14,
        geometry: null,
        materials: MATERIALS['raspberry'],
        key: 'd',
        sound: '',
        scale: .4
    },
    'grapes': {
        force: 0.4,
        geometry: null,
        materials: MATERIALS['grapes'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'starfruit': {
        force: 0.7,
        geometry: null,
        materials: MATERIALS['starfruit'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'orange': {
        force: 0.35,
        geometry: null,
        materials: MATERIALS['orange'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'pumpkin': {
        force: 0.5,
        geometry: null,
        materials: MATERIALS['pineapple'],
        key: 'd',
        sound: '',
        scale: .35
    },
    'watermelon': {
        force: 0.02,
        scale: .95,
        geometry: null,
        materials: null,
        key: 'd',
        sound: '',
        materials: MATERIALS['watermelon'],
    },
    'lemon': {
        force: 4,
        scale: .14,
        geometry: null,
        materials: null,
        key: 'd',
        sound: '',
        materials: MATERIALS['lemon'],
    }
};

const FONTS_DATA = {
    'fugue': {
        font: null,
        size: 80,
        height: 20,
        curveSegments: 20
    },

};

const AUDIO_DATA = {
    'fresh': {
        buffer: null,
        ext: '.mp3',
        timestamps: {
            '0': {
                mag: .3,
                trig: false,
                lightkeys: 2,
            },
            '.3': {
                mag: .3,
                trig: false,
                lightkeys: 2,
            },
            '.7': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '1': {
                mag: .3,
                trig: false,
                lightkeys: 2,
            },
            '1.2': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '1.7': {
                mag: .3,
                trig: false,
                lightkeys: 2,
            },
            '2.1': {
                mag: .35,
                trig: false,
                lightkeys: 3,
            },
            '2.5': {
                mag: .3,
                trig: false,
                lightkeys: 2,
            },
            '3.3': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '3.7': {
                mag: .4,
                trig: false,
                lightkeys: 4,
            },
            '4.2': {
                mag: .3,
                trig: false,
                lightkeys: 6,
            },
            '4.6': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '5': {
                mag: 1,
                trig: false,
                lightkeys: 6,
            },
            '5.7': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '7': {
                mag: .8,
                trig: false,
                lightkeys: 4,
            },
            '7.5': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '8': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '9.3': {
                mag: 1.3,
                trig: false,
                lightkeys: 12,
                cameraToggle: 1
            },
            '10.6': {
                mag: 1,
                trig: false,
                lightkeys: 6,
            },
            '11.8': {
                mag: 1.3,
                trig: false,
                lightkeys: 4,
            },
            '13.0': {
                mag: 1,
                trig: false,
                lightkeys: 5,
            },
            '14.2': {
                mag: 1.3,
                trig: false,
                lightkeys: 7,
            },
            '15.4': {
                mag: 1,
                trig: false,
                lightkeys: 7,
            },
            '16.6': {
                mag: 1.3,
                trig: false,
                lightkeys: 8,
            },
            '17.7': {
                mag: 0,
                trig: false,
                lightkeys: 26,
                pixelate: 2,
                spin: 2
            },
            '17.8': {
                mag: 1,
                trig: false,
                lightkeys: 7,
            },
            '19.0': {
                mag: .7,
                trig: false,
                lightkeys: 4,
            },
            '19.3': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '19.6': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '19.9': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '20.2': {
                mag: .3,
                trig: false,
                lightkeys: 3,

            },
            '20.5': {
                mag: .3,
                trig: false,
                lightkeys: 3,
            },
            '20.8': {
                mag: .3,
                trig: false,
                lightkeys: 5,
            },
            '21.1': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '21.4': {
                mag: .3,
                trig: false,
                lightkeys: 7,
            },
            '21.7': {
                mag: .3,
                trig: false,
                lightkeys: 6,
            },
            '22.5': {
                mag: 1,
                trig: false,
                lightkeys: 12,
            },
            '23.7': {
                mag: .75,
                trig: false,
                lightkeys: 4,
            },
            '24.2': {
                mag: .75,
                trig: false,
                lightkeys: 4,
            },
            '24.9': {
                mag: .75,
                trig: false,
                lightkeys: 3,
            },
            '26.4': {
                mag: .75,
                trig: false,
                lightkeys: 4,
            },
            '27.': {
                mag: .3,
                trig: false,
                lightkeys: 4,
            },
            '27.5': {
                mag: .4,
                trig: false,
                lightkeys: 8,
            },
            '29': {
                mag: 1.3,
                trig: false,
                lightkeys: 12,
                cameraToggle: 2
            },
            '30.8': {
                mag: .75,
                trig: false,
                lightkeys: 12,
            },
            '31.5': {
                mag: .8,
                trig: false,
                lightkeys: 18,
            },
            '31.75': {
                mag: 1.3,
                trig: false,
                lightkeys: 18,
            },
            '32': {
                mag: .4,
                trig: false,
                lightkeys: 7,
            },
            '32.3': {
                mag: .4,
                trig: false,
                lightkeys: 6,
            },
            '32.7': {
                mag: .3,
                trig: false,
                lightkeys: 7,
            },
            '33.': {
                mag: .3,
                trig: false,
                lightkeys: 7,
            },
            '33.3': {
                mag: .3,
                trig: false,
                lightkeys: 7,
            },
            '33.8': {
                mag: .75,
                trig: false,
                lightkeys: 10,
            },
            '34.2': {
                mag: 1.3,
                trig: false,
                lightkeys: 18,
            },
            '36.0': {
                mag: .3,
                trig: false,
                lightkeys: 18,
            },
            '36.4': {
                mag: .4,
                trig: false,
                lightkeys: 18,
            },
            '36.8': {
                mag: .4,
                trig: false,
                lightkeys: 18,
            },
            '38.6': {
                mag: 1.3,
                trig: false,
                lightkeys: 18,
                cameraToggle: 1,
                pixelate: .4
            },
            '40': {
                mag: .75,
                trig: false,
                lightkeys: 18,
            },
            '40.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '41.2': {
                mag: 1.5,
                trig: false,
                lightkeys: 20,
            },
            '42.2': {
                mag: 1.,
                trig: false,
                lightkeys: 20,
            },
            '43.2': {
                mag: 1.,
                trig: false,
                lightkeys: 15,
            },
            '43.8': {
                mag: 1.,
                trig: false,
                lightkeys: 15,
            },
            '44.1': {
                mag: .3,
                trig: false,
                lightkeys: 5,
            },
            '44.6': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '45': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '45.2': {
                mag: 0.1,
                trig: false,
                lightkeys: 5,
            },
            '45.6': {
                mag: 0.4,
                trig: false,
                lightkeys: 9,
            },
            '45.8': {
                mag: 0.6,
                trig: false,
                lightkeys: 10,
            },
            '46': {
                mag: 0.3,
                trig: false,
                lightkeys: 7,
            },
            '46.5': {
                mag: 0.5,
                trig: false,
                lightkeys: 10,
            },
            '47.2': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '47.5': {
                mag: 0.3,
                trig: false,
                lightkeys: 10,
            },
            '47.8': {
                mag: .4,
                trig: false,
                lightkeys: 11,
            },
            '48.5': {
                mag: 1,
                trig: false,
                lightkeys: 20,
                pixelate: .4,
                cameraToggle: 2
            },
            '49': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.2': {
                mag: .2,
                trig: false,
                lightkeys: 10,
            },
            '49.4': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.6': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.8': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '50.2': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '50.6': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '50.8': {
                mag: 1.4,
                trig: false,
                lightkeys: 20,
            },
            '51.2': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '51.6': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '51.8': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.2': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.4': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.6': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '53': {
                mag: 1,
                trig: false,
                lightkeys: 20,
            },
            '53.5': {
                mag: 1,
                trig: false,
                lightkeys: 20,
            },
            '53.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '55.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '55.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '56': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '56.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '58.': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '58.6': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '59.2': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '59.8': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '60.4': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '60.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '61.4': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '61.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '62.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '63.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '64.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '64.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '67.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '67.6': {
                mag: 1.4,
                trig: false,
                lightkeys: 20,
            },
            '68': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '68.3': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '68.6': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '68.9': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '69.1': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '69.3': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '69.6': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '70': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '70.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '70.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '72.3': {
                mag: 1.,
                trig: false,
                lightkeys: 15,
            },
            '72.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '73.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73.9': {
                mag: 1.2,
                trig: false,
                lightkeys: 15,
            },
            '74.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '74.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '74.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '78.2': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '78.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '78.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '82': {
                mag: 1,
                trig: false,
                lightkeys: 15,
                cameraToggle: 1,
                wavify: .5
            },
            '82.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '82.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.9': {
                mag: .2,
                trig: false,
                lightkeys: 15,
            },
            '84.1': {
                mag: .2,
                trig: false,
                lightkeys: 15,
            },
            '84.5': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '85': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '87': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '87.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '88.6': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '89': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '89.4': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '91.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '91.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '92.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '92.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '92.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '98.1': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '98.5': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '99': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '99.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '99.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '101.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
                cameraToggle: 2,
                pixelate: .3
            },
            '101.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '101.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '102.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '102.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '103': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '103.7': {
                mag: .8,
                trig: false,
                lightkeys: 15,
            },
            '104.1': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '104.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '104.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '106.1': {
                mag: 1.5,
                trig: false,
                lightkeys: 26,
            },
            '106.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '107': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '107.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '108': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '108.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '108.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109.3': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '109.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '110.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '110.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '111': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '111.4': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '111.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '112.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '113': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '113.4': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '113.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '114.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '114.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '115': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '115.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '115.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '116.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '116.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '116.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '119.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '119.3': {
                mag: .45,
                trig: false,
                lightkeys: 15,
                wavify: .6,
                cameraToggle: 1
            },
            '119.5': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '119.7': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '119.9': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '120.4': {
                mag: 1.7,
                trig: false,
                lightkeys: 26,
                spin: .6,
                pixelate: .5
            },
            '121.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '121.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '121.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.8': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '123.1': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '123.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '123.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '126.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '127.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '127.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '127.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '129.8': {
                mag: 1.,
                trig: false,
                lightkeys: 26,
                pixelate: .4
            },
            '130.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '132.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '132.5': {
                mag: 1,
                trig: false,
                lightkeys: 26,
                pixelate: .4,
            },
            '132.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '138': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '138.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '139.4': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
                pixelate: .4,
            },
            '139.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '139.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141.7': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '142': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '149.1': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
                pixelate: .4,
                cameraToggle: 2
            },
            '149.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '149.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151.7': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '152': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '155.5': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.55': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.6': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.65': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.7': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '156': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '158.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '158.7': {
                mag: .7,
                trig: false,
                lightkeys: 26,
            },
            '159.3': {
                mag: .7,
                trig: false,
                lightkeys: 16,
            },
            '159.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '160.3': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '160.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '161.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '162.': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '162.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '163.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '163.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '165.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '165.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '166': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '166.5': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
                pixelate: .6,
                cameraToggle: 1
            },
            '167.3': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '168.2': {
                mag: 1.4,
                trig: false,
                lightkeys: 15,
            },
            '169': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '169.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '170.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '171.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '173.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '173.7': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '175': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '175.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '176': {
                mag: 2,
                trig: false,
                lightkeys: 26,
            },
        }
    }
};

const SOUND_MAPPINGS_1 = {

}

const KEY_MAPPINGS = {
    'q': {},
    'w': {},
    'e': {},
    'r': {},
    't': {},
    'y': {},
    'u': {},
    'i': {},
    'o': {},
    'p': {},
    'a': {},
    's': {},
    'd': {},
    'f': {},
    'g': {},
    'h': {},
    'j': {},
    'k': {},
    'l': {},
    'z': {},
    'x': {},
    'c': {},
    'v': {},
    'b': {},
    'n': {},
    'm': {}
};

const ACTIVE_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
var CreateFruit = function(morphGeom, material, scale = .5, force = 1, sound){

	var mat = Physijs.createMaterial(
		material,	
		.8, // high friction
		.3 // low restitution
	);

	var mesh = new Physijs.BoxMesh(morphGeom, mat);
	mesh.castShadow = true;
	// scale += (2*Math.random()-1)*(.5*scale);
	// scale = (scale < .1) ? .2:scale;

	mesh.scale.set(scale, scale, scale);

	var force = new THREE.Vector3(500, 2200, 500).multiplyScalar(force),
	offset = new THREE.Vector3(0, 5, 0);

	function applyImpulse(mag=1){

		var f = new THREE.Vector3();
		f.copy(force);

		var x = 0,
		y = 5+Math.random() * 2.5,
		z = 0;

		offset.set(x, y, z);
		mesh.applyImpulse(f.multiplyScalar(mag), offset);
	}

	function defineConstraint(){
		var linear_lower = new THREE.Vector3(-1, -10, -1),
		linear_upper = new THREE.Vector3(1, 15, 1);

		var constraint = new Physijs.DOFConstraint(
		    mesh, // First object to be constrained
		    null, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
		  	mesh.position, // point in the scene to apply the constraint
		);

		scene.addConstraint(constraint);

		constraint.setLinearLowerLimit( linear_lower );
		constraint.setLinearUpperLimit( linear_upper );
	}

	function play(){
		applyImpulse();
	}

	return {
		applyImpulse: applyImpulse,
		mesh: mesh,
		force: force,
		offset: offset,
		play: play,
		defineConstraint: defineConstraint,
	}
}
var CreateKey = function () {
    var keyGeometry = new THREE.CubeGeometry(4 / 1.05, 0.1, 4 / 1.05);
    let mesh = new THREE.Mesh(
        keyGeometry,
        MATERIALS['key'].clone()
    );

    function play() {
        // need to tween this
        mesh.material.opacity = 0.8;
        setTimeout(() => {
            mesh.material.opacity = MATERIALS['key'].opacity;
        }, 200);

    };

    return {
        mesh: mesh,
        play: play
    }

}
const ASSETS_PATH = 'assets/models/';
const FONT_ASSETS_PATH = 'assets/fonts/';
const TEXTURE_ASSETS_PATH = 'assets/images/';
const AUDIO_ASSETS_PATH = 'assets/sounds/';

var Loader = (function () {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.JSONLoader(manager);
    const fontLoader = new THREE.FontLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);
    const audioLoader = new THREE.AudioLoader(manager);
    const $progress = $('#progress');

    manager.onProgress = function (item, loaded, total) {
        let percent = Math.ceil(loaded / total * 100);


        $progress.find('.percent').html(percent + '%');
        $progress.find('.bar').css({ 'height':  percent + '%' });

        if (percent >= 100) {
            setTimeout(() => {
                $('#progress').fadeOut()
            }, 350);
        }
    };

    manager.onLoad = function () {
        init();
    };

    this.loadModel = function(file) {
        loader.load( 
            ASSETS_PATH + file + '.json',

            function(geometry, materials){
                MODEL_DATA[file].geometry = geometry;

                // if (materials !== undefined)
                //     MODEL_DATA[file].materials = materials;
            }
        );
    };

    this.loadTexture = function(file){
        textureLoader.load(
            TEXTURE_ASSETS_PATH + file + '.png',

            function(texture){
                TEXTURE_DATA[file] = texture;
            }
        )
    };

    this.loadFont = function(file) {
        fontLoader.load(
            FONT_ASSETS_PATH + file + '.typeface.json',

            function(font) {
                FONTS_DATA[file].font = font;
            }
        );
    };

    this.loadAudio = function(file, ext) {
        audioLoader.load(
            AUDIO_ASSETS_PATH + file + ext,

            function(buffer) {
                AUDIO_DATA[file].buffer = buffer;
            }
        );
    }

    return this;
}());

for (var obj in MODEL_DATA) {
    Loader.loadModel(obj);
}

for (var key in FONTS_DATA) {
    Loader.loadFont(key);
}

for (var key in AUDIO_DATA) {
    var ext = AUDIO_DATA[key].ext;
    Loader.loadAudio(key, ext);
}


'use strict';

Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var box, scene, ground_material, ground, light;
var camera, scene, renderer, controls;
var fruits = [], clouds = [], pivots = [];
var Autoplay, Listener;
var AutoplayProps = {
    isPlaying: false,
    paused: false
}
var composer, wavePass, pixelPass, glitchPass;
var postProcessing = false;
const WORLD_RADIUS = 150;

function resize() {
    var container = document.getElementById('container');
    // camera.aspect = container.clientWidth / container.clientHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    for (var i = 0; i < pivots.length; i++) {
        pivots[i].rotation.y += .001 * pivots[i].speed;
    }

    for (var i = 0; i < clouds.length; i++) {
        clouds[i].update();
    }

    controls.update();
    wavePass.uniforms.time.value += .05;
    TWEEN.update();
}

function loop() {
    update();
    if(postProcessing)
        composer.render();
    else
        renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
}

function init() {
    var container = document.getElementById('container');
    var canvas = document.getElementsByTagName('canvas')[0];
    renderer = new THREE.WebGLRenderer({antialias: (isSafari) ? false:true, logarithmicDepthBuffer: 'logzbuf', canvas: canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xbfe7ff);
    // container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 1000);

    camera.position.set(-50, 20, 50);

    camera.controller = CameraController(camera);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    Listener = new THREE.AudioListener();
    camera.add(Listener);

    var audioLoader = new THREE.AudioLoader();
	var sound = new THREE.PositionalAudio(Listener);
	
	Autoplay = CreateAutoplay(sound, AUDIO_DATA['fresh'].timestamps, camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -60, 0));
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
        }
    );

    var numClouds = (isSafari) ? 0:7 + Math.floor(Math.random() * 7);
    var numPivots = 3;

    for (var i = 0; i < numPivots; i++) {
        pivots[i] = new THREE.Object3D();
        pivots[i].speed = 1 + Math.random() * 2;
    }

    for (var i = 0; i < numClouds; i++) {
        var index = Math.floor(Math.random() * numPivots);

        var angle = Math.random() * Math.PI * 2;
        var x = WORLD_RADIUS * Math.cos(angle),
            y = Math.random() * 50 + 10,
            z = WORLD_RADIUS * Math.sin(angle)
        var cloud = CreateCloud(pivots[index], x, y, z);

        clouds.push(cloud);
        scene.add(cloud.mesh);
    }

    var hemisphereLight = new THREE.HemisphereLight(0xfceafc, 0x000000, .8)

    var shadowLight = new THREE.DirectionalLight(0xffffff, .5);

    shadowLight.position.set(150, 75, 150);

    if(!isSafari && REPORT.maxCombinedTextureImageUnits>60){
        shadowLight.castShadow = true;
        shadowLight.shadow.camera.left = -75;
        shadowLight.shadow.camera.right = 75;
        shadowLight.shadow.camera.top = 75;
        shadowLight.shadow.camera.bottom = -75;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;

        shadowLight.shadow.mapSize.width = 1024;
        shadowLight.shadow.mapSize.height = 1024;
    }

    var shadowLight2 = shadowLight.clone();
    shadowLight2.castShadow = false;
    shadowLight2.intensity = .2;
    shadowLight2.position.set(-150, 75, -150);

    var shadowLight3 = shadowLight.clone();
    shadowLight3.castShadow = false;
    shadowLight3.intensity = .1;
    shadowLight3.position.set(0, 125, 0);

    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(shadowLight2);
    scene.add(shadowLight3);

    const platformWidth = 60,
        platformDepth = 25,
        platformHeight = 150;

    var groundMat = new THREE.MeshPhongMaterial({
        color: 0xffd3ff,
        transparent: true,
        opacity: 1,
        shading: THREE.FlatShading,
    });

    ground_material = Physijs.createMaterial(
        groundMat,
        1., // high friction
        1. // low restitution
    );

    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth),
        // new THREE.ConeGeometry(radius, height, 32, 1),
        ground_material,
        0 // mass
    );

    ground.position.y = -(platformHeight / 2);
    ground.receiveShadow = true;
    scene.add(ground);

    const ROWS = 3;
    const ROW_OFFSET = 2;
    const COLS = 4;
    const SP = 4;

    for (var i = 0; i < ACTIVE_KEYS.length; i++) {
        let k = ACTIVE_KEYS[i];

        KEY_MAPPINGS[k] = Object.assign({}, KEY_MAPPINGS[k], {
            fruit: null,
            text: null,
            border: null,
            audio: null,
        });

        let r, c, offsetX, maxRows = 3, maxCols;

        if (i <= 9) {
            r = 0;
            c = i;
            maxCols = 10;
            offsetX = 0;
        }
        else if (i <= 18) {
            r = 1;
            c = i % 10;
            maxCols = 9;
            offsetX = -SP;
        }
        else {
            r = 2;
            c = (i + 1) % 10;
            maxCols = 7;
            // offsetX = -ROW_OFFSET * SP;
            offsetX = -1.5 * SP;
        }

        let x = SP * (c - Math.floor(maxCols / 2));
        let z = SP * (r - Math.floor(maxRows / 2));
        x += (r * ROW_OFFSET);
        x += offsetX;

        let numFruits = Object.keys(MODEL_DATA).length,
        fruitIndex = Math.floor(numFruits*Math.random()),
        fruitData = MODEL_DATA[Object.keys(MODEL_DATA)[fruitIndex]];

	    let fruit = CreateFruit(
	    	fruitData.geometry,
	    	fruitData.materials.clone(),
	    	fruitData.scale,
	    	fruitData.force,
	    	null
	    );

	    KEY_MAPPINGS[k].fruit = fruit;
	    fruits.push(fruit);
        fruit.mesh.position.set(x, 5, z);
        fruit.mesh.rotation.set(Math.random(), Math.random(), Math.random());
        scene.add(fruit.mesh);

        fruit.defineConstraint();

        let square = CreateKey();
        square.mesh.position.set(x, .1, z);
        KEY_MAPPINGS[k].border = square;
        scene.add(square.mesh);

        let text = CreateText(k);
        text.mesh.position.set(x - 1, .2, z + 1);
        text.mesh.rotation.x = -Math.PI / 2;
        KEY_MAPPINGS[k].text = text;
        scene.add(text.mesh);

        let path = 'assets/sounds/' + k + '.mp3';
        let audio = CreateAudio(path);
        KEY_MAPPINGS[k].audio = audio;

    }

    document.querySelector('#start').addEventListener('click', () => {
        camera.controller.shiftPos(2);
        $('#controls').addClass('started');
        initRest();
    });

    document.querySelector('#mobile-play').addEventListener('click', () => {
        document.querySelector('#title').style.opacity = 0;
        Autoplay.play();
    });

    composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    // renderPass.renderToScreen = true;
    composer.addPass(renderPass);

    var noise = new THREE.TextureLoader().load('assets/images/noise.png');
	noise.wrapT = noise.wrapS = THREE.RepeatWrapping;

	var uniforms = {
		tDiffuse: {value: null},
		noise: {value: noise},
		magnitude: {value : 0.0},
		speed: {value : .5},
		time: {value : 0},
		scale: {value : new THREE.Vector2(1., 1.)}
	}

	WaveShader.uniforms = uniforms;
    wavePass = new THREE.ShaderPass(WaveShader);
    // wavePass.renderToScreen = true;
    composer.addPass(wavePass);

    pixelPass = new THREE.ShaderPass(PixelShader);
    // pixelPass.renderToScreen = true;
    composer.addPass(pixelPass);
    
    composer.wavify = function(time){
        console.log(time);
        postProcessing = true;
        wavePass.renderToScreen = true;
        time*=1000;
    	var cur = wavePass.uniforms['magnitude'];
    	var target = { value: .1};
    	var tween = new TWEEN.Tween(cur).to(target, time/2);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.onUpdate(function(){
            wavePass.uniforms.time.value+=.7;
        })
        tween.onComplete(function(){
            var c = wavePass.uniforms['magnitude'];
            var t = {value: 0.};
            var rTween = new TWEEN.Tween(c).to(t, time/2);
            rTween.onComplete(function(){
                postProcessing = false;
                wavePass.renderToScreen = false;
            });
            rTween.onUpdate(function(){
                wavePass.uniforms.time.value+=.7;
            });
            rTween.easing(TWEEN.Easing.Quadratic.InOut);

            rTween.start();
        });

    	tween.start();
    }

    composer.pixelate = function(time){
        time *= 1000;
        postProcessing = true;
        pixelPass.renderToScreen = true;
        var cur = pixelPass.uniforms['amount'];
        var target = {
            value: 128.
        };

        var cur2 = pixelPass.uniforms['steps'];
        var target2 = {
            value: 15.
        };

        var tween = new TWEEN.Tween(cur).to(target, time/1.5);
        var tween2 = new TWEEN.Tween(cur2).to(target2, time/1.5);

        tween.easing(TWEEN.Easing.Quadratic.Out);
        tween2.easing(TWEEN.Easing.Quadratic.Out);

        tween.onComplete(function(){
            var c = pixelPass.uniforms['amount'];
            var t = {value: 2048. }
            var rTween = new TWEEN.Tween(c).to(t, time/2);
            rTween.start();
        });

        tween2.onComplete(function(){
            var c = pixelPass.uniforms['steps'];
            var t = {value: 1. }
            var rTween = new TWEEN.Tween(c).to(t, time/2);
            rTween.onComplete(()=>{
                postProcessing = false;
                pixelPass.renderToScreen = false;
            })
            rTween.start();
        })
       
        tween.start();
        tween2.start();
    }

    scene.simulate();

    camera.pivot = new THREE.Object3D();
    camera.pivot.add(camera);
    camera.pivot.speed = 0;
    scene.add(camera.pivot);
    pivots.push(camera.pivot);

    window.addEventListener('resize', resize);
    loop();
}

function initRest() {
    $('#title').fadeOut(300);
    $ui.addClass('show');

    // Init Keyboard Overlay
    const $overlay = $('#keyboard-overlay > .keyboard');
    ACTIVE_KEYS.forEach((letter, i) => {
        if (i === 10 || i === 19) {
            $overlay.append('<br/>');
        }
        $overlay.append(`<div class="key">${letter}</div>`)
    });

    document.querySelector('#info .keyboard').addEventListener('click', (e) => {
        $('#keyboard-overlay').toggleClass('show');
    });

    document.querySelector('#info .info').addEventListener('click', (e) => {
        $('#info .info').toggleClass('dark');
        $('#info-overlay').toggleClass('show');
    });

    document.getElementById('dance').onmousedown = Autoplay.play;

    document.getElementById('record').addEventListener('click', (e) => {
        if (SoundRecorder.isRecording()) {
           SoundRecorder.stop();
        } else {
            SoundRecorder.record();
        }
    });

    document.getElementById('loops').addEventListener('click', ()=>{
        $('#bottom').toggleClass('showLoops');
    });

    $('#loops-drawer')[0].addEventListener('click', (e) => {
        let t = e.target;
        if (t.classList.contains('loop')) {
            $(t).find('')

        }
    })

    document.addEventListener('keydown', (e) => {
        if (!e.metaKey) {
            e.preventDefault();
        }

        if (Autoplay.isPlaying) return;

        let key = codeToKey(e.keyCode);
        if (key) {
            let objs = KEY_MAPPINGS[key];

            if (objs) {
                if (objs.fruit) {
                    objs.fruit.play();
                }

                if (objs.text) {
                    objs.text.play();
                }

                if (objs.border) {
                    objs.border.play();
                }

                if (objs.audio) {
                    objs.audio.stop();
                    objs.audio.play();
                }

                if (objs.web_audio_buffer && SoundRecorder.isRecording()) {
                    var source = SoundRecorder.context.createBufferSource();
                    source.buffer = objs.web_audio_buffer;
                    source.connect(SoundRecorder.recorder.node);
                    source.start(0);
                }

            } else {
                if (!isNaN(key)) {
                    let i = parseInt(key, 10);
                    if (i > 0 && camera.controller.positions.length - 1 >= i - 1) {
                        camera.controller.shiftPos(i - 1);
                    }
                } else {
                    switch (key) {
                        case 'left arrow':
                            camera.controller.prev();
                            break;
                        case 'right arrow':
                            camera.controller.next();
                            break;
                        case 'escape':
                            Autoplay.stop();
                            break;
                        case 'spacebar':
                            if (AutoplayProps.paused) {
                                Autoplay.play();
                            } else if (AutoplayProps.isPlaying) {
                                Autoplay.pause();

                            } else {
                                if( SoundRecorder.isRecording()){
                                    SoundRecorder.stop();
                                }
                                else{
                                    // setTimeout(SoundRecorder.record, 200);
                                    SoundRecorder.record();
                                }
                            }
                            break;
                        case 'down arrow':
                            // Recorder.playRecording();
                            break;
                        case '/':
                            $('#keyboard-overlay').toggleClass('show');
                            break;
                        default:
                            break;
                    }
                }

            }
        }
    });
}

var PixelShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"amount": { value: 2048. },
		"steps": { value: 1. }
	},
	vertexShader: [
		"varying highp vec2 vUv;",
		"void main() {",
			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform float amount;",
		"uniform float steps;",

		"varying highp vec2 vUv;",

		"void main(){",	
			"float pixels = amount;",
			"float dx = steps*(1.0 / pixels);",
			"float dy = steps*(1.0 / pixels);",
			"vec2 coord = vec2(dx * floor(vUv.x / dx), dy * floor(vUv.y / dy));",
			"gl_FragColor = texture2D(tDiffuse, coord);",
		"}"
	].join("\n")
};
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Recorder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./recorder").Recorder;

},{"./recorder":2}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Recorder = undefined;

var _inlineWorker = require('inline-worker');

var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Recorder = exports.Recorder = (function () {
    function Recorder(source, cfg) {
        var _this = this;

        _classCallCheck(this, Recorder);

        this.config = {
            bufferLen: 4096,
            numChannels: 2,
            mimeType: 'audio/wav'
        };
        this.recording = false;
        this.callbacks = {
            getBuffer: [],
            exportWAV: []
        };

        Object.assign(this.config, cfg);
        this.context = source.context;
        this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

        this.node.onaudioprocess = function (e) {
            if (!_this.recording) return;

            var buffer = [];
            for (var channel = 0; channel < _this.config.numChannels; channel++) {
                buffer.push(e.inputBuffer.getChannelData(channel));
            }
            _this.worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        };

        source.connect(this.node);
        this.node.connect(this.context.destination); //this should not be necessary

        var self = {};
        this.worker = new _inlineWorker2.default(function () {
            var recLength = 0,
                recBuffers = [],
                sampleRate = undefined,
                numChannels = undefined;

            self.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'record':
                        record(e.data.buffer);
                        break;
                    case 'exportWAV':
                        exportWAV(e.data.type);
                        break;
                    case 'getBuffer':
                        getBuffer();
                        break;
                    case 'clear':
                        clear();
                        break;
                }
            };

            function init(config) {
                sampleRate = config.sampleRate;
                numChannels = config.numChannels;
                initBuffers();
            }

            function record(inputBuffer) {
                for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel].push(inputBuffer[channel]);
                }
                recLength += inputBuffer[0].length;
            }

            function exportWAV(type) {
                var buffers = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                var interleaved = undefined;
                if (numChannels === 2) {
                    interleaved = interleave(buffers[0], buffers[1]);
                } else {
                    interleaved = buffers[0];
                }
                var dataview = encodeWAV(interleaved);
                var audioBlob = new Blob([dataview], { type: type });

                self.postMessage({ command: 'exportWAV', data: audioBlob });
            }

            function getBuffer() {
                var buffers = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                self.postMessage({ command: 'getBuffer', data: buffers });
            }

            function clear() {
                recLength = 0;
                recBuffers = [];
                initBuffers();
            }

            function initBuffers() {
                for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel] = [];
                }
            }

            function mergeBuffers(recBuffers, recLength) {
                var result = new Float32Array(recLength);
                var offset = 0;
                for (var i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                }
                return result;
            }

            function interleave(inputL, inputR) {
                var length = inputL.length + inputR.length;
                var result = new Float32Array(length);

                var index = 0,
                    inputIndex = 0;

                while (index < length) {
                    result[index++] = inputL[inputIndex];
                    result[index++] = inputR[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function floatTo16BitPCM(output, offset, input) {
                for (var i = 0; i < input.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }

            function writeString(view, offset, string) {
                for (var i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            function encodeWAV(samples) {
                var buffer = new ArrayBuffer(44 + samples.length * 2);
                var view = new DataView(buffer);

                /* RIFF identifier */
                writeString(view, 0, 'RIFF');
                /* RIFF chunk length */
                view.setUint32(4, 36 + samples.length * 2, true);
                /* RIFF type */
                writeString(view, 8, 'WAVE');
                /* format chunk identifier */
                writeString(view, 12, 'fmt ');
                /* format chunk length */
                view.setUint32(16, 16, true);
                /* sample format (raw) */
                view.setUint16(20, 1, true);
                /* channel count */
                view.setUint16(22, numChannels, true);
                /* sample rate */
                view.setUint32(24, sampleRate, true);
                /* byte rate (sample rate * block align) */
                view.setUint32(28, sampleRate * 4, true);
                /* block align (channel count * bytes per sample) */
                view.setUint16(32, numChannels * 2, true);
                /* bits per sample */
                view.setUint16(34, 16, true);
                /* data chunk identifier */
                writeString(view, 36, 'data');
                /* data chunk length */
                view.setUint32(40, samples.length * 2, true);

                floatTo16BitPCM(view, 44, samples);

                return view;
            }
        }, self);

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                numChannels: this.config.numChannels
            }
        });

        this.worker.onmessage = function (e) {
            var cb = _this.callbacks[e.data.command].pop();
            if (typeof cb == 'function') {
                cb(e.data.data);
            }
        };
    }

    _createClass(Recorder, [{
        key: 'record',
        value: function record() {
            this.recording = true;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.recording = false;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.worker.postMessage({ command: 'clear' });
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer(cb) {
            cb = cb || this.config.callback;
            if (!cb) throw new Error('Callback not set');

            this.callbacks.getBuffer.push(cb);

            this.worker.postMessage({ command: 'getBuffer' });
        }
    }, {
        key: 'exportWAV',
        value: function exportWAV(cb, mimeType) {
            mimeType = mimeType || this.config.mimeType;
            cb = cb || this.config.callback;
            if (!cb) throw new Error('Callback not set');

            this.callbacks.exportWAV.push(cb);

            this.worker.postMessage({
                command: 'exportWAV',
                type: mimeType
            });
        }
    }], [{
        key: 'forceDownload',
        value: function forceDownload(blob, filename) {
            var url = (window.URL || window.webkitURL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = url;
            link.download = filename || 'output.wav';
            var click = document.createEvent("Event");
            click.initEvent("click", true, true);
            link.dispatchEvent(click);
        }
    }]);

    return Recorder;
})();

exports.default = Recorder;

},{"inline-worker":3}],3:[function(require,module,exports){
"use strict";

module.exports = require("./inline-worker");
},{"./inline-worker":4}],4:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

var InlineWorker = (function () {
  function InlineWorker(func, self) {
    var _this = this;

    _classCallCheck(this, InlineWorker);

    if (WORKER_ENABLED) {
      var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
      var url = global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" }));

      return new global.Worker(url);
    }

    this.self = self;
    this.self.postMessage = function (data) {
      setTimeout(function () {
        _this.onmessage({ data: data });
      }, 0);
    };

    setTimeout(function () {
      func.call(self);
    }, 0);
  }

  _createClass(InlineWorker, {
    postMessage: {
      value: function postMessage(data) {
        var _this = this;

        setTimeout(function () {
          _this.self.onmessage({ data: data });
        }, 0);
      }
    }
  });

  return InlineWorker;
})();

module.exports = InlineWorker;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
// Safari 3.0+ "[object HTMLElementConstructor]" 
const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

const mobile = (function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
})();

/* AUTHOR: Analytical Graphics, Inc.
Test functions taken from 'webglreport':
https://github.com/AnalyticalGraphicsInc/webglreport 
*/

const REPORT = (function(){
	var webglVersion = window.location.search.indexOf('v=2') > 0 ? 2 : 1;

    // var template = _.template($('#reportTemplate').html());
    var report = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        webglVersion: webglVersion
    };

    var canvas = document.getElementsByTagName('canvas')[0];
    var gl;

    var possibleNames = (webglVersion === 2) ? ['webgl2', 'experimental-webgl2'] : ['webgl', 'experimental-webgl'];
    var contextName;
    for(var i=0; i<possibleNames.length; i++){
    	var name = possibleNames[i];
    	if (canvas.getContext(name, { stencil: true }) == null){
    		continue;
    	}
    	else{
    		contextName = name;
    		gl = canvas.getContext(name, { stencil: true });
    	}
    }

    report.gl = gl;
    report.contextName = contextName;


    function describeRange(value) {
        return '[' + value[0] + ', ' + value[1] + ']';
    }

    function getMaxAnisotropy() {
        var e = gl.getExtension('EXT_texture_filter_anisotropic')
                || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');

        if (e) {
            var max = gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            // See Canary bug: https://code.google.com/p/chromium/issues/detail?id=117450
            if (max === 0) {
                max = 2;
            }
            return max;
        }
        return 'n/a';
    }

    function formatPower(exponent, verbose) {
        if (verbose) {
            return '' + Math.pow(2, exponent);
        } else {
            return '2<sup>' + exponent + '</sup>';
        }
    }

    function getPrecisionDescription(precision, verbose) {
        var verbosePart = verbose ? ' bit mantissa' : '';
        return '[-' + formatPower(precision.rangeMin, verbose) + ', ' + formatPower(precision.rangeMax, verbose) + '] (' + precision.precision + verbosePart + ')'
    }

    function getBestFloatPrecision(shaderType) {
        var high = gl.getShaderPrecisionFormat(shaderType, gl.HIGH_FLOAT);
        var medium = gl.getShaderPrecisionFormat(shaderType, gl.MEDIUM_FLOAT);
        var low = gl.getShaderPrecisionFormat(shaderType, gl.LOW_FLOAT);

        var best = high;
        if (high.precision === 0) {
            best = medium;
        }

        return '<span title="High: ' + getPrecisionDescription(high, true) + '\n\nMedium: ' + getPrecisionDescription(medium, true) + '\n\nLow: ' + getPrecisionDescription(low, true) + '">' +
            getPrecisionDescription(best, false) + '</span>';
    }

    function getFloatIntPrecision(gl) {
        var high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        var s = (high.precision !== 0) ? 'highp/' : 'mediump/';

        high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT);
        s += (high.rangeMax !== 0) ? 'highp' : 'lowp';

        return s;
    }

    function isPowerOfTwo(n) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }

    function getAngle(gl) {
        var lineWidthRange = describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE));

        // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
        var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
            (gl.getParameter(gl.RENDERER) !== 'Internet Explorer') &&
            (gl.getParameter(gl.RENDERER) !== 'Microsoft Edge') &&
            (lineWidthRange === describeRange([1,1]));

        if (angle) {
            // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
            // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
            //
            // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
            // due to driver bugs, etc.
            if (isPowerOfTwo(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)) && isPowerOfTwo(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                return 'Yes, D3D11';
            } else {
                return 'Yes, D3D9';
            }
        }

        return 'No';
    }

    function getMajorPerformanceCaveat(contextName) {
        // Does context creation fail to do a major performance caveat?
        var canvas2 = document.createElement('canvas');
        var gl = canvas2.getContext(contextName, { failIfMajorPerformanceCaveat : true });
        canvas2.remove();

        if (!gl) {
            // Our original context creation passed.  This did not.
            return 'Yes';
    }

        if (typeof gl.getContextAttributes().failIfMajorPerformanceCaveat === 'undefined') {
            // If getContextAttributes() doesn't include the failIfMajorPerformanceCaveat
            // property, assume the browser doesn't implement it yet.
            return 'Not implemented';
        }

    return 'No';
    }

    function getDraftExtensionsInstructions() {
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
            return 'To see draft extensions in Chrome, browse to about:flags, enable the "Enable WebGL Draft Extensions" option, and relaunch.';
        } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            return 'To see draft extensions in Firefox, browse to about:config and set webgl.enable-draft-extensions to true.';
        }

        return '';
    }

    function getMaxColorBuffers(gl) {
        var maxColorBuffers = 1;
        var ext = gl.getExtension("WEBGL_draw_buffers");
        if (ext != null) 
            maxColorBuffers = gl.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
        
        return maxColorBuffers;
    }

    function getUnmaskedInfo(gl) {
        var unMaskedInfo = {
            renderer: '',
            vendor: ''
        };
        
        var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (dbgRenderInfo != null) {
            unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
            unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
        }
        
        return unMaskedInfo;
    }

    function showNull(v) {
        return (v === null) ? 'n/a' : v;
    }
    
    var webglToEsNames = {
        'getInternalformatParameter' : 'getInternalformativ',
        'uniform1ui' : 'uniform',
        'uniform2ui' : 'uniform',
        'uniform3ui' : 'uniform',
        'uniform4ui' : 'uniform',
        'uniform1uiv' : 'uniform',
        'uniform2uiv' : 'uniform',
        'uniform3uiv' : 'uniform',
        'uniform4uiv' : 'uniform',
        'uniformMatrix2x3fv' : 'uniform',
        'uniformMatrix3x2fv' : 'uniform',
        'uniformMatrix2x4fv' : 'uniform',
        'uniformMatrix4x2fv' : 'uniform',
        'uniformMatrix3x4fv' : 'uniform',
        'uniformMatrix4x3fv' : 'uniform',
        'vertexAttribI4i' : 'vertexAttrib',
        'vertexAttribI4iv' : 'vertexAttrib',
        'vertexAttribI4ui' : 'vertexAttrib',
        'vertexAttribI4uiv' : 'vertexAttrib',
        'vertexAttribIPointer' : 'vertexAttribPointer',
        'vertexAttribDivisor' : 'vertexAttribDivisor',
        'createQuery' : 'genQueries',
        'deleteQuery' : 'deleteQueries',
        'endQuery' : 'beginQuery',
        'getQuery' : 'getQueryiv',
        'getQueryParameter' : 'getQueryObjectuiv',
        'samplerParameteri' : 'samplerParameter',
        'samplerParameterf' : 'samplerParameter',
        'clearBufferiv' : 'clearBuffer',
        'clearBufferuiv' : 'clearBuffer',
        'clearBufferfv' : 'clearBuffer',
        'clearBufferfi' : 'clearBuffer',
        'createSampler' : 'genSamplers',
        'deleteSampler' : 'deleteSamplers',
        'getSyncParameter' : 'getSynciv',
        'createTransformFeedback' : 'genTransformFeedbacks',
        'deleteTransformFeedback' : 'deleteTransformFeedbacks',
        'endTransformFeedback' : 'beginTransformFeedback',
        'getIndexedParameter' : 'get',
        'getActiveUniforms' : 'getActiveUniformsiv',
        'getActiveUniformBlockParameter' : 'getActiveUniformBlockiv',
        'createVertexArray' : 'genVertexArrays',
        'deleteVertexArray' : 'deleteVertexArrays'
    };

    function getWebGL2ExtensionUrl(name) {
        if (name === 'getBufferSubData') {
            return 'http://www.opengl.org/sdk/docs/man/docbook4/xhtml/glGetBufferSubData.xml';
        }

        if (webglToEsNames[name]) {
            name = webglToEsNames[name];
        }

        var filename = 'gl' + name[0].toUpperCase() + name.substring(1) + '.xhtml';
        return 'http://www.khronos.org/opengles/sdk/docs/man3/html/' + filename;
    }

    function getWebGL2Status(gl, contextName) {
        var webgl2Names = [
            'copyBufferSubData',
            'getBufferSubData',
            'blitFramebuffer',
            'framebufferTextureLayer',
            'getInternalformatParameter',
            'invalidateFramebuffer',
            'invalidateSubFramebuffer',
            'readBuffer',
            'renderbufferStorageMultisample',
            'texStorage2D',
            'texStorage3D',
            'texImage3D',
            'texSubImage3D',
            'copyTexSubImage3D',
            'compressedTexImage3D',
            'compressedTexSubImage3D',
            'getFragDataLocation',
            'uniform1ui',
            'uniform2ui',
            'uniform3ui',
            'uniform4ui',
            'uniform1uiv',
            'uniform2uiv',
            'uniform3uiv',
            'uniform4uiv',
            'uniformMatrix2x3fv',
            'uniformMatrix3x2fv',
            'uniformMatrix2x4fv',
            'uniformMatrix4x2fv',
            'uniformMatrix3x4fv',
            'uniformMatrix4x3fv',
            'vertexAttribI4i',
            'vertexAttribI4iv',
            'vertexAttribI4ui',
            'vertexAttribI4uiv',
            'vertexAttribIPointer',
            'vertexAttribDivisor',
            'drawArraysInstanced',
            'drawElementsInstanced',
            'drawRangeElements',
            'drawBuffers',
            'clearBufferiv',
            'clearBufferuiv',
            'clearBufferfv',
            'clearBufferfi',
            'createQuery',
            'deleteQuery',
            'isQuery',
            'beginQuery',
            'endQuery',
            'getQuery',
            'getQueryParameter',
            'createSampler',
            'deleteSampler',
            'isSampler',
            'bindSampler',
            'samplerParameteri',
            'samplerParameterf',
            'getSamplerParameter',
            'fenceSync',
            'isSync',
            'deleteSync',
            'clientWaitSync',
            'waitSync',
            'getSyncParameter',
            'createTransformFeedback',
            'deleteTransformFeedback',
            'isTransformFeedback',
            'bindTransformFeedback',
            'beginTransformFeedback',
            'endTransformFeedback',
            'transformFeedbackVaryings',
            'getTransformFeedbackVarying',
            'pauseTransformFeedback',
            'resumeTransformFeedback',
            'bindBufferBase',
            'bindBufferRange',
            'getIndexedParameter',
            'getUniformIndices',
            'getActiveUniforms',
            'getUniformBlockIndex',
            'getActiveUniformBlockParameter',
            'getActiveUniformBlockName',
            'uniformBlockBinding',
            'createVertexArray',
            'deleteVertexArray',
            'isVertexArray',
            'bindVertexArray'
        ];

        var webgl2 = (contextName.indexOf('webgl2') !== -1);

        var functions = [];
        var totalImplemented = 0;
        var length = webgl2Names.length;

        if (webgl2) {
            for (var i = 0; i < length; ++i) {
                var name = webgl2Names[i];
                var className = 'extension';
                if (webgl2 && gl[name]) {
                    ++totalImplemented;
                } else {
                    className += ' unsupported';
                }
                functions.push({ name: name, className: className });
            }
        }

        return {
            status : webgl2 ? (totalImplemented + ' of ' + length + ' new functions implemented.') :
                'webgl2 and experimental-webgl2 contexts not available.',
            functions : functions
        };
    }

    var webgl2Status = getWebGL2Status(gl, contextName);


    report = Object.assign(report, {
        contextName: contextName,
        glVersion: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        unMaskedVendor: getUnmaskedInfo(gl).vendor,
        unMaskedRenderer: getUnmaskedInfo(gl).renderer,
        antialias:  gl.getContextAttributes().antialias ? 'Available' : 'Not available',
        angle: getAngle(gl),
        majorPerformanceCaveat: getMajorPerformanceCaveat(contextName),
        maxColorBuffers: getMaxColorBuffers(gl),
        redBits: gl.getParameter(gl.RED_BITS),
        greenBits: gl.getParameter(gl.GREEN_BITS),
        blueBits: gl.getParameter(gl.BLUE_BITS),
        alphaBits: gl.getParameter(gl.ALPHA_BITS),
        depthBits: gl.getParameter(gl.DEPTH_BITS),
        stencilBits: gl.getParameter(gl.STENCIL_BITS),
        maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
        maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
        maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        aliasedLineWidthRange: describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)),
        aliasedPointSizeRange: describeRange(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)),
        maxViewportDimensions: describeRange(gl.getParameter(gl.MAX_VIEWPORT_DIMS)),
        maxAnisotropy: getMaxAnisotropy(),
        vertexShaderBestPrecision: getBestFloatPrecision(gl.VERTEX_SHADER),
        fragmentShaderBestPrecision: getBestFloatPrecision(gl.FRAGMENT_SHADER),
        fragmentShaderFloatIntPrecision: getFloatIntPrecision(gl),

        extensions: gl.getSupportedExtensions(),
        draftExtensionsInstructions: getDraftExtensionsInstructions(),

        webgl2Status : webgl2Status.status,
        webgl2Functions : webgl2Status.functions
    });

    if (webglVersion > 1) {
        report = Object.assign(report, {
            maxVertexUniformComponents: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_COMPONENTS)),
            maxVertexUniformBlocks: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS)),
            maxVertexOutputComponents: showNull(gl.getParameter(gl.MAX_VERTEX_OUTPUT_COMPONENTS)),
            maxVaryingComponents: showNull(gl.getParameter(gl.MAX_VARYING_COMPONENTS)),
            maxFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_COMPONENTS)),
            maxFragmentUniformBlocks: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS)),
            maxFragmentInputComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_INPUT_COMPONENTS)),
            minProgramTexelOffset: showNull(gl.getParameter(gl.MIN_PROGRAM_TEXEL_OFFSET)),
            maxProgramTexelOffset: showNull(gl.getParameter(gl.MAX_PROGRAM_TEXEL_OFFSET)),
            maxDrawBuffers: showNull(gl.getParameter(gl.MAX_DRAW_BUFFERS)),
            maxColorAttachments: showNull(gl.getParameter(gl.MAX_COLOR_ATTACHMENTS)),
            maxSamples: showNull(gl.getParameter(gl.MAX_SAMPLES)),
            max3dTextureSize: showNull(gl.getParameter(gl.MAX_3D_TEXTURE_SIZE)),
            maxArrayTextureLayers: showNull(gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS)),
            maxTextureLodBias: showNull(gl.getParameter(gl.MAX_TEXTURE_LOD_BIAS)),
            maxUniformBufferBindings: showNull(gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)),
            maxUniformBlockSize: showNull(gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE)),
            uniformBufferOffsetAlignment: showNull(gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT)),
            maxCombinedUniformBlocks: showNull(gl.getParameter(gl.MAX_COMBINED_UNIFORM_BLOCKS)),
            maxCombinedVertexUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS)),
            maxCombinedFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS)),
            maxTransformFeedbackInterleavedComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS)),
            maxTransformFeedbackSeparateAttribs: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)),
            maxTransformFeedbackSeparateComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS)),
            maxElementIndex: showNull(gl.getParameter(gl.MAX_ELEMENT_INDEX)),
            maxServerWaitTimeout: showNull(gl.getParameter(gl.MAX_SERVER_WAIT_TIMEOUT))
        });
    }


    return report;

})();
const TEXT_COLORS = {
    orange: new THREE.Color(0xffb13d),
    blue: new THREE.Color(0x3e9ce0),
    pink: new THREE.Color(0xe03e82),
    green: new THREE.Color(0x336633),
    purple: new THREE.Color(0x6c0fff)
};

var CreateText = function(letter) {

    var textGeometry = new THREE.TextGeometry(letter, {
        font: FONTS_DATA['fugue'].font,
        size: 2,
        height: 0.15,
        curveSegments: 20
    });
    textGeometry.computeBoundingBox();

    let index = Math.floor(Math.random()*(Object.keys(TEXT_COLORS).length-1));
    let color = TEXT_COLORS[ Object.keys(TEXT_COLORS)[index] ];
    let mat = MATERIALS['text'].clone();
    mat.color = color;

    let mesh = new THREE.Mesh(textGeometry, mat);

    function play() {
        changeColor();
    };

    function changeColor(){
        let index = Math.floor(Math.random()*(Object.keys(TEXT_COLORS).length-1));
        let color = TEXT_COLORS[ Object.keys(TEXT_COLORS)[index] ];
        mesh.material.color = (mesh.material.color == color) ? TEXT_COLORS[ Object.keys(TEXT_COLORS)[index+1] ] : color; 
    }

    return {
        mesh: mesh,
        // changeColor: changeColor,
        play: play
    }

}
const DANCE_COLORS = [
'#ff960c',
'#23cfff',
'#ff237f',
'#28ff28',
'#6f1df2' 
];

var color = '#333333';
var dance = document.getElementById('dance');
var $ui = $('#cameraToggle, #info, #bottom');
var start = document.getElementById('start');

dance.addEventListener('mouseover', ()=>{
	var index = Math.floor(Math.random()*(DANCE_COLORS.length-1));
	color = (DANCE_COLORS[index] == color) ? DANCE_COLORS[index+1] : DANCE_COLORS[index];

	var text = dance.getElementsByTagName('a')[0];
	text.style.color = color;
});

dance.addEventListener('mouseout', ()=>{
	var text = dance.getElementsByTagName('a')[0];
	text.style.color = '#333333';
});

if(mobile){
	var uielems = document.getElementsByClassName('ui');
	for(var i=0; i<uielems.length; i++){
		uielems[i].style.display = 'none';
	}
	document.getElementById('start').style.display = 'none';
	document.getElementById('mobile-play').style.display = 'block';
}
var WaveShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"noise": { value: null },
		"magnitude": { value: null },
		"time": { value: 0 },
		"speed": { value: null },
		"scale":   { value: null },
	},
	vertexShader: [
		"varying highp vec2 vUv;",
		"void main() {",
			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [
		"uniform highp sampler2D tDiffuse;",
		"uniform sampler2D noise;",
		"uniform float magnitude;",
		"uniform float time;",
		"uniform float speed;",
		"uniform vec2 scale;",

		"varying highp vec2 vUv;",

		"void main(){",

			"/*get displacement w perlin noise*/",
			"vec4 map = texture2D(noise, vUv + time*speed*.01);",
			"map -= .5;",

			"/*add sin movement to displacement for slight wave effect*/",
			"map.xy *= sin(vUv.y*100.+time*speed);",
			"map.xy *= scale * .8 * magnitude;",

			"vec4 color = texture2D(tDiffuse, vec2(vUv.x - map.x, vUv.y - map.y));",

			"gl_FragColor = color;",
		"}"
	].join("\n")
}
var SoundRecorder;

function initRecorder() {

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch (e) {
        console.err('Browser does not support the Web Audio API. Recordings will not be possible.');
        return;
    }

    var recorder,
        context,
        bufferLoader,
        destination,
        sources = [],
        chunks = [],
        sound_paths = [],
        audioRecordings = [];

    var isRecording = false;
    
    for (var i = 0; i < ACTIVE_KEYS.length; i++) {
        var key = ACTIVE_KEYS[i];
        var path = AUDIO_ASSETS_PATH + key + '.mp3';
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

        bufferLoader.calledback = true;

        recorder = new Recorder(destination);

        for (var key in KEY_MAPPINGS) {
            var index = ACTIVE_KEYS.indexOf(key);
            var buffer = bufferList[index];
            KEY_MAPPINGS[key].web_audio_buffer = buffer;
        }

        function getRecordingStatus() {
            return recorder.recording;
        }

        function record() {
            $('#record').toggleClass('recording');
            recorder.clear();
            recorder.record();
        }

        function stop() {
            $('#record').toggleClass('recording');
            recorder.stop();
            recorder.exportWAV(function(blob){
                var url = URL.createObjectURL(blob);
                var audio = document.createElement('audio');
                audio.src = url;
                audio.loop = true;
                audioRecordings.push(audio);

                let i = audioRecordings.length-1;

                let $loops = $('#loops-drawer');
                
                let $loop = $('<div>', {class: 'loop'});
                let $controls = $('<div>', {class: 'controls'});
                let $icon = $('<i>', {class: 'fa fa-play show'});
                let $iconPause = $('<i>', {class: 'fa fa-pause hide'});
                (function() {
                    $icon[0].addEventListener('click', () => {
                        SoundRecorder.audioRecordings[i].play();
                        $iconPause.removeClass('hide');
                        $iconPause.addClass('show');
                        $icon.removeClass('show');
                        $icon.addClass('hide');
                    });

                    $iconPause[0].addEventListener('click', () => {
                        SoundRecorder.audioRecordings[i].pause();
                        SoundRecorder.audioRecordings[i].currentTime = 0;
                        $icon.removeClass('hide');
                        $icon.addClass('show');
                        $iconPause.removeClass('show');
                        $iconPause.addClass('hide');
                    });
                }(i));

                $loop.append('<div class="title">Loop ' + (i+1) + '</div>');
                $controls.append($icon);
                $controls.append($iconPause);
                $loop.append($controls);

                $loops.append($loop);

            });

            isRecording = false;
        }

        SoundRecorder = {
            recorder: recorder,
            context: context,
            destination: destination,
            isRecording: getRecordingStatus,
            record: record,
            stop: stop,
            audioRecordings: audioRecordings
        }
    }

    bufferLoader.load();

}

if(!mobile){
   initRecorder();
}