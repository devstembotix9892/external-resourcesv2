const wifiExtension = formatMessage => ({
    name: formatMessage({
        id: 'wifi.name',
        default: 'WiFi Connection'
    }),
    extensionId: 'wifi',
    version: '1.0.0',
    supportDevice: ['arduinoEsp32', 'arduinoEsp8266','intermediateKit'],
    author: 'YourName',
    iconURL: 'asset/wifi.png',
    description: formatMessage({
        id: 'wifi.description',
        default: 'Connect ESP boards to WiFi networks using blocks.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    tags: ['communication'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = wifiExtension;
