function addBlocks (Blockly) {
    const color = '#D39DDB';
    const secondaryColour = '#BA55D3';

    const digitalPins = [
        ['2','2'], ['3','3'], ['4','4'], ['5','5'],
        ['6','6'], ['7','7'], ['8','8'], ['9','9'],
        ['10','10'], ['11','11'], ['12','12'], ['13','13']
    ];

    Blockly.Blocks.ultrasonic_readDistance = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ULTRASONIC_READ_DISTANCE,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TRIG',
                        options: digitalPins
                    },
                    {
                        type: 'field_dropdown',
                        name: 'ECHO',
                        options: digitalPins
                    },
                    {
                        type: 'field_dropdown',
                        name: 'UNIT',
                        options: [
                            ['cm', 'CM'],
                            ['inch', 'INC']
                        ]
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    return Blockly;
}

exports = addBlocks;