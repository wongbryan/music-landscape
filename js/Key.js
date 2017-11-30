var CreateKey = function () {
    var keyGeometry = new THREE.CubeGeometry(4 / 1.05, 0.1, 4 / 1.05);
    let mesh = new THREE.Mesh(
        keyGeometry,
        MATERIALS['key'].clone()
    );

    function play() {
        // need to tween this
        mesh.material.opacity = 0.8;
        setTimeout(() => {
            mesh.material.opacity = MATERIALS['key'].opacity;
        }, 100);

    };

    return {
        mesh: mesh,
        play: play
    }

}