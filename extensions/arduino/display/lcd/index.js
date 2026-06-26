const lcd = formatMessage => ({
    name: formatMessage({
        id: 'lcd.name',
        default: '1602 LCD'
    }),
    extensionId: 'lcd',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266', 'arduinoEsp32','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    iconURL: `asset/lcd.png`,
    description: formatMessage({
        id: 'lcd.description',
        default: '1602 liquid crystal display which based on I2C bus.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['display'],
});

module.exports = lcd;
