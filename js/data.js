var MODEL_DATA = {
	'banana' : {
		geometry: null,
		materials: null
	},
	'banana-low' : {
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
	},
	'apple' : {
		geometry: null,
		materials: null
	},
	'jelly' : {
		geometry: null,
		materials: null
	},
}

var TEXTURE_DATA = {
	'blueberry' : null,
	'apple' : null,
	'banana' : null,
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
	}),

	'banana' : new THREE.MeshPhongMaterial({
		color: new THREE.Color(0xfef45d),
		emissive: new THREE.Color(0xf5d44f)
	}),

	'blueberry' : new THREE.MeshPhongMaterial({
		color: 0x57fcfe,
		emissive: 0x7e95f6,
		specular: 0x593453,
		shininess: 27,
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