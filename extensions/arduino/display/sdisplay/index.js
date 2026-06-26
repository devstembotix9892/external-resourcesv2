const sdisplay = formatMessage => ({
    name: 'SDISPLAY',
    extensionId: 'sdisplay',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266', 'arduinoEsp32', 'intermediateKit', 'iotAiKit', 'iotAiKitnew', 'arduinoNano_arduinoUno'],
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
});

module.exports = sdisplay;
