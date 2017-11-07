var Universe
var InitUniverse = (function(radius, numPlanets) {

	var RADIUS = radius;
	camera.position.set(0, 0, RADIUS);

	var group = new THREE.Group();

	var space = 2;	
	var ellipses = [];

	ellipses[0] = new Ellipse(radius-space, radius-space, Math.PI);
	ellipses[1] = new Ellipse(radius, radius, Math.PI);
	ellipses[2] = new Ellipse(radius+space, radius+space, Math.PI);

	var time = 0;

	//create paths from ellipses

	for(var i=0; i<ellipses.length; i++){
		var curve = ellipses[i];
		var path = new THREE.Path( curve.getPoints( 100 ) );
	    var geometrycirc = path.createPointsGeometry( 100 );
	    var materialcirc = new THREE.LineBasicMaterial( {
	        color : 0xffffff,
	        linewidth: 2
	    } );

	    // Create the final object to add to the scene
	    var ellipseMesh = new THREE.Line( geometrycirc, materialcirc );
	    ellipseMesh.rotation.x = Math.PI/2;

	    group.add(ellipseMesh);
	}

	var theta = 0;
	var angle = 0;
	var origin = new THREE.Vector3(0, 0, 0);
	function update(){
		time += .005;
		angle += .01;
		theta = 2*Math.PI/10000;

		var x = camera.position.x;
		var z = camera.position.z;

		camera.lookAt(origin);

		camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
		camera.position.y = 0;
		camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
	}

	return {
		mesh: group,
		orbitPaths: ellipses,
		update: update
	}

});