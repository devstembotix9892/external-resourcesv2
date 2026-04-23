/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addBlocks (Blockly) {
    const color = '#0096FF';
    const secondaryColour = '#4DB8FF';

    // Stepper motor initialization
    Blockly.Blocks.stepper_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.STEPPER_INIT || 'init stepper motor dir pin %1 step pin %2 steps/rev %3',
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'DIRPIN',
                        options: [
                            ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                            ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'],
                            ['12', '12'], ['13', '13']
                        ]
                    },
                    {
                        type: 'field_dropdown',
                        name: 'STEPPIN',
                        options: [
                            ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                            ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'],
                            ['12', '12'], ['13', '13']
                        ]
                    },
                    {
                        type: 'input_value',
                        name: 'STEPS',
                        check: 'Number'
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: color,
                secondaryColour: secondaryColour,
                tooltip: 'Initialize stepper motor pins and steps per revolution'
            });
        }
    };

    // Stepper motor rotate
    Blockly.Blocks.stepper_rotate = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.STEPPER_ROTATE || 'rotate stepper direction %1 speed (µs) %2 steps %3',
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'DIR',
                        options: [['clockwise', 'HIGH'], ['counterclockwise', 'LOW']]
                    },
                    {
                        type: 'input_value',
                        name: 'SPEED',
                        check: 'Number'
                    },
                    {
                        type: 'input_value',
                        name: 'STEPS',
                        check: 'Number'
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: color,
                secondaryColour: secondaryColour,
                tooltip: 'Rotate the stepper motor with given direction and speed'
            });
        }
    };

    return Blockly;
}
exports = addBlocks;
