var CreateCloud = function(pivot, x, y, z){
	var mesh = new THREE.Object3D();

	var mat = new THREE.MeshPhongMaterial({
		color: 0x3f3772,
		emissive: 0xcbd9ef,
        side: THREE.DoubleSide
	});

	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){

		var geom = (Math.random()>.4) ? new THREE.SphereGeometry(20, 6, 6) : new THREE.BoxGeometry(20,20,20);

		var m = new THREE.Mesh(geom, mat); 
		
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

		if (isSafari || mobile){
			m.castShadow = false;
		}
		else
			m.castShadow = true;

		// m.castShadow = false;
		m.receiveShadow = false;

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