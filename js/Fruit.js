var CreateFruit = function(morphGeom, material, scale = .5, force = 1, sound){

	var mat = Physijs.createMaterial(
		material,	
		.8, // high friction
		.3 // low restitution
	);

	var mesh = new Physijs.BoxMesh(morphGeom, mat);
	mesh.castShadow = true;
	// scale += (2*Math.random()-1)*(.5*scale);
	// scale = (scale < .1) ? .2:scale;

	mesh.scale.set(scale, scale, scale);

	var force = new THREE.Vector3(500, 2200, 500).multiplyScalar(force),
	offset = new THREE.Vector3(0, 5, 0);

	function applyImpulse(mag=1){

		var f = new THREE.Vector3();
		f.copy(force);

		var x = 0,
		y = 5+Math.random() * 2.5,
		z = 0;

		offset.set(x, y, z);
		mesh.applyImpulse(f.multiplyScalar(mag), offset);
	}

	function defineConstraint(){
		var linear_lower = new THREE.Vector3(-1, -10, -1),
		linear_upper = new THREE.Vector3(1, 15, 1);

		var constraint = new Physijs.DOFConstraint(
		    mesh, // First object to be constrained
		    null, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
		  	mesh.position, // point in the scene to apply the constraint
		);

		scene.addConstraint(constraint);

		constraint.setLinearLowerLimit( linear_lower );
		constraint.setLinearUpperLimit( linear_upper );
	}

	function play(){
		applyImpulse();
	}

	return {
		applyImpulse: applyImpulse,
		mesh: mesh,
		force: force,
		offset: offset,
		play: play,
		defineConstraint: defineConstraint,
	}
}