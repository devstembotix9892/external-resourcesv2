const softwareSerial = formatMessage => ({
    name: formatMessage({
        id: 'softwareSerial.name',
        default: 'Software Serial'
    }),
    extensionId: 'softwareSerial',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp32', 'arduinoEsp8266','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    iconURL: `asset/softwareSerial.png`,
    description: formatMessage({
        id: 'softwareSerial.description',
        default: 'Allow serial communication on other digital pins of the Arduino.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    tags: ['other'],
});

module.exports = softwareSerial;
