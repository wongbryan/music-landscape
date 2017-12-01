var CameraController = function(camera){
	var cur = 0;
	var positions = [
		new THREE.Vector3(0, 6, 20),
		new THREE.Vector3(0, 25, 1),
		new THREE.Vector3(-50, 20, 50),
		// new THREE.Vector3(0, 6, 20),
	];

	function shiftPos(index){
		var target = positions[index];
		var cameraPos = camera.position;
		var tween = new TWEEN.Tween(cameraPos).to(target, 800);
		tween.easing(TWEEN.Easing.Quadratic.InOut);
		tween.onUpdate(function(){
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		});

		tween.start();

        $('.buttons > .active').removeClass('active');
        $('.buttons').children()[index].classList.add('active');
	}

	function next(){
		var next = (cur == positions.length-1) ? 0 : (cur+1);
		shiftPos(next);
		cur = next;
	}

	function prev() {
        var prev = (cur == 0) ? positions.length - 1 : (cur-1);
        shiftPos(prev);
        cur = prev;
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

	const $buttons = $('#cameraToggle > .buttons')
	for (let i = 0; i < positions.length; i++) {
        let $button = $("<li>", {class: "button", id: i});
        $button.html(i + 1);
        $buttons.append($button);
	}

	$buttons[0].addEventListener('click', (e) => {
		if (e.target.classList.contains('button')) {
			let newInd = parseInt(e.target.id, 10);
			shiftPos(newInd);
		}
	});

	return {
		positions: positions,
		next: next,
		prev: prev,
		shiftPos: shiftPos,
		reset: reset
	}

}