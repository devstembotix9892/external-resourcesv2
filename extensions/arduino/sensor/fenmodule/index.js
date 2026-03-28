/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
const fanModule = formatMessage => ({
    name: formatMessage({
        id: 'fanModule.name',
        default: 'Fan Module Control'
    }),
    extensionId: 'fanModule',
    version: '1.0.0',
    supportDevice: ['arduinoUno', 'arduinoNano','iotAiKit', 'arduinoMega2560'],
    // author: 'Jay Soneri',
    iconURL: 'asset/fen_module.png', // 🌀 place your fan icon here
    description: formatMessage({
        id: 'fanModule.description',
        default: 'Control fan module direction (Clockwise / Counter Clockwise)'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    color: '#00BFFF'
});

module.exports = fanModule;
