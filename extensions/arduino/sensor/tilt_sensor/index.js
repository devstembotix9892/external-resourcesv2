const tiltSensor = formatMessage => ({
    name: formatMessage({
        id: 'tiltsensor.name',
        default: 'Tilt Sensor'
    }),
    extensionId: 'tiltsensor',
    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],
    iconURL: 'asset/tiltsensor.png',
    description: formatMessage({
        id: 'tiltsensor.description',
        default: 'Detect tilt using a digital tilt switch (pull-up, LOW = tilt).'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor', 'tilt', 'switch', 'digital'],
});

module.exports = tiltSensor;
