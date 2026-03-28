const bleRobotExtension = formatMessage => ({

    name: formatMessage({
        id: 'bleRobot.name',
        default: 'AI Robotic RC Car'
    }),

    extensionId: 'bleRobot',

    version: '1.0.0',

    supportDevice: ['arduinoEsp32', 'intermediateKit'],

    author: 'Blockzie',

    iconURL: 'asset/ble.png',

    description: formatMessage({
        id: 'bleRobot.description',
        default: 'Control AI Robotic RC Car via Bluetooth Low Energy'
    }),

    featured: true,

    blocks: 'blocks.js',

    generator: 'generator.js',

    toolbox: 'toolbox.js',

    msg: 'msg.js',

    tags: ['communication', 'robot', 'ble'],

    helpLink: 'https://openblockcc.gitee.io/wiki/main'

});

module.exports = bleRobotExtension;