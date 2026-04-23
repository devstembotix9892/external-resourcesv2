const ledMatrix = formatMessage => ({
    name: formatMessage({
        id: 'ledmatrix.name',
        default: 'LED Matrix'
    }),

    extensionId: 'ledmatrix',
    version: '1.0.0',

    supportDevice: [
        'arduinoNano',
        'arduinoUno',
        'arduinoMega2560',
        'arduinoEsp32',
        'arduinoNano_arduinoUno',
        'intermediateKit',
        'iotAiKit'
    ],

    iconURL: `asset/ledmatrix.png`,

    description: formatMessage({
        id: 'ledmatrix.description',
        default: 'Control digits, letters, symbols & custom 5×7 drawings on LED Matrix.'
    }),

    featured: true,

    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',

    // ⭐ Correct way to load extra JS required by blocks
    javascript: [
        {
            id: 'fieldMatrix',
            file: 'FieldMatrix.js'   // file must exist in extension folder
        }
    ],

    tags: ['display', 'led', 'matrix'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = ledMatrix;
