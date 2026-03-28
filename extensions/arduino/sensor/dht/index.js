const dht = formatMessage => ({
    name: formatMessage({
        id: 'dht.name',
        default: 'DHT Sensor'
    }),
    extensionId: 'dht',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp32', 'arduinoEsp8266','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    // author: 'STEMbotix',
    iconURL: `asset/dht.png`,
    description: formatMessage({
        id: 'dht.description',
        default: 'DHT Temperature and humidity sensor module.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = dht;
