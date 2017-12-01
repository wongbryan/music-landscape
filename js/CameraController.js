var CameraController = function(camera){
	var cur = 0;
	var positions = [
		new THREE.Vector3(-50, 20, 50),
		new THREE.Vector3(0, 25, 1),
		new THREE.Vector3(0, 6, 20),
	];

	function shiftPos(index){
		var target = positions[index];
		var cameraPos = camera.position;
		var tween = new TWEEN.Tween(cameraPos).to(target, 800);
		tween.easing(TWEEN.Easing.Quadratic.InOut);
		tween.onUpdate(function(){
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		})

		if (index == 1){
			tween.onComplete(function(){
				camera.position.set(0, 25, -.2);
			});
		}

		tween.start();
	}

	function shuffle(){
		var next = (cur == positions.length-1) ? 0 : (cur+1);
		shiftPos(next);
		cur = next;
	}

	function reset(){
		cur = 0;
		shiftPos(0);
		camera.pivot.speed = 0;

		var cur = camera.pivot.rotation;
		var target = new THREE.Vector3(0, 0, 0);
		var tween = new TWEEN.Tween(cur).to(target, 300);
		tween.start();
	}

	return{
		shuffle: shuffle,
		shiftPos: shiftPos,
		reset: reset
	}

}