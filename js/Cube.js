var modifier = new THREE.BufferSubdivisionModifier( 4 );
var CreateCube = function(morphGeom, material, position){

	/* Create mesh with morph targets */

	material.morphTargets = true;

	var mat = Physijs.createMaterial(
		material,	
		.8, // high friction
		.3 // low restitution
	);

	var s = 5;
	var cubeGeom = new THREE.BoxGeometry(s, s, s, 128, 128);
	// var cubeGeom = new THREE.RoundedBoxGeometry(5, s);
	console.log(morphGeom.faces);
	morphGeom.morphTargets[0] = { name : 't1', vertices : cubeGeom.vertices};
	morphGeom.computeMorphNormals();
	// cubeGeom.faces = morphGeom.faces;
	// cubeGeom.elementNeedsUpdate = true;

	var mesh = new Physijs.BoxMesh(morphGeom, mat);
	mesh.morphTargetInfluences[0] = 1;

	mesh.__dirtyPosition = true;
	mesh.position.set(position.x, position.y, position.z);

	/* Define physics */

	// console.log(constraint);
	// scene.add(mesh);
	// scene.addConstraint( constraint );
	// constraint.setLinearLowerLimit( linear_lower ); // sets the lower end of the linear movement along the x, y, and z axes.
	// constraint.setLinearUpperLimit( linear_upper ); // sets the upper end of the linear movement along the x, y, and z axes.

	var force = new THREE.Vector3(500, 4000, 800), 
	offset = new THREE.Vector3(.3, 0, .3);

	function applyImpulse(){
		mesh.applyImpulse(force, offset);
	}

	function morph(){
		var target = (mesh.morphTargetInfluences[0] > 0) ? 0 : 1;
		var cur = { value : mesh.morphTargetInfluences[0] };
		var targetMagnitude = { value : target };	

		var tween = new TWEEN.Tween(cur).to(targetMagnitude, 1500);
		tween.onUpdate(function(){
			mesh.morphTargetInfluences[0] = cur.value;
		})
		tween.easing(TWEEN.Easing.Elastic.Out);

		tween.start();
	}

	function defineConstraint(){
		var linear_lower = new THREE.Vector3(-1, -5, -1),
		linear_upper = new THREE.Vector3(1, 10, 1);

		var constraint = new Physijs.DOFConstraint(
		    mesh, // First object to be constrained
		    null, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
		  	mesh.position, // point in the scene to apply the constraint
		);

		scene.addConstraint(constraint);

		constraint.setLinearLowerLimit( linear_lower );
		constraint.setLinearUpperLimit( linear_upper );
	}

	function pop(){
		applyImpulse(force, offset);
		morph();
	}

	return {
		applyImpulse: applyImpulse,
		mesh: mesh,
		force: force,
		offset: offset,
		pop: pop,
		defineConstraint: defineConstraint,
	}
}