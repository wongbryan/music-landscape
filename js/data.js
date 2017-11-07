var MODEL_DATA = {
	'banana' : {
		url: 'assets/models/banana.json',
		geometry: null,
		materials: null
	}
}

var MATERIALS = {
	'bubbleGum': new THREE.MeshPhongMaterial({
		color : new THREE.Color(0xff7eca),
		emissive : new THREE.Color(0x89174d),
		specular : new THREE.Color(0xbe045b),
		shininess : 100,
		flatShading : true
	}),
}

var OBJECTS = {
	'Planet': null,
}