var PixelShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"amount": { value: 512. }
	},
	vertexShader: [
		"varying highp vec2 vUv;",
		"void main() {",
			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform float amount;",

		"varying highp vec2 vUv;",

		"void main(){",	
			"float pixels = amount;",
			"float dx = 15.0*(1.0 / pixels);",
			"float dy = 10.0*(1.0 / pixels);",
			"vec2 coord = vec2(dx * floor(vUv.x / dx), dy * floor(vUv.y / dy));",
			"gl_FragColor = texture2D(tDiffuse, coord);",
		"}"
	].join("\n")
}