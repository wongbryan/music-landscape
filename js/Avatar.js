var Avatar;
var InitAvatar = function(mesh) {
    // domEvents.addEventListener(mesh, 'click', function () {
    //     pov = true;
    // });

    mesh.update = function() {
        mesh.position.y += .02;
    };

    mesh.play = function() {
        console.log('playing');
    };

    return mesh;
}