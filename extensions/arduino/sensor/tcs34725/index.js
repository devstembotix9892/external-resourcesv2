/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
const colorSensor = formatMessage => ({
    name: formatMessage({
        id: 'colorSensor.name',
        default: 'Color Sensor'
    }),
    extensionId: 'colorSensor',
    version: '1.0.0',
    supportDevice: ['arduinoNano', 'arduinoUno', 'arduinoMega2560', 'arduinoEsp32','iotAiKit'],
    author: 'Your Name',
    iconURL:'asset/colorsensre.png',
    description: formatMessage({
        id: 'colorSensor.description',
        default: 'Use the TCS34725 color sensor to read RGB and brightness values.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
});

module.exports = colorSensor;
