var CreateBorder = function() {
    const y = 0.75;

    var borderGeometry = new THREE.Geometry();
    borderGeometry.vertices.push(
        new THREE.Vector3( -4, y, 0 ),
        new THREE.Vector3( 0, y, 0 ),
        new THREE.Vector3( 0, y, -4 ),
        new THREE.Vector3( -4, y, -4 ),
        new THREE.Vector3( -4, y, 0 ),
    );

    let mesh = new THREE.Line( borderGeometry, MATERIALS['border'] );

    function play() {

    }

    return {
        mesh: mesh,
        play: play
    }

}