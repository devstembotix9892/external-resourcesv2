const rotaryEncoder = formatMessage => ({
    name: formatMessage({
        id: 'rotaryencoder.name',
        default: 'Rotary Encoder'
    }),

    extensionId: 'rotaryencoder',
    version: '1.0.0',

    supportDevice: [
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],

    iconURL: `asset/rotaryencoder.png`,

    description: formatMessage({
        id: 'rotaryencoder.description',
        default: 'Read rotation direction, count steps and button press from Rotary Encoder.'
    }),

    featured: true,

    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',

    tags: ['sensor', 'rotary', 'encoder', 'knob'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = rotaryEncoder;
