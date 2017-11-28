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

var MODEL_DATA = {
    'banana': {
        geometry: null,
        materials: null,
        key: 'q',
        sound: ''
    },
    'banana-low': {
        geometry: null,
        materials: null,
        key: 'w',
        sound: ''
    },
    'blueberry': {
        geometry: null,
        materials: null,
        key: 'e',
        sound: ''
    },
    'banana_cube': {
        geometry: null,
        materials: null,
        key: 'r',
        sound: ''
    },
    'apple': {
        geometry: null,
        materials: null,
        key: 'a',
        sound: ''
    },
    'jelly': {
        geometry: null,
        materials: null,
        key: 's',
        sound: ''
    },
};

var TEXTURE_DATA = {
    'blueberry': null,
    'apple': null,
    'banana': null,
};

var MATERIALS = {
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

    'banana': new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xfef45d),
        emissive: new THREE.Color(0xf5d44f)
    }),

    'blueberry': new THREE.MeshPhongMaterial({
        color: 0x57fcfe,
        emissive: 0x7e95f6,
        specular: 0x593453,
        shininess: 27,
    }),
};

const LOADED_OBJECTS = {
    // 'a' : Fruit
};

const ACTIVE_KEYS = ['q', 'w', 'e', 'r', 'a', 's'];