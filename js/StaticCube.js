var CreateStaticCube = function(s, texture){
	var geom = new THREE.BoxGeometry(s, s, s);
	var mat = new THREE.MeshPhongMaterial({
		map: texture,
		emissive: 0x040505,
		roughness: 0,
		metalness: .8,
	});

	var mesh = new THREE.Mesh(geom, mat);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	return {
		mesh: mesh,
	}
}