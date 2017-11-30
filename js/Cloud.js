var CreateCloud = function(pivot, x, y, z){
	var mesh = new THREE.Object3D();
	
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	// var geom = new THREE.BoxGeometry(20,20,20);
	
	// create a material; a simple white material will do the trick
	var mat = new THREE.MeshPhongMaterial({
		color: 0x3f3772,
		emissive: 0xcbd9ef,
        side: THREE.DoubleSide
	});

	// var mat = MATERIALS['banana'].clone();
	
	// duplicate the geometry a random number of times
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){

		var geom = (Math.random()>.4) ? new THREE.SphereGeometry(20, 8, 8) : new THREE.BoxGeometry(20,20,20);
		
		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat); 
		
		// set the position and the rotation of each cube randomly
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);
		
		// allow each cube to cast and to receive shadows
		m.castShadow = true;
		m.receiveShadow = true;
		
		// add the cube to the container we first created
		mesh.add(m);
	}

	mesh.position.set(x, y, z);

	pivot.add(mesh);

	var speed = Math.random()*.8 + .8;
	function update(){
		mesh.rotation.x += speed*.0015;
	}

	return {
		mesh: pivot,
		update: update
	}
}