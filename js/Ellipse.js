
function Ellipse( xRadius, yRadius, rotation ) {

		THREE.Curve.call( this );

		// add radius as a property
		this.xRadius = xRadius;
		this.yRadius = yRadius;
		this.rotation = rotation;

}

Ellipse.prototype = Object.create( THREE.Curve.prototype );
Ellipse.prototype.constructor = Ellipse;

// define the getPoint function for the subClass
Ellipse.prototype.getPoint = function ( t ) {

	var radians = 2 * Math.PI * t;

    var c = Math.cos( this.rotation );
	var s = Math.sin( this.rotation );
	
	return new THREE.Vector3( this.xRadius * Math.cos( radians ) * c,
							  this.yRadius * Math.sin( radians ),
							  - this.xRadius * Math.cos( radians ) * s );

};