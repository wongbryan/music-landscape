const DANCE_COLORS = [
'#ff960c',
'#23cfff',
'#ff237f',
'#28ff28',
'#6f1df2' 
];

var UIController = (function(){
	var dance = document.getElementById('dance');
	var color = '#333333';

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

	var play = document.getElementById('play');

	play.addEventListener('mouseover',  ()=>{
		var index = Math.floor(Math.random()*(DANCE_COLORS.length-1));
		var color = (DANCE_COLORS[index] == color) ? DANCE_COLORS[index+1] : DANCE_COLORS[index];

		play.style.backgroundColor = color;
		play.getElementsByTagName('a')[0].style.color = "white";
	});

	play.addEventListener('mouseout',  ()=>{
		play.style.background = "rgba(255, 255, 255, .5)";
		play.getElementsByTagName('a')[0].style.color = "#333333";
	});

	var playUI = document.getElementById('playUI');

	var homeUI = document.getElementById('home');

	function hideHome(){
		homeUI.classList.remove('show');
		homeUI.classList.add('hide');
	}

	function hidePlayUI(){
		playUI.classList.remove('show');
		playUI.classList.add('hide');
	}

	function showHome(){
		homeUI.classList.remove('hide');
		homeUI.classList.add('show');
	}

	function showPlayUI(){
		playUI.classList.remove('hide');
		playUI.classList.add('show');
	}

	function goPlay(){
		hideHome();
		showPlayUI();
	}

	function goDance(){
		console.log('hello');
		hideHome();
		hidePlayUI();
	}

	function goHome(){
		console.log('home');
		hidePlayUI();
		showHome();
	}

	play.onmousedown = function(){
		goPlay();
		setTimeout(()=>{
			camera.controller.shiftPos(2);
		}, 200);
	}
	dance.onmousedown = function(){
		goDance();
		var bars = document.getElementsByClassName('bar');
		bars[0].style.top = "0%";
		bars[1].style.bottom = "0%";
		setTimeout(function(){Autoplay.play();}, 200);
	};

	var homeBut = document.getElementById('home-button');
	homeBut.onmousedown = goHome;

	return{
		play: goPlay,
		dance: goDance,
		home: goHome
	}
})();