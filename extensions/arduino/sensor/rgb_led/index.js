const rgbLed = formatMessage => ({
    name: formatMessage({
        id: 'rgbled.name',
        default: 'RGB LED'
    }),
    extensionId: 'rgbled',
    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],
    iconURL: 'asset/rgbled.png',
    description: formatMessage({
        id: 'rgbled.description',
        default: 'Control V1_RGB (WS2812) LED module on S pin — set color, channels, and timed lighting.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    tags: ['sensor', 'rgb', 'led', 'neopixel'],
});

module.exports = rgbLed;
