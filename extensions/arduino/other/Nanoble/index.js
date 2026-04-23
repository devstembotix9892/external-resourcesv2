const nanoBleExtension = formatMessage => ({
    name: formatMessage({
        id: 'nanoBle.name',
        default: 'Nano Bluetooth'
    }),
    extensionId: 'nanoBle',
    version: '1.0.0',
    supportDevice: ['arduinoNano', 'iotAiKit', 'arduinoNano_arduinoUno'],
    iconURL: 'asset/nano_ble.png',
    description: formatMessage({
        id: 'nanoBle.description',
        default: 'Connect Arduino Nano via Bluetooth (HC-05 / HM-10).'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    tags: ['communication'],
    helpLink: 'https://openblockcc.gitee.io/wiki/main'
});

module.exports = nanoBleExtension;
