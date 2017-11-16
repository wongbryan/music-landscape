var MODEL_DATA = {
	'banana' : {
		geometry: null,
		materials: null
	},
	'blueberry' : {
		geometry: null,
		materials: null
	},
	'banana_cube' : {
		geometry: null,
		materials: null
	}
}

var MATERIALS = {
	'bubbleGum': new THREE.MeshStandardMaterial({
		color : new THREE.Color(0xf572bf),
		emissive : new THREE.Color(0x8c1228),
		roughness : .05,
		metalness : .48,
		side : THREE.DoubleSide,
		flatShading : true,
		morphTargets : true,
		// map : texture
	})

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