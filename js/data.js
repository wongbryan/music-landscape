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

    'border': new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 4
    }),

    'text': new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        overdraw: 0.5
    }),
};

const MODEL_DATA = {
    'banana': {
        geometry: null,
        materials: null,
        key: 'q',
        sound: ''
    },
    'blueberry': {
        force: 0.08,
        geometry: null,
        materials: null,
        key: 'e',
        sound: ''
    },
    'apple': {
        scale: 0.1,
        force: 15,
        geometry: null,
        materials: null,
        key: 'a',
        sound: ''
    },
    'grapes': {
        force: 0.02,
        geometry: null,
        materials: null,
        key: 'd',
        sound: ''
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

const KEY_MAPPINGS = {
    // 'a' : { fruit: Fruit, text: Text, border: Border }
};

const ACTIVE_KEYS = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];