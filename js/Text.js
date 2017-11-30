var CreateText = function (letter) {
    var textGeometry = new THREE.TextGeometry(letter, {
        font: FONTS_DATA['fugue'].font,
        size: 2,
        height: 0.15,
        curveSegments: 20
    });
    textGeometry.computeBoundingBox();

    let mesh = new THREE.Mesh(textGeometry, MATERIALS['text'].clone());

    function play() {


    };

    return {
        mesh: mesh,
        play: play
    }

}