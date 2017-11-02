var Land = (function(options){
	console.log(options);
	var stepsX = options.stepsX, stepsY = options.stepsY;
	var width = stepsX * options.stepSize,
	height = stepsY * options.stepSize,
	color = options.color,
	amp = options.amp;

	var points = new THREE.Geometry();

	var geom = new THREE.PlaneGeometry(width, height, stepsX, stepsY);

	noise.seed(Math.random());

	var index = 0;
	for (var i=0; i<stepsX; i++){
		for (var j=0; j<stepsY; j++){
			var n = noise.perlin2(i/16, j/16);
			geom.vertices[index].z += amp*n*n;
			index++;
		}
	}

	geom.verticesNeedUpdate = true;

	// mat = new THREE.ShaderMaterial({
	// 	wireframe : true,
	// 	vertexShader : document.getElementById('vertexShader').textContent,
	// 	fragmentShader : document.getElementById('fragmentShader').textContent
	// });

	mat = new THREE.MeshPhongMaterial({
		color : new THREE.Color(0xff7eca),
		emissive : new THREE.Color(0x89174d),
		specular : new THREE.Color(0xbe045b),
		shininess : 100,
		flatShading : true
	});

	var mesh = new THREE.Mesh(geom, mat);

	mesh.points = points;
	mesh.options = options;
	mesh.testVector = new THREE.Vector3();
	mesh.originalGeometry = geom.clone();

	// mesh.rotation.x = Math.PI/2 + Math.PI/6;
	return mesh;
})(Options['Land']);

Land.applyForce = function(center, strength){
	for (var i=0; i<this.geometry.vertices.length; i++){
		var dist = this.geometry.vertices[i].distanceTo(center);

		this.geometry.vertices[i].z -= (strength * 10) / Math.sqrt(dist * 5 ) - (strength * 2);
	}

	this.geometry.verticesNeedUpdate = true;
}

Land.resetForce = function(){
	for (var i=0; i<this.geometry.vertices.length; i++){
		this.geometry.vertices[i].z = this.originalGeometry.vertices[i].z;
	}
	this.geometry.verticesNeedUpdate = true;
}

Land.update = function(){
	this.resetForce();
	this.applyForce(Avatar.mesh.position, 7);
}


