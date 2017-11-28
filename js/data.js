// var MODEL_DATA = {
// 	'banana' : {
// 		url: 'assets/models/banana.json',
// 		geometry: null,
// 		materials: null
// 	}
// };

var MODEL_DATA = [
	{
		url: 'assets/models/banana.json',
		geometry: null,
		key: 'a',
		materials: null,
		sound: ''
	}
];

var MATERIALS = {
	'bubbleGum': new THREE.MeshPhongMaterial({
		color : new THREE.Color(0xff7eca),
		emissive : new THREE.Color(0x89174d),
		specular : new THREE.Color(0xbe045b),
		side : THREE.DoubleSide,
		shininess : 100,
		// flatShading : true
	}),
}

var OBJECTS = {
	'CenterPlanet': null,
	'Planet': null,
	'Planet2': null,
	'Planet3': null,
	'Planet4': null,
	'Planet5': null,
	'Universe': null,
}