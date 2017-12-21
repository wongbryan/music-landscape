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