var Avatar = (function () {
  this.mesh = null;

  this.move = function() {
    this.mesh.position.y += .02;
  }

  this.createMesh = function (mesh) {
    this.mesh = mesh;
  };
	
  return this;
})();
