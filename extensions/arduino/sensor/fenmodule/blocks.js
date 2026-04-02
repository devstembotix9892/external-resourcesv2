/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addBlocks(Blockly) {
    // --- Motor init block ---
    Blockly.Blocks.motor_init = {
        init: function () {
            this.jsonInit({
                message0: 'init motor at pin1 %1 and pin2 %2',
                args0: [
                    {
                        type: 'field_number',
                        name: 'PIN1',
                        value: 8
                    },
                    {
                        type: 'field_number',
                        name: 'PIN2',
                        value: 12
                    }
                ],
                colour: '#FF8C00',
                nextStatement: null,
                previousStatement: null,
                tooltip: 'Initialize motor control pins',
            });
        }
    };

    // --- Motor rotate block ---
    Blockly.Blocks.motor_rotate = {
        init: function () {
            this.jsonInit({
                message0: 'rotate motor %1 direction',
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'DIRECTION',
                        options: [
                            ['Clockwise', 'CW'],
                            ['Counter Clockwise', 'CCW']
                        ]
                    }
                ],
                colour: '#FF8C00',
                previousStatement: null,
                nextStatement: null,
                tooltip: 'Rotate motor clockwise or counter clockwise',
            });
        }
    };

    return Blockly;
}

exports = addBlocks;
