var Options = {
  Land: {
    color: new THREE.Color(0xff0000),
		stepsX : 200,
		stepsY : 100,
		stepSize : 1,
		amp : 12
	},
	// 'Avatar' : {
	// 	color : new THREE.Color(0xffffff),
	// 	radius : 3,
	// }
};


var OBJECTS_TO_LOAD = [
	{
		name: 'banana',
        // material: new THREE.MeshStandardMaterial({
        //     color: new THREE.Color(0xf572bf),
        //     emissive: new THREE.Color(0x8c1228),
        //     roughness: .05,
        //     metalness: .48,
        //     side: THREE.DoubleSide,
        //     flatShading: true
        // })
	}
];

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
	'Planet': {

	}
}