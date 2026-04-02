const ottobot = formatMessage => ({
    name: 'OTTOBOT',
    extensionId: 'ottobot',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano','arduinoNano_arduinoUno' ],
    // author: 'STEMbotix',
    iconURL: `asset/otto.png`,
    description: formatMessage({
        id: 'ottobot.description',
        default: 'Otto Robot, get started with robot project.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['actuator'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = ottobot;
