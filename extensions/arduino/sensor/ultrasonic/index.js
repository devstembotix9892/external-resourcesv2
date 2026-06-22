const ultrasonic = formatMessage => ({
    name: formatMessage({
        id: 'ultrasonic.name',
        default: 'Ultrasonic'
    }),
    extensionId: 'ultrasonic',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp32', 'arduinoEsp8266','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    iconURL: `asset/ultrasonic.png`,
    description: formatMessage({
        id: 'ultrasonic.description',
        default: 'Standard ultrasonic distance measurement module.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor'],
});

module.exports = ultrasonic;
