const l298n = formatMessage => ({
    name: 'L298N',
    extensionId: 'l298n',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoMini', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266','ottoRobot','intermediateKit','iotAiKit','arduinoNano_arduinoUno'],
    // author: 'STEMbotix',
    iconURL: `asset/l298n.png`,
    description: formatMessage({
        id: 'l298n.description',
        default: 'Common high power dual motor drive module.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['actuator'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = l298n;
