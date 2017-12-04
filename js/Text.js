const TEXT_COLORS = {
    orange: new THREE.Color(0xffb13d),
    blue: new THREE.Color(0x3e9ce0),
    pink: new THREE.Color(0xe03e82),
    green: new THREE.Color(0x336633),
    purple: new THREE.Color(0x6c0fff)
};

var CreateText = function(letter) {

    var textGeometry = new THREE.TextGeometry(letter, {
        font: FONTS_DATA['fugue'].font,
        size: 2,
        height: 0.15,
        curveSegments: 20
    });
    textGeometry.computeBoundingBox();

    let index = Math.floor(Math.random()*(Object.keys(TEXT_COLORS).length-1));
    let color = TEXT_COLORS[ Object.keys(TEXT_COLORS)[index] ];
    let mat = MATERIALS['text'].clone();
    mat.color = color;

    let mesh = new THREE.Mesh(textGeometry, mat);

    function play() {
        changeColor();
    };

    function changeColor(){
        let index = Math.floor(Math.random()*(Object.keys(TEXT_COLORS).length-1));
        let color = TEXT_COLORS[ Object.keys(TEXT_COLORS)[index] ];
        mesh.material.color = (mesh.material.color == color) ? TEXT_COLORS[ Object.keys(TEXT_COLORS)[index+1] ] : color; 
    }

    return {
        mesh: mesh,
        // changeColor: changeColor,
        play: play
    }

}