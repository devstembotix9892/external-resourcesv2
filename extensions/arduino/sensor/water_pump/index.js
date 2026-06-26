const waterPump = formatMessage => ({

    name: formatMessage({

        id: 'waterpump.name',

        default: 'Water Pump'

    }),

    extensionId: 'waterpump',


    supportDevice: [
        'arduinoNano',
        'arduinoEsp32',
        'intermediateKit',
        'iotAiKit',
        'iotAiKitnew'
    ],

    iconURL: 'asset/waterpump.png',

    description: formatMessage({

        id: 'waterpump.description',

        default: 'Control V1_Water Pump module (S/V/G) with ON/OFF on a digital pin. Pin list follows AI&Robotics / AI&IoT board flyout.'

    }),

    featured: true,

    blocks: 'blocks.js',

    generator: 'generator.js',

    toolbox: 'toolbox.js',

    msg: 'msg.js',

    tags: ['sensor', 'pump', 'actuator', 'water'],


});



module.exports = waterPump;

