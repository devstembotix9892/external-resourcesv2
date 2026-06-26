const reedSwitch = formatMessage => ({
    name: formatMessage({
        id: 'reedswitch.name',
        default: 'Reed Switch'
    }),

    extensionId: 'reedswitch',

    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],

    iconURL: `asset/reedswitch.png`,

    description: formatMessage({
        id: 'reedswitch.description',
        default: 'Detect magnetic field using Reed Switch sensor - read digital ON/OFF state.'
    }),

    featured: true,

    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',

    tags: ['sensor', 'magnetic', 'switch'],
});

module.exports = reedSwitch;
