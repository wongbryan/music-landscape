var Avatar = (function(options){
	var radius = options['radius'],
	color = options['color'];

	var geom = new THREE.SphereGeometry(radius, 256, 256),
	mat = new THREE.MeshPhongMaterial({
		// color : color,
		specular : 0xfff7f9,
		side : THREE.DoubleSide,
		shininess : 100
	});

	var mesh = new THREE.Mesh(geom, mat);
	mesh.position.z = radius+1;
	
	mesh.options = options;

	return mesh;
})(Options['Avatar']);

Avatar.move = function(){
	this.position.y += .02;

}