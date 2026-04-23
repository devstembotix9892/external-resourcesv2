/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

function addBlocks(Blockly) {
    const color = '#8E24AA';
    const secondaryColour = '#CE93D8';

    // Use board/device pin options from Arduino flyout (AI&Robotics vs AI&IoT).
    // Rotary encoder uses INPUT pins; AI&Robotics often hides ESP32 GPIO36-39 from "digital output" lists.
    // So prefer "digital input" pin lists, and fall back to the largest available PIN dropdown we can find.
    const digitalPins = (() => {
        const fallback = [
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['5', '5']
        ];
        try {
            const flyout = Blockly.getMainWorkspace()?.getFlyout?.();
            const items = flyout?.getFlyoutItems?.() || [];
            const blocks = items.filter(it => it && typeof it === 'object' && typeof it.getField === 'function');

            const getPinOptions = (b) => {
                try {
                    const field = b.getField('PIN');
                    const opts = field && typeof field.getOptions === 'function' ? field.getOptions() : null;
                    return Array.isArray(opts) ? opts : null;
                } catch (e) {
                    return null;
                }
            };

            // 1) Prefer blocks whose type implies digital input / read.
            const preferred = blocks
                .filter(b => /digitalinput|read.*digital|digital.*read|pin.*input/i.test(String(b.type || '')))
                .map(getPinOptions)
                .filter(Boolean);
            if (preferred.length) return preferred.reduce((a, b) => (b.length > a.length ? b : a));

            // 2) Next try the old output pin list (backward compatible).
            const outBlock = blocks.find(b => b.type === 'arduino_pin_setDigitalOutput');
            const outOpts = outBlock ? getPinOptions(outBlock) : null;
            if (outOpts && outOpts.length) return outOpts;

            // 3) Otherwise pick the largest PIN dropdown available in the flyout.
            const all = blocks.map(getPinOptions).filter(Boolean);
            if (all.length) return all.reduce((a, b) => (b.length > a.length ? b : a));

            return fallback;
        } catch (e) {
            return fallback;
        }
    })();

    // ================= INIT =================
    Blockly.Blocks.rotaryencoder_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_INIT,
                args0: [
                    { type: 'field_dropdown', name: 'CLK_PIN', options: digitalPins },
                    { type: 'field_dropdown', name: 'DT_PIN', options: digitalPins },
                    { type: 'field_dropdown', name: 'SW_PIN', options: digitalPins }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // ================= GET COUNT =================
    Blockly.Blocks.rotaryencoder_getCount = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_GETCOUNT,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    // ================= RESET COUNT =================
    Blockly.Blocks.rotaryencoder_resetCount = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_RESETCOUNT,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // ================= DIRECTION =================
    Blockly.Blocks.rotaryencoder_direction = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_DIRECTION,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_string']
            });
        }
    };

    return Blockly;
}

module.exports = addBlocks;
