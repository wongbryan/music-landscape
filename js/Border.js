var CreateBorder = function() {
    const y = 0;

    var borderGeometry = new THREE.Geometry();
    borderGeometry.vertices.push(
        new THREE.Vector3( -4, y, 0 ),
        new THREE.Vector3( 0, y, 0 ),
        new THREE.Vector3( 0, y, -4 ),
        new THREE.Vector3( -4, y, -4 ),
        new THREE.Vector3( -4, y, 0 ),
    );

    let mesh = new THREE.Line( borderGeometry, MATERIALS['border'].clone() );

    function play() {
        // need to tween this
        mesh.material.color = new THREE.Color(0xffffff);
        setTimeout(() => {
            mesh.material.color = new THREE.Color(0x0000ff);
        }, 350)

    };

    return {
        mesh: mesh,
        play: play
    }

}