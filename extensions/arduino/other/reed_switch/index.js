const reedSwitch = formatMessage => ({
    name: formatMessage({
        id: 'reedswitch.name',
        default: 'Reed Switch'
    }),

    extensionId: 'reedswitch',
    version: '1.0.0',

    supportDevice: [
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
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = reedSwitch;
