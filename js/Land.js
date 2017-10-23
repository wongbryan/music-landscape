var Land = (function(options){
	console.log(options);
	var width = options.stepsX * options.stepSize,
	height = options.stepsY * options.stepSize,
	color = options.color;

	var points = new THREE.Geometry();

	for (var i=0; i<options.stepsX; i++){
		for (var j=0; j<options.stepsY; j++){
			var xPos = (i * options.stepSize) - (width/2);
			var yPos = (j * options.stepSize) - (height/2);
			var zPos = 0;

			var vertex = new THREE.Vector3(xPos, yPos, zPos);
     		points.vertices.push(vertex);
		}
	}

	var geom = new THREE.PlaneGeometry(width, height, 256, 256),
	mat = new THREE.MeshBasicMaterial({
		color : color,
		side : THREE.DoubleSide
	});

	var mesh = new THREE.Mesh(geom, mat);

	mesh.points = points;
	mesh.options = options;
	mesh.testVector = new THREE.Vector3();

	mesh.rotation.x = Math.PI/2 + Math.PI/6;
	return mesh;
})(Options['Land']);

Land.applyForce = function(center, strength){
	for (var i=0; i<this.geometry.vertices.length; i++){
		var dist = this.geometry.vertices[i].distanceTo(center);

		this.geometry.vertices[i].z -= (strength * 10) / Math.sqrt(dist * 2 ) - (strength * 2);
	}

	this.geometry.verticesNeedUpdate = true;
}

Land.resetForce = function(){
	for (var i=0; i<this.geometry.vertices.length; i++){
		this.geometry.vertices[i].z = 0;
	}
	this.geometry.verticesNeedUpdate = true;
}

Land.update = function(){
	this.resetForce();
	this.applyForce(this.testVector, 2.5);

	this.testVector.x += .005;
}


