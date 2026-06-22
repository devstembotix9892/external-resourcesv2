const vibrationMotor = formatMessage => ({
    name: formatMessage({
        id: 'vibrationmotor.name',
        default: 'Vibration Motor'
    }),
    extensionId: 'vibrationmotor',
    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],
    iconURL: 'asset/vibrationmotor.png',
    description: formatMessage({
        id: 'vibrationmotor.description',
        default: 'Drive a vibration (haptic) motor module (S / V / G) with ON/OFF, PWM power, or timed pulse.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor', 'motor', 'actuator', 'pwm', 'haptic'],
});

module.exports = vibrationMotor;
