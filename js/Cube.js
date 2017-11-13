var CreateCube = function(morphGeom, position){

	var shaderMat = new THREE.ShaderMaterial({
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		uniforms: {
			'magnitude': { value : 0. },
			'time': {value : 0.},
		}
	});

	var mat = Physijs.createMaterial(
		shaderMat,	
		.8, // high friction
		.3 // low restitution
	);

	var s = 5;
	var geom = new THREE.BoxBufferGeometry(s, s, s);
	var mesh = new Physijs.BoxMesh(geom, mat);

	var linear_lower = new THREE.Vector3(0, -5, 0),
	linear_upper = new THREE.Vector3(-10, -5, 0);

	var constraint = new Physijs.DOFConstraint(
	    box, // First object to be constrained
	    null, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
	    position, // point in the scene to apply the constraint
	);

	scene.addConstraint( constraint );
	constraint.setLinearLowerLimit( linear_lower ); // sets the lower end of the linear movement along the x, y, and z axes.
	constraint.setLinearUpperLimit( linear_upper ); // sets the upper end of the linear movement along the x, y, and z axes.

	var force = new THREE.Vector3(0, 3000, 0), 
	offset = new THREE.Vector3(2, 2, 2);
	function applyImpulse(){
		mesh.applyImpulse(force, offset);
	}

	return {
		applyImpulse: applyImpulse,
		mesh: mesh,
		force: force,
		offset: offset,
	}
}