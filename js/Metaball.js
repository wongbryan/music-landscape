// METABALLS FUNCTIONS

function resetValues( values )
{
    for (var i = 0; i < values.length; i++)
		values[i] = 0;
}

// add values corresponding to a ball with radius 1 to values array
function addBall(points, values, center)
{
	for (var i = 0; i < values.length; i++)
	{
		var OneMinusD2 = 1.0 - center.distanceToSquared( points[i] );
		values[i] += Math.exp( -(OneMinusD2 * OneMinusD2) );
	}
}


// MARCHING CUBES ALGORITHM
// parameters: domain points, range values, isolevel 
// returns: geometry
function marchingCubes( points, values, isolevel)
{
	// assumes the following global values have been defined: 
	//   THREE.edgeTable, THREE.triTable
	
	var size = Math.round(Math.pow(values.length, 1/3));
	var size2 = size * size;
	var size3 = size * size * size;
	
	// Vertices may occur along edges of cube, when the values at the edge's endpoints
	//   straddle the isolevel value.
	// Actual position along edge weighted according to function values.
	var vlist = new Array(12);
	
	var geometry = new THREE.Geometry();
	var vertexIndex = 0;
	
	for (var z = 0; z < size - 1; z++)
	for (var y = 0; y < size - 1; y++)
	for (var x = 0; x < size - 1; x++)
	{
		// index of base point, and also adjacent points on cube
		var p    = x + size * y + size2 * z,
			px   = p   + 1,
			py   = p   + size,
			pxy  = py  + 1,
			pz   = p   + size2,
			pxz  = px  + size2,
			pyz  = py  + size2,
			pxyz = pxy + size2;
		
		// store scalar values corresponding to vertices
		var value0 = values[ p    ],
			value1 = values[ px   ],
			value2 = values[ py   ],
			value3 = values[ pxy  ],
			value4 = values[ pz   ],
			value5 = values[ pxz  ],
			value6 = values[ pyz  ],
			value7 = values[ pxyz ];
		
		// place a "1" in bit positions corresponding to vertices whose
		//   isovalue is less than given constant.
		
		var cubeindex = 0;
		if ( value0 < isolevel ) cubeindex |= 1;
		if ( value1 < isolevel ) cubeindex |= 2;
		if ( value2 < isolevel ) cubeindex |= 8;
		if ( value3 < isolevel ) cubeindex |= 4;
		if ( value4 < isolevel ) cubeindex |= 16;
		if ( value5 < isolevel ) cubeindex |= 32;
		if ( value6 < isolevel ) cubeindex |= 128;
		if ( value7 < isolevel ) cubeindex |= 64;
		
		// bits = 12 bit number, indicates which edges are crossed by the isosurface
		var bits = THREE.edgeTable[ cubeindex ];
		
		// if none are crossed, proceed to next iteration
		if ( bits === 0 ) continue;
		
		// check which edges are crossed, and estimate the point location
		//    using a weighted average of scalar values at edge endpoints.
		// store the vertex in an array for use later.
		var mu = 0.5; 
		
		// bottom of the cube
		if ( bits & 1 )
		{		
			mu = ( isolevel - value0 ) / ( value1 - value0 );
			vlist[0] = points[p].clone().lerp( points[px], mu );
		}
		if ( bits & 2 )
		{
			mu = ( isolevel - value1 ) / ( value3 - value1 );
			vlist[1] = points[px].clone().lerp( points[pxy], mu );
		}
		if ( bits & 4 )
		{
			mu = ( isolevel - value2 ) / ( value3 - value2 );
			vlist[2] = points[py].clone().lerp( points[pxy], mu );
		}
		if ( bits & 8 )
		{
			mu = ( isolevel - value0 ) / ( value2 - value0 );
			vlist[3] = points[p].clone().lerp( points[py], mu );
		}
		// top of the cube
		if ( bits & 16 )
		{
			mu = ( isolevel - value4 ) / ( value5 - value4 );
			vlist[4] = points[pz].clone().lerp( points[pxz], mu );
		}
		if ( bits & 32 )
		{
			mu = ( isolevel - value5 ) / ( value7 - value5 );
			vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 64 )
		{
			mu = ( isolevel - value6 ) / ( value7 - value6 );
			vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 128 )
		{
			mu = ( isolevel - value4 ) / ( value6 - value4 );
			vlist[7] = points[pz].clone().lerp( points[pyz], mu );
		}
		// vertical lines of the cube
		if ( bits & 256 )
		{
			mu = ( isolevel - value0 ) / ( value4 - value0 );
			vlist[8] = points[p].clone().lerp( points[pz], mu );
		}
		if ( bits & 512 )
		{
			mu = ( isolevel - value1 ) / ( value5 - value1 );
			vlist[9] = points[px].clone().lerp( points[pxz], mu );
		}
		if ( bits & 1024 )
		{
			mu = ( isolevel - value3 ) / ( value7 - value3 );
			vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 2048 )
		{
			mu = ( isolevel - value2 ) / ( value6 - value2 );
			vlist[11] = points[py].clone().lerp( points[pyz], mu );
		}
		
		// construct triangles -- get correct vertices from triTable.
		var i = 0;
		cubeindex <<= 4;  // multiply by 16... 
		// "Re-purpose cubeindex into an offset into triTable." 
		//  since each row really isn't a row.
		 
		// the while loop should run at most 5 times,
		//   since the 16th entry in each row is a -1.
		while ( THREE.triTable[ cubeindex + i ] != -1 ) 
		{
			var index1 = THREE.triTable[cubeindex + i];
			var index2 = THREE.triTable[cubeindex + i + 1];
			var index3 = THREE.triTable[cubeindex + i + 2];
			
			geometry.vertices.push( vlist[index1].clone() );
			geometry.vertices.push( vlist[index2].clone() );
			geometry.vertices.push( vlist[index3].clone() );
			var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
			geometry.faces.push( face );

			geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

			vertexIndex += 3;
			i += 3;
		}
	}
	
	geometry.mergeVertices();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
 	
	return geometry;
}

var Metaball = function(isolevel, positions){
	var axisMin = -5;
	var axisMax =  5;
	var axisRange = axisMax - axisMin;

	var size  = 30; 
	var size2 = size*size; 
	var size3 = size*size*size;
	
	var points = [];
	
	// generate the list of 3D points
	for (var k = 0; k < size; k++)
	for (var j = 0; j < size; j++)
	for (var i = 0; i < size; i++)
	{
		var x = axisMin + axisRange * i / (size - 1);
		var y = axisMin + axisRange * j / (size - 1);
		var z = axisMin + axisRange * k / (size - 1);
		points.push( new THREE.Vector3(x,y,z) );
	}
	
    var values = [];
	// initialize values
	for (var i = 0; i < size3; i++) 
		values[i] = 0;
	 
	// resetValues();

	for (var i=0; i<positions.length; i++){
		addBall( points, values, positions[i] );
	}

	// isolevel = 0.5;
	var geometry = marchingCubes( points, values, 0.5 );
	
	var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0xffffff, side:THREE.DoubleSide} );
	var mesh = new THREE.Mesh( geometry, colorMaterial );

	this.mesh = mesh;
	this.values = values;
	this.points = points;
	this.positions = positions;
	this.material = new THREE.MeshBasicMaterial();
	this.isolevel = isolevel;
	this.min = axisMin;
	this.max = axisMax;
	this.range = axisRange;

	this.addBall = function(points, values, center){
		for (var i = 0; i < values.length; i++) {
			var OneMinusD2 = 1.0 - center.distanceToSquared( points[i] );
			values[i] += Math.exp( -(OneMinusD2 * OneMinusD2) );
		}
	}

	this.resetValues = function() {
	    for (var i = 0; i < values.length; i++)
			this.values[i] = 0;
	}

	this.update = function(t){
		var val = 3.5 * Math.sin(0.5 * t);
		var points = this.points, values = this.values, isolevel = this.isolevel;
		this.resetValues();

		for (var i=0; i<this.positions.length; i++){
			var pos = this.positions[i];
			var angle = 2 * Math.PI * Math.cos(t) + i;

			pos.x += axisRange * .05*Math.cos(angle);
			pos.y += axisRange * .05*Math.sin(angle);
			// pos.z = .6 * Math.sin(angle+i);

			this.addBall(points, values, pos);
		}

		// this.addBall( points, values, new THREE.Vector3(0,3.5,0) );
		// this.addBall( points, values, new THREE.Vector3(0,val,0) );
		// this.addBall( points, values, new THREE.Vector3(-1,-1,0) );

		var newGeometry = marchingCubes( points, values, isolevel );
		var mesh = new THREE.Mesh( newGeometry, this.material );
		scene.remove(this.mesh);
		scene.add( mesh );

		this.mesh = mesh;
	}
}
