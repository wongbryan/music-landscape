THREE.RoundedBoxGeometry = function (radius, length) {

    THREE.Geometry.call(this);

    this.type = 'RoundedBoxGeometry';

    this.parameters = {
        radius: radius,
        length: length,
    };

    radius = radius !== undefined ? radius : 10;
    length = length !== undefined ? length : 60;

    circleGeometry = new THREE.CircleGeometry(radius, 128, 128);
    rectangleGeometry = new THREE.PlaneGeometry(2 * radius, length - 2 * (radius), 128, 128);

    var rectangle = new THREE.Mesh(rectangleGeometry);
    x = rectangle.position.x;
    y = rectangle.position.y;
    z = rectangle.position.z;

    var circle1 = new THREE.Mesh(circleGeometry);
    circle1.position.x = x;
    circle1.position.y = y - (length / 2) + radius;
    circle1.position.z = z;

    var circle2 = new THREE.Mesh(circleGeometry);
    circle2.position.x = x;
    circle2.position.y = y + (length / 2) - radius;
    circle2.position.z = z;

    THREE.GeometryUtils.merge(this, circle1);
    THREE.GeometryUtils.merge(this, rectangle);
    THREE.GeometryUtils.merge(this, circle2);
};

THREE.RoundedBoxGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.RoundedBoxGeometry.prototype.constructor = THREE.RoundedBoxGeometry;