var CreateText = function(letter) {
    console.log(typeof letter);
    var textGeometry = new THREE.TextGeometry(letter, {
        font: FONTS_DATA['fugue'].font,
        size: 2,
        height: 0.01,
        curveSegments: 20
    });
    textGeometry.computeBoundingBox();

    let mesh = new THREE.Mesh( textGeometry, MATERIALS['text'].clone() );

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