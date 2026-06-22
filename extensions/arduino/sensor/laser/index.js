const laser = formatMessage => ({
    name: formatMessage({
        id: 'laser.name',
        default: 'Laser'
    }),
    extensionId: 'laser',
    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],
    iconURL: 'asset/laser.png',
    description: formatMessage({
        id: 'laser.description',
        default: 'Control V1_Laser (S/V/G): ON/OFF, blink, SOS, PWM, fade, and status blocks for AI&Robotics / AI&IoT kits.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    tags: ['sensor', 'laser', 'output', 'actuator'],
});

module.exports = laser;
