var WaveShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"magnitude": { value: null },
		"time": { value: 0 },
		"speed": { value: null },
		"scale":   { value: null },
	},
	vertexShader: [
		"varying highp vec2 vUv;",
		"void main() {",
			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [
		"uniform highp sampler2D tDiffuse;",
		"uniform float magnitude;",
		"uniform float time;",
		"uniform float speed;",
		"uniform vec2 scale;",

		"varying highp vec2 vUv;",

		"void main(){",

			"vec2 map = vUv;",

			"/*add sin movement to displacement for slight wave effect*/",
			"map.xy += sin(vUv.y*100.+time*speed);",
			"map.xy += cos(vUv.x*10.+time*speed);",
			"map.xy *= scale * .8 * magnitude;",

			"vec4 color = texture2D(tDiffuse, vec2(vUv.x - map.x, vUv.y - map.y));",

			"gl_FragColor = color;",
		"}"
	].join("\n")
}