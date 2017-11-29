var CreateText = function(letter) {
    var textGeometry = new THREE.TextGeometry(letter, {
        font: FONTS_DATA['helvetiker_bold'].font,
        size: 2,
        height: 0.01,
        curveSegments: 2
    });
    textGeometry.computeBoundingBox();

    let mesh = new THREE.Mesh( textGeometry, MATERIALS['text'] );

    function play() {

    }

    return {
        mesh: mesh,
        play: play
    }

}