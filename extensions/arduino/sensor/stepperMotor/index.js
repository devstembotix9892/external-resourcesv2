const stepperMotor = formatMessage => ({
    name: formatMessage({
        id: 'steppermotor.name',
        default: 'Stepper Motor'
    }),
    extensionId: 'steppermotor',
    version: '1.0.0',
    supportDevice: [
        'arduinoNano', 'arduinoUno', 'arduinoMega2560', 'arduinoEsp32', 'arduinoNano_arduinoUno', 'iotAiKit', 'intermediateKit' ],
    iconURL: 'asset/steppermotor.png', // ✅ make sure this image exists in /asset folder
    description: formatMessage({
        id: 'steppermotor.description',
        default: 'Control stepper motor direction, speed, and steps using.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['motor', 'stepper', 'motion', 'hardware'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = stepperMotor;
