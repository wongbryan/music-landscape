const KEYCODES = {
    32: "spacebar",
    37: "left arrow",
    38: "up arrow",
    39: "right arrow",
    40: "down arrow",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    191: "/",
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

    'lemon': new THREE.MeshStandardMaterial({
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

    'pear': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'raspberry': new THREE.MeshStandardMaterial({
        color: 0xd9486b,
        emissive: 0x790f15,
        roughness: .14,
        flatShading: false,
        metalness: .3
    }),

    'watermelon': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'pumpkin': new THREE.MeshStandardMaterial({
        color: 0xb3f28b,
        emissive: 0x68841f,
        metalness: .5,
        flatShading: false,
        roughness: .06
    }),

    'orange': new THREE.MeshStandardMaterial({
        color: 0xfcfa37,
        emissive: 0xbd4215,
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
        force: .4,
        materials: MATERIALS['banana'],
        key: 'q',
        sound: '',
        scale: .4
    },
    'blueberry': {
        force: 0.07,
        geometry: null,
        materials: MATERIALS['blueberry'],
        key: 'e',
        sound: '',
        scale: .6
    },
    'apple': {
        scale: 0.27,
        force: 5,
        geometry: null,
        materials: MATERIALS['apple'],
        key: 'a',
        sound: '',
        scale: .1
    },
    'pear': {
        force: 0.06,
        geometry: null,
        materials: MATERIALS['pear'],
        key: 'd',
        sound: '',
        scale: .65
    },
    'raspberry': {
        force: 0.14,
        geometry: null,
        materials: MATERIALS['raspberry'],
        key: 'd',
        sound: '',
        scale: .4
    },
    'grapes': {
        force: 0.4,
        geometry: null,
        materials: MATERIALS['grapes'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'starfruit': {
        force: 0.7,
        geometry: null,
        materials: MATERIALS['starfruit'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'orange': {
        force: 0.35,
        geometry: null,
        materials: MATERIALS['orange'],
        key: 'd',
        sound: '',
        scale: .3
    },
    'pumpkin': {
        force: 0.5,
        geometry: null,
        materials: MATERIALS['pineapple'],
        key: 'd',
        sound: '',
        scale: .35
    },
    'watermelon': {
        force: 0.02,
        scale: .95,
        geometry: null,
        materials: null,
        key: 'd',
        sound: '',
        materials: MATERIALS['watermelon'],
    },
    'lemon': {
        force: 4,
        scale: .14,
        geometry: null,
        materials: null,
        key: 'd',
        sound: '',
        materials: MATERIALS['lemon'],
    }
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
    'fresh': {
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
                cameraToggle: 1
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
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '47.5': {
                mag: 0.3,
                trig: false,
                lightkeys: 10,
            },
            '47.8': {
                mag: .4,
                trig: false,
                lightkeys: 11,
            },
            '48.5': {
                mag: 1,
                trig: false,
                lightkeys: 20,
            },
            '49': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.2': {
                mag: .2,
                trig: false,
                lightkeys: 10,
            },
            '49.4': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.6': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '49.8': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '50.2': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '50.6': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '50.8': {
                mag: 1.4,
                trig: false,
                lightkeys: 20,
            },
            '51.2': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '51.6': {
                mag: .3,
                trig: false,
                lightkeys: 10,
            },
            '51.8': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.2': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.4': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '52.6': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '53': {
                mag: 1,
                trig: false,
                lightkeys: 20,
            },
            '53.5': {
                mag: 1,
                trig: false,
                lightkeys: 20,
            },
            '53.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '54.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '55.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '55.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '56': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '56.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '56.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '57.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '58.': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '58.6': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '59.2': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '59.8': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '60.4': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '60.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '61.4': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '61.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '62.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '63.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '63.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '64.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '64.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '65.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '66.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '67.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '67.6': {
                mag: 1.4,
                trig: false,
                lightkeys: 20,
            },
            '68': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '68.3': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '68.6': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '68.9': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '69.1': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '69.3': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '69.6': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '70': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '70.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '70.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '71.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '72.3': {
                mag: 1.,
                trig: false,
                lightkeys: 15,
            },
            '72.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73': {
                mag: .6,
                trig: false,
                lightkeys: 15,
            },
            '73.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '73.9': {
                mag: 1.2,
                trig: false,
                lightkeys: 15,
            },
            '74.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '74.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '74.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '75.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '76.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '77.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '78.2': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '78.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '78.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '79.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '80.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '81.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '82': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '82.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '82.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '83.9': {
                mag: .2,
                trig: false,
                lightkeys: 15,
            },
            '84.1': {
                mag: .2,
                trig: false,
                lightkeys: 15,
            },
            '84.5': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '85': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '85.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '86.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '87': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '87.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '88.6': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '89': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '89.4': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '91.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '91.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '92.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '92.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '92.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.6': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '93.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '94.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '95.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '96.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '98.1': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '98.5': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '99': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '99.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '99.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '100.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '101.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '101.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '101.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '102.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '102.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '103': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '103.7': {
                mag: .8,
                trig: false,
                lightkeys: 15,
            },
            '104.1': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '104.3': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '104.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '105.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '106.1': {
                mag: 1.5,
                trig: false,
                lightkeys: 26,
            },
            '106.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '107': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '107.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '108': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '108.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '108.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109.3': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '109.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '109.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '110.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '110.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '111': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '111.4': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '111.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '112.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '113': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '113.4': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '113.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '114.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '114.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '115': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '115.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '115.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '116.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '116.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '116.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.2': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.5': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '117.8': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.1': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.4': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.7': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '118.9': {
                mag: .3,
                trig: false,
                lightkeys: 15,
            },
            '119.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '119.3': {
                mag: .45,
                trig: false,
                lightkeys: 15,
            },
            '119.5': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '119.7': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '119.9': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '120.4': {
                mag: 1.7,
                trig: false,
                lightkeys: 26,
            },
            '121.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '121.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '121.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '122.8': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '123.1': {
                mag: .4,
                trig: false,
                lightkeys: 10,
            },
            '123.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '123.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '124.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '125.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '126.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '127.2': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '127.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '127.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '128.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '129.8': {
                mag: 1.,
                trig: false,
                lightkeys: 26,
            },
            '130.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '131.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '132.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '132.5': {
                mag: 1,
                trig: false,
                lightkeys: 26,
            },
            '132.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '133.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '134.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '135.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '136.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '137.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '138': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '138.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '139.4': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '139.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '139.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '140.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '141.7': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '142': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '142.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '143.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '144.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '145.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '146.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '147.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '148.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '149.1': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '149.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '149.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '150.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '151.7': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '152': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '152.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '153.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '154.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '155.5': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.55': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.6': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.65': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '155.7': {
                mag: .2,
                trig: false,
                lightkeys: 26,
            },
            '156': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '156.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.6': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '157.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '158.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '158.7': {
                mag: .7,
                trig: false,
                lightkeys: 26,
            },
            '159.3': {
                mag: .7,
                trig: false,
                lightkeys: 16,
            },
            '159.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '160.3': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '160.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '161.3': {
                mag: 1,
                trig: false,
                lightkeys: 15,
            },
            '162.': {
                mag: .5,
                trig: false,
                lightkeys: 15,
            },
            '162.9': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '163.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '163.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '164.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '165.2': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '165.5': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '166': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '166.5': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '167.3': {
                mag: 1.4,
                trig: false,
                lightkeys: 26,
            },
            '168.2': {
                mag: 1.4,
                trig: false,
                lightkeys: 15,
            },
            '169': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '169.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '170.8': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '171.8': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.1': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.4': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '172.7': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '173.3': {
                mag: .4,
                trig: false,
                lightkeys: 15,
            },
            '173.7': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '175': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '175.6': {
                mag: .7,
                trig: false,
                lightkeys: 15,
            },
            '176': {
                mag: 2,
                trig: false,
                lightkeys: 26,
            },
        }
    }
};

const SOUND_MAPPINGS_1 = {


}

const KEY_MAPPINGS = {
    // 'a' : { fruit: Fruit, text: Text, border: Border }
};

const ACTIVE_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];