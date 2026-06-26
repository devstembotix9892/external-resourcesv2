const bleExtension = formatMessage => ({
    name: formatMessage({
        id: 'ble.name',
        default: 'BLE Connection'
    }),
    extensionId: 'ble',
    supportDevice: ['arduinoEsp32', 'intermediateKit'],
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
});

module.exports = bleExtension;
