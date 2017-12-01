const KEYCODES = {
    32 : "spacebar",
    37 : "left arrow",
    38 : "up arrow",
    39 : "right arrow",
    40 : "down arrow",
    48 : "0",
    49 : "1",
    50 : "2",
    51 : "3",
    52 : "4",
    53 : "5",
    54 : "6",
    55 : "7",
    56 : "8",
    57 : "9",
    65 : "a",
    66 : "b",
    67 : "c",
    68 : "d",
    69 : "e",
    70 : "f",
    71 : "g",
    72 : "h",
    73 : "i",
    74 : "j",
    75 : "k",
    76 : "l",
    77 : "m",
    78 : "n",
    79 : "o",
    80 : "p",
    81 : "q",
    82 : "r",
    83 : "s",
    84 : "t",
    85 : "u",
    86 : "v",
    87 : "w",
    88 : "x",
    89 : "y",
    90 : "z",
};

function keyToCode(key) {
    return Object.keys(KEYCODES)[Object.values(KEYCODES).indexOf(key)];
}

function codeToKey(code) {
    return KEYCODES[code];
}

const MATERIALS = {
    'bubbleGum': new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf572bf),
        emissive: new THREE.Color(0x8c1228),
        roughness: .05,
        metalness: .48,
        side: THREE.DoubleSide,
        flatShading: true,
        morphTargets: true,
        // map : texture
    }),

    'banana': new THREE.MeshStandardMaterial({
        color: 0xbe9a47,
        emissive: 0x676925,
        roughness: .16,
        flatShading: false,
        metalness: 0  
    }),

    'starfruit': new THREE.MeshStandardMaterial({
        color: 0xbe9a47,
        emissive: 0x676925,
        roughness: .16,
        flatShading: false,
        metalness: 0  
    }),

    'pineapple': new THREE.MeshStandardMaterial({
        color: 0xfedd3a,
        emissive: 0x6f4014,
        roughness: 1,
        flatShading: false,
        metalness: .5  
    }),

    'blueberry': new THREE.MeshStandardMaterial({
    	color: 0x5c70fb,
    	emissive: 0x1235ae,
    	roughness: 0,
    	flatShading: false,
    	metalness: 0
    }),

    'apple': new THREE.MeshStandardMaterial({
    	color: 0xfc1820,
    	emissive: 0x760314,
    	roughness: .1,
    	flatShading: false,
    	metalness: .5
    }),

    'grapes': new THREE.MeshStandardMaterial({
    	color: 0xb3f28b,
    	emissive: 0x68841f,
    	metalness: .5,
    	flatShading: false,
    	roughness: .06
    }),
    // 'watermelon': new THREE.MeshStandardMaterial({
    // 	color: 0xb3f28b,
    // 	emissive: 0x68841f,
    // 	metalness: .5,
    // 	flatShading: false,
    // 	roughness: .06
    // }),
    //
    // 'pumpkin': new THREE.MeshStandardMaterial({
    // 	color: 0xb3f28b,
    // 	emissive: 0x68841f,
    // 	metalness: .5,
    // 	flatShading: false,
    // 	roughness: .06
    // }),
    'key': new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
    }),

    'text': new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        overdraw: 0.5,
        side: THREE.DoubleSide
    }),

};

const MODEL_DATA = {
    'banana': {
        geometry: null,
        force: .6,
        materials: MATERIALS['banana'],
        key: 'q',
        sound: ''
    },
    'blueberry': {
        force: 0.08,
        geometry: null,
        materials: MATERIALS['blueberry'],
        key: 'e',
        sound: ''
    },
    'apple': {
        scale: 0.1,
        force: 5,
        geometry: null,
        materials: MATERIALS['apple'],
        key: 'a',
        sound: ''
    },
    'grapes': {
        force: 0.01,
        geometry: null,
        materials: MATERIALS['grapes'],
        key: 'd',
        sound: ''
    },
    'starfruit': {
        force: 0.01,
        geometry: null,
        materials: MATERIALS['starfruit'],
        key: 'd',
        sound: ''
    },
    'pineapple': {
        force: 0.01,
        geometry: null,
        materials: MATERIALS['pineapple'],
        key: 'd',
        sound: ''
    },
    // 'pumpkin': {
    //     force: 0.01,
    //     geometry: null,
    //     materials: MATERIALS['pineapple'],
    //     key: 'd',
    //     sound: ''
    // },
    // 'watermelon': {
    //     force: 0.01,
    //     geometry: null,
    //     materials: null,
    //     key: 'd',
    //     sound: ''
    // }
};

const TEXTURE_DATA = {
    'blueberry': null,
    'apple': null,
    'banana': null,
};

const FONTS_DATA = {
    'helvetiker_bold': {
        font: null,
        size: 80,
        height: 20,
        curveSegments: 2
    },
    'fugue': {
        font: null,
        size: 80,
        height: 20,
        curveSegments: 20
    },

};

const AUDIO_DATA = {
	'fresh':{
		buffer: null,
		ext: '.mp3',
		timestamps: {
			'0': {
				mag: .3,
				trig: false,
				lightkeys: 2,
			},
			'.3': {
				mag: .3,
				trig: false,
				lightkeys: 2,
			},
			'.7': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'1': {
				mag: .3,
				trig: false,
				lightkeys: 2,
			},
			'1.2': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'1.7': {
				mag: .3,
				trig: false,
				lightkeys: 2,
			},
			'2.1': {
				mag: .35,
				trig: false,
				lightkeys: 3,
			},
			'2.5': {
				mag: .3,
				trig: false,
				lightkeys: 2,
			},
			'3.3': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'3.7': {
				mag: .4,
				trig: false,
				lightkeys: 4,
			},
			'4.2': {
				mag: .3,
				trig: false,
				lightkeys: 6,
			},
			'4.6': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'5': {
				mag: 1,
				trig: false,
				lightkeys: 6,
			},
			'5.7': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'7': {
				mag: .8,
				trig: false,
				lightkeys: 4,
			},
			'7.5': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'8': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'9.3': {
				mag: 1.3,
				trig: false,
				lightkeys: 12,
			},
			'10.6': {
				mag: 1,
				trig: false,
				lightkeys: 6,
			},
			'11.8': {
				mag: 1.3,
				trig: false,
				lightkeys: 4,
			},
			'13.0': {
				mag: 1,
				trig: false,
				lightkeys: 5,
			},
			'14.2': {
				mag: 1.3,
				trig: false,
				lightkeys: 7,
			},
			'15.4': {
				mag: 1,
				trig: false,
				lightkeys: 7,
			},
			'16.6': {
				mag: 1.3,
				trig: false,
				lightkeys: 8,
			},
			'17.8': {
				mag: 1,
				trig: false,
				lightkeys: 7,
			},
			'19.0': {
				mag: .7,
				trig: false,
				lightkeys: 4,
			},
			'19.3': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'19.6': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'19.9': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'20.2': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'20.5': {
				mag: .3,
				trig: false,
				lightkeys: 3,
			},
			'20.8': {
				mag: .3,
				trig: false,
				lightkeys: 5,
			},
			'21.1': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'21.4': {
				mag: .3,
				trig: false,
				lightkeys: 7,
			},
			'21.7': {
				mag: .3,
				trig: false,
				lightkeys: 6,
			},
			'22.5': {
				mag: 1,
				trig: false,
				lightkeys: 12,
			},
			'23.7': {
				mag: .75,
				trig: false,
				lightkeys: 4,
			},
			'24.2': {
				mag: .75,
				trig: false,
				lightkeys: 4,
			},
			'24.9': {
				mag: .75,
				trig: false,
				lightkeys: 3,
			},
			'26.4': {
				mag: .75,
				trig: false,
				lightkeys: 4,
			},
			'27.': {
				mag: .3,
				trig: false,
				lightkeys: 4,
			},
			'27.5': {
				mag: .4,
				trig: false,
				lightkeys: 8,
			},
			'29': {
				mag: 1.3,
				trig: false,
				lightkeys: 12,
			},
			'30.8': {
				mag: .75,
				trig: false,
				lightkeys: 12,
			},
			'31.5': {
				mag: .8,
				trig: false,
				lightkeys: 18,
			},
			'31.75': {
				mag: 1.3,
				trig: false,
				lightkeys: 18,
			},
			'32': {
				mag: .4,
				trig: false,
				lightkeys: 7,
			},
			'32.3': {
				mag: .4,
				trig: false,
				lightkeys: 6,
			},
			'32.7': {
				mag: .3,
				trig: false,
				lightkeys: 7,
			},
			'33.': {
				mag: .3,
				trig: false,
				lightkeys: 7,
			},
			'33.3': {
				mag: .3,
				trig: false,
				lightkeys: 7,
			},
			'33.8': {
				mag: .75,
				trig: false,
				lightkeys: 10,
			},
			'34.2': {
				mag: 1.3,
				trig: false,
				lightkeys: 18,
			},
			'36.0': {
				mag: .3,
				trig: false,
				lightkeys: 18,
			},
			'36.4': {
				mag: .4,
				trig: false,
				lightkeys: 18,
			},
			'36.8': {
				mag: .4,
				trig: false,
				lightkeys: 18,
			},
			'38.6': {
				mag: 1.3,
				trig: false,
				lightkeys: 18,
			},
			'40': {
				mag: .75,
				trig: false,
				lightkeys: 18,
			},
			'40.3': {
				mag: .3,
				trig: false,
				lightkeys: 15,
			},
			'41.2': {
				mag: 1.5,
				trig: false,
				lightkeys: 20,
			},
			'42.2': {
				mag: 1.,
				trig: false,
				lightkeys: 20,
			},
			'43.2': {
				mag: 1.,
				trig: false,
				lightkeys: 15,
			},
			'43.8': {
				mag: 1.,
				trig: false,
				lightkeys: 15,
			},
			'44.1': {
				mag: .3,
				trig: false,
				lightkeys: 5,
			},
			'44.6': {
				mag: .4,
				trig: false,
				lightkeys: 10,
			},
			'45': {
				mag: .4,
				trig: false,
				lightkeys: 15,
			},

			// '': {
			// 	mag: 1.3,
			// 	trig: false,
			lightkeys: 0,
			// },
		}
	}
}

const KEY_MAPPINGS = {
    // 'a' : { fruit: Fruit, text: Text, border: Border }
};

const ACTIVE_KEYS = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];