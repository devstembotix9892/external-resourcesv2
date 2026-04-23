const slcd = formatMessage => ({
    name: formatMessage({
        id: 'slcd.name',
        default: 'LCD'
    }),
    extensionId: 'slcd',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266', 'arduinoEsp32'],
    // author: 'STEMbotix',
    iconURL: `asset/LCD.png`,
    description: formatMessage({
        id: 'slcd.description',
        default: 'liquid crystal display which based on I2C bus.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['display'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = slcd;
