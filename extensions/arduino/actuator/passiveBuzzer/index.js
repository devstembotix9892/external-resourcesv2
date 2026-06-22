const passiveBuzzer = formatMessage => ({
    name: formatMessage({
        id: 'passiveBuzzer.name',
        default: 'Passive Buzzer'
    }),
    extensionId: 'passiveBuzzer',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    iconURL: `asset/passiveBuzzer.png`,
    description: formatMessage({
        id: 'passiveBuzzer.description',
        default: 'Unlike the active buzzer, the passive buzzer can be used' +
            ' to make different tones of sound and play some ringtones.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['actuator'],
});

module.exports = passiveBuzzer;
