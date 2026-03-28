const sdisplay = formatMessage => ({
    name: 'SDISPLAY',
    extensionId: 'sdisplay',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266', 'arduinoEsp32', 'intermediateKit', 'iotAiKit', 'arduinoNano_arduinoUno'],
    // author: 'STEMbotix',
    iconURL: `asset/th.png`,
    description: formatMessage({
        id: 'sdisplay.description',
        default: 'TFT display'
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

module.exports = sdisplay;
