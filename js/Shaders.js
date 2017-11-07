const SHADERS = {
	'instancing': {
		vertex: [
			"uniform float time;",
			"uniform float minX;",
			"uniform float length;",

			"attribute vec3 translate;",

			"varying float vScale;",
			"varying vec2 vUv;",

			"void main(){",
				"vUv = uv;",

				"vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );",

				"vec3 trTime = vec3(translate.x + time, translate.y + time,translate.z + time);",
				"float scale = abs(cos( 3.14159*trTime.x / (length*3.) )) + sin( trTime.y * 3.2 ) + sin(trTime.z * 4.);",
				"vScale = scale;",
				"mvPosition.xyz += position * scale * .05;",
				"gl_Position = projectionMatrix * mvPosition;",
			"}"
		].join( "\n" ),

		fragment: [
			"precision highp float;",

			"uniform sampler2D map;",
			"varying vec2 vUv;",
			"varying float vScale;",

			"vec3 HUEtoRGB(float H){",
				"H = mod(H,1.0);",
				"float R = abs(H * 6.0 - 3.0) - 1.0;",
				"float G = 2.0 - abs(H * 6.0 - 2.0);",
				"float B = 2.0 - abs(H * 6.0 - 4.0);",
				"return clamp(vec3(R,G,B),0.0,1.0);",
			"}",

			"vec3 HSLtoRGB(vec3 HSL){",
				"vec3 RGB = HUEtoRGB(HSL.x);",
				"float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;",
				"return (RGB - 0.5) * C + HSL.z;",
			"}",

			"void main() {",
				"vec4 diffuseColor = texture2D( map, vUv );",
				"gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3(vScale/5.0, 1.0, 0.5)), diffuseColor.w );",
				"// gl_FragColor = vec4(diffuseColor.xyz * vec3(1., .6, 1.), 1.);",
				"if ( diffuseColor.w < 0.5 ) discard;",
			"}"
		].join("\n")
	},


}