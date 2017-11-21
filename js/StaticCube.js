var CreateStaticCube = function(s, texture){
	var geom = new THREE.BoxGeometry(s, s, s);
	var mat = new THREE.MeshBasicMaterial({
		map: texture,
	});

	var mesh = new THREE.Mesh(geom, mat);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	return {
		mesh: mesh,
	}
}