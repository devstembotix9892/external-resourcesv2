const ottobot = formatMessage => ({
    name: 'OTTOBOT',
    extensionId: 'ottobot',
    supportDevice: ['arduinoUno', 'arduinoNano','arduinoNano_arduinoUno'],
    iconURL: `asset/otto.png`,
    description: formatMessage({
        id: 'ottobot.description',
        default: 'Humanoid Robot, get started with robot project.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['actuator'],
});

module.exports = ottobot;
