var CreateFruit = function(morphGeom, material, scale = .5, force = 1, sound){

	var mat = Physijs.createMaterial(
		material,	
		.8, // high friction
		.3 // low restitution
	);

	var mesh = new Physijs.BoxMesh(morphGeom, mat);
	mesh.castShadow = true;
	mesh.scale.set(scale, scale, scale);

	var force = new THREE.Vector3(500, 2200, 500).multiplyScalar(force),
	offset = new THREE.Vector3(1, 5, 2);

	function applyImpulse(){
		var x = Math.random(),
		y = 5+Math.random() * 2.5,
		z = 1+Math.random();

		offset.set(x, y, z);
		mesh.applyImpulse(force, offset);
	}

	function defineConstraint(){
		var linear_lower = new THREE.Vector3(-1, -5, -1),
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
		applyImpulse(force, offset);
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