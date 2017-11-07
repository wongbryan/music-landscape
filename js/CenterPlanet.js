var CenterPlanet;
var InitCenterPlanet = (function(modelGeom) {
	// var sphereGeometry = new THREE.SphereBufferGeometry(.005, .005, 8, 8);
	var circleGeometry = new THREE.CircleBufferGeometry(1, 6);
	var geometry = new THREE.InstancedBufferGeometry();
	// geometry.copy(sphereGeometry);
	geometry.copy(circleGeometry)

	var positions = modelGeom.vertices;
	var instances = positions.length;

	var minX = 0;
	var translateArray = new Float32Array(instances*3);
	for (var i=0; i<positions.length; i++){
		var index = i*3,
		v = positions[i];

		if (minX > v.x)
			minX = v.x;

		translateArray[index] = v.x;
		translateArray[index+1] = v.y;
		translateArray[index+2] = v.z;
	}

	var translateAttribute = new THREE.InstancedBufferAttribute(translateArray, 3, 1);
	geometry.addAttribute('translate', translateAttribute);
	
	modelGeom.computeBoundingBox();
	var length = modelGeom.boundingBox.max.x-modelGeom.boundingBox.min.x;	

	var sprite = new THREE.TextureLoader().load('assets/images/circle.png');

	var mat = new THREE.ShaderMaterial({
		vertexShader : SHADERS['instancing'].vertex,
		fragmentShader : SHADERS['instancing'].fragment,
		uniforms : {
			'time' : { 'value' : 0. },
			'minX' : { 'value' : minX },
			'length' : { 'value' : length },
			'map' : { 'value' : sprite }
		}
	});

	var mesh = new THREE.Mesh(geometry, mat);
	mesh.rotation.z = Math.PI/6;
	var s = 5;
	mesh.scale.set(s, s, s)

	var time = 0;

	function update(){
		time += .025;
		mesh.material.uniforms['time'].value = time;
	}

	function addToScene(){
		scene.add(mesh);
	}

	return {
		mesh: mesh,
		addToScene: addToScene,
		update: update
	}

});