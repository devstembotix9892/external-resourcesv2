const touchSensor = formatMessage => ({
    name: formatMessage({
        id: 'touchsensor.name',
        default: 'Touch Sensor'
    }),
    extensionId: 'touchsensor',
    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],
    iconURL: 'asset/touchsensor.png',
    description: formatMessage({
        id: 'touchsensor.description',
        default: 'Read digital touch sensor ON/OFF state (e.g., TTP223).'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor', 'touch', 'digital'],
});

module.exports = touchSensor;
