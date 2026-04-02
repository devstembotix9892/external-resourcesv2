const bleExtension = formatMessage => ({
    name: formatMessage({
        id: 'ble.name',
        default: 'BLE Connection'
    }),
    extensionId: 'ble',
    version: '1.0.0',
    supportDevice: ['arduinoEsp32', 'intermediateKit'],
    author: 'YourName',
    iconURL: 'asset/ble.png',
    description: formatMessage({
        id: 'ble.description',
        default: 'Connect ESP32 boards via Bluetooth Low Energy (BLE).'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    tags: ['communication'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = bleExtension;
