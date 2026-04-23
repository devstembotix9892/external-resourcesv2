/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

function addBlocks (Blockly) {
    const color = '#E53935';
    const secondaryColour = '#EF9A9A';

    // Use board/device pin options from Arduino flyout (AI&Robotics vs AI&IoT).
    // Falls back to a small common set if flyout isn't available yet.
    const digitalPins = (() => {
        try {
            return Blockly.getMainWorkspace().getFlyout()
                .getFlyoutItems()
                .find(block => block.type === 'arduino_pin_setDigitalOutput')
                .getField('PIN')
                .getOptions();
        } catch (e) {
            return [
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5']
            ];
        }
    })();

    // ================= INIT =================
    Blockly.Blocks.reedswitch_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.REEDSWITCH_INIT,
                args0: [{
                    type: 'field_dropdown',
                    name: 'PIN',
                    options: digitalPins
                }],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // ================= READ =================
    Blockly.Blocks.reedswitch_read = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.REEDSWITCH_READ,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_boolean']
            });
        }
    };

    // ================= READ RAW =================
    Blockly.Blocks.reedswitch_readRaw = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.REEDSWITCH_READRAW,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    return Blockly;
}

module.exports = addBlocks;
