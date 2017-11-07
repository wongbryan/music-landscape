var Planet;
var InitPlanet = (function(modelGeom) {
	// var sphereGeometry = new THREE.SphereBufferGeometry(.005, .005, 8, 8);
	var circleGeometry = new THREE.CircleBufferGeometry(1, 6);
	var geometry = new THREE.InstancedBufferGeometry();
	// geometry.copy(sphereGeometry);
	geometry.copy(circleGeometry)

	var positions = modelGeom.vertices;
	var instances = positions.length;

	var minX = 0;
	var translateArray = new Float32Array(instances*3);
	for (var i=0; i<positions.length; i++){
		var index = i*3,
		v = positions[i];

		if (minX > v.x)
			minX = v.x;

		translateArray[index] = v.x;
		translateArray[index+1] = v.y;
		translateArray[index+2] = v.z;
	}

	var translateAttribute = new THREE.InstancedBufferAttribute(translateArray, 3, 1);
	geometry.addAttribute('translate', translateAttribute);
	
	modelGeom.computeBoundingBox();
	var length = modelGeom.boundingBox.max.x-modelGeom.boundingBox.min.x;	

	var sprite = new THREE.TextureLoader().load('assets/images/circle.png');


	var mat = MATERIALS['bubbleGum'].clone();
	mat.flatShading = true;
	// var mesh = new THREE.Mesh(geometry, mat);
	// modelGeom = new THREE.TorusKnotGeometry(1.5, .5);
	var mesh = new THREE.Mesh(modelGeom, mat);
	mesh.rotation.z = Math.PI/6;

	var group = new THREE.Group();
	group.add(mesh);

	/*put lights hovering around the banana*/
	
	// var ellipseCurve = new THREE.EllipseCurve(
	// 	0, 0,			  //cx, cy
	// 	15, 10,           // xRadius, yRadius
	// 	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	// 	false,            // aClockwise
	// 	Math.PI/4                 // aRotation
	// );

	var pointLights = [];
	var ellipseCurves = [];
	var decayDist = 9;
	var sphereGeom = new THREE.SphereGeometry(.25, 10, 10);

	for (var i=0; i<3; i++){
		var pointLight = new THREE.PointLight(0xffffff, 1, decayDist);
		var sphereMat = new THREE.MeshBasicMaterial();
		var sphere = new THREE.Mesh(sphereGeom, sphereMat);
		pointLight.add(sphere);
		pointLights.push(pointLight);

		var e = new Ellipse(5, 5, Math.PI/3*(i+1));
		ellipseCurves.push(e);

		group.add(pointLight);
	}

	var time = 0;

	function updateLights(){
		// console.log(p);
		for (var i=0; i<pointLights.length; i++){
			var speed = 3;
			var offset = i*(.3 + .2*i*i);
			var p = ellipseCurves[i].getPoint(speed*time+offset);
			pointLights[i].position.x = p.x;
			pointLights[i].position.y = p.y;
			pointLights[i].position.z = p.z;
		}
	}

	function update(){
		time += .001;
		// updateLights();
		// console.log(pointLights[0].position);
		// mesh.material.uniforms['time'].value = time;;
	}

	return {
		mesh: group,
		pointLights: pointLights,
		update: update
	}

});