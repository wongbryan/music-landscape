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
			'45.2': {
				mag: 0.1,
				trig: false,
				lightkeys: 5,
			},
			'45.6': {
				mag: 0.4,
				trig: false,
				lightkeys: 9,
			},
			'45.8': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'46': {
				mag: 0.3,
				trig: false,
				lightkeys: 7,
			},
			'46.5': {
				mag: 0.5,
				trig: false,
				lightkeys: 10,
			},
			'47.2': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'47.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'47.8': {
				mag: .7,
				trig: false,
				lightkeys: 11,
			},
			'48': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'48.3': {
				mag: 0.5,
				trig: false,
				lightkeys: 10,
			},
			'48.7': {
				mag: 0.3,
				trig: false,
				lightkeys: 8,
			},
			'48.8': {
				mag: 0.9,
				trig: false,
				lightkeys: 15,
			},
			'49.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'50.0': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'50.3': {
				mag: 0.3,
				trig: false,
				lightkeys: 7,
			},
			'50.6': {
				mag: 0.3,
				trig: false,
				lightkeys: 7,
			},
			'51.0': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'51.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'51.6': {
				mag: 0.4,
				trig: false,
				lightkeys: 8,
			},
			'52.0': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'52.3': {
				mag: 0.7,
				trig: false,
				lightkeys: 11,
			},
			'52.6': {
				mag: 0.3,
				trig: false,
				lightkeys: 6,
			},
			'53.0': {
				mag: 0.5,
				trig: false,
				lightkeys: 6,
			},
			'53.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'53.6': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'53.9': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'54.3': {
				mag: 0.4,
				trig: false,
				lightkeys: 10,
			},
			'54.6': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'54.9': {
				mag: 0.4,
				trig: false,
				lightkeys: 9,
			},
			'55.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 11,
			},
			'55.6': {
				mag: 0.5,
				trig: false,
				lightkeys: 10,
			},
			'55.9': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'56.3': {
				mag: 0.5,
				trig: false,
				lightkeys: 10,
			},
			'56.6': {
				mag: 0.4,
				trig: false,
				lightkeys: 7,
			},
			'56.9': {
				mag: 0.6,
				trig: false,
				lightkeys: 11,
			},
			'57.2': {
				mag: 0.6,
				trig: false,
				lightkeys: 11,
			},
			'57.6': {
				mag: 0.4,
				trig: false,
				lightkeys: 6,
			},
			'57.9': {
				mag: 0.3,
				trig: false,
				lightkeys: 5,
			},
			'58.2': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'58.6': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'58.9': {
				mag: 0.9,
				trig: false,
				lightkeys: 14,
			},
			'59.2': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'59.6': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'59.9': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'60.2': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'60.5': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'60.9': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'61.2': {
				mag: 0.7,
				trig: false,
				lightkeys: 10,
			},
			'61.5': {
				mag: 0.4,
				trig: false,
				lightkeys: 7,
			},
			'61.9': {
				mag: 0.7,
				trig: false,
				lightkeys: 7,
			},
			'62.2': {
				mag: 0.5,
				trig: false,
				lightkeys: 10,
			},
			'62.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'62.9': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'63.2': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'63.5': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'63.8': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'64.2': {
				mag: 0.6,
				trig: false,
				lightkeys: 12,
			},
			'64.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 12,
			},
			'64.8': {
				mag: 0.4,
				trig: false,
				lightkeys: 8,
			},
			'65.2': {
				mag: 0.4,
				trig: false,
				lightkeys: 7,
			},
			'65.5': {
				mag: 0.4,
				trig: false,
				lightkeys: 6,
			},
			'65.8': {
				mag: 0.5,
				trig: false,
				lightkeys: 5,
			},
			'66.2': {
				mag: 0.5,
				trig: false,
				lightkeys: 6,
			},
			'66.5': {
				mag: 0.5,
				trig: false,
				lightkeys: 6,
			},
			'66.8': {
				mag: 0.5,
				trig: false,
				lightkeys: 6,
			},
			'67.1': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'67.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'67.8': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'68.1': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'68.5': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'68.8': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'69.1': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'69.4': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'69.8': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'70.1': {
				mag: 0.6,
				trig: false,
				lightkeys: 13,
			},
			'70.4': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'70.8': {
				mag: 0.8,
				trig: false,
				lightkeys: 15,
			},
			'71.1': {
				mag: 0.7,
				trig: false,
				lightkeys: 13,
			},
			'71.4': {
				mag: 0.9,
				trig: false,
				lightkeys: 15,
			},
			'71.8': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'72.1': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'72.4': {
				mag: 1,
				trig: false,
				lightkeys: 13,
			},
			'72.7': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'73.1': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'73.4': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'73.7': {
				mag: 0.5,
				trig: false,
				lightkeys: 7,
			},
			'74.1': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'74.4': {
				mag: 0.4,
				trig: false,
				lightkeys: 6,
			},
			'74.7': {
				mag: 0.6,
				trig: false,
				lightkeys: 9,
			},
			'75.1': {
				mag: 0.7,
				trig: false,
				lightkeys: 10,
			},
			'75.4': {
				mag: 0.8,
				trig: false,
				lightkeys: 10,
			},
			'75.7': {
				mag: 0.4,
				trig: false,
				lightkeys: 6,
			},
			'76.0': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'76.4': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'76.7': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'77.0': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'77.4': {
				mag: 0.7,
				trig: false,
				lightkeys: 11,
			},
			'77.7': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'78.0': {
				mag: 0.6,
				trig: false,
				lightkeys: 11,
			},
			'78.4': {
				mag: 0.5,
				trig: false,
				lightkeys: 8,
			},
			'78.7': {
				mag: 0.6,
				trig: false,
				lightkeys: 7,
			},
			'79.0': {
				mag: 0.6,
				trig: false,
				lightkeys: 7,
			},
			'79.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 7,
			},
			'79.7': {
				mag: 0.7,
				trig: false,
				lightkeys: 8,
			},
			'80.0': {
				mag: 0.7,
				trig: false,
				lightkeys: 9,
			},
			'80.3': {
				mag: 0.7,
				trig: false,
				lightkeys: 8,
			},
			'80.7': {
				mag: 0.8,
				trig: false,
				lightkeys: 10,
			},
			'81.0': {
				mag: 0.9,
				trig: false,
				lightkeys: 12,
			},
			'81.3': {
				mag: 1,
				trig: false,
				lightkeys: 15,
			},
			'81.7': {
				mag: 0.3,
				trig: false,
				lightkeys: 6,
			},
			'82.0': {
				mag: 0.3,
				trig: false,
				lightkeys: 6,
			},
			'82.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 10,
			},
			'82.6': {
				mag: 0.5,
				trig: false,
				lightkeys: 8,
			},
			'83.0': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'83.3': {
				mag: 0.6,
				trig: false,
				lightkeys: 9,
			},
			'83.6': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'84.0': {
				mag: 0.5,
				trig: false,
				lightkeys: 8,
			},
			'84.3': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'84.6': {
				mag: 0.7,
				trig: false,
				lightkeys: 10,
			},
			'85.0': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'85.3': {
				mag: 0.7,
				trig: false,
				lightkeys: 10,
			},
			'85.6': {
				mag: 0.8,
				trig: false,
				lightkeys: 12,
			},
			'85.9': {
				mag: 0.4,
				trig: false,
				lightkeys: 7,
			},
			'86.3': {
				mag: 0.7,
				trig: false,
				lightkeys: 12,
			},
			'86.6': {
				mag: 0.2,
				trig: false,
				lightkeys: 5,
			},
			'86.9': {
				mag: 0.1,
				trig: false,
				lightkeys: 3,
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