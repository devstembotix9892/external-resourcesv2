/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

function addBlocks (Blockly) {
    const color = '#8E24AA';
    const secondaryColour = '#CE93D8';

    // arduinoEsp32 / intermediateKit (AI & Robotics)
    const esp32RotaryEncoderPins = [
        ['D36', '36'],
        ['D39', '39']
    ];

    // arduinoNano / iotAiKit / iotAiKitnew (AI & IoT)
    const nanoRotaryEncoderPins = [
        ['A4', 'A4'],
        ['A5', 'A5']
    ];

    const ESP32_KIT_IDS = ['arduinoesp32', 'intermediatekit'];
    const NANO_KIT_IDS = ['arduinonano', 'iotaikit', 'iotaikitnew'];

    function getWorkspaceDeviceId () {
        try {
            const ws = Blockly.getMainWorkspace && Blockly.getMainWorkspace();
            if (!ws) {
                return '';
            }
            return String(
                ws.deviceId || ws.deviceType ||
                (typeof ws.getDeviceId === 'function' ? ws.getDeviceId() : '') ||
                (ws.options && (ws.options.deviceId || ws.options.deviceType)) ||
                ''
            ).toLowerCase();
        } catch (e) {
            return '';
        }
    }

    function deviceIdMatchesList (deviceId, ids) {
        const id = String(deviceId || '').toLowerCase();
        if (!id) {
            return false;
        }
        return ids.some((kitId) => id === kitId || id.includes(kitId));
    }

    function pinOptionsLookNano (opts) {
        if (!Array.isArray(opts) || !opts.length) {
            return false;
        }
        return opts.some((entry) => {
            const value = String(entry[1] != null ? entry[1] : entry[0] || '');
            return /^A\d+$/i.test(value.trim());
        });
    }

    function pinOptionsLookEsp32 (opts) {
        if (!Array.isArray(opts) || !opts.length) {
            return false;
        }
        return opts.some((entry) => {
            const label = String(entry[0] || '');
            const value = String(entry[1] != null ? entry[1] : entry[0] || '');
            if (/^IO\d+/i.test(label) || /^D\d+/i.test(label)) {
                return true;
            }
            const n = parseInt(value.replace(/^IO/i, ''), 10);
            return Number.isFinite(n) && (n >= 25 || (n >= 32 && n <= 39));
        });
    }

    function getFlyoutAnalogPinOptions () {
        try {
            const ws = Blockly.getMainWorkspace && Blockly.getMainWorkspace();
            const flyout = ws && ws.getFlyout && ws.getFlyout();
            const items = flyout && flyout.getFlyoutItems ? flyout.getFlyoutItems() : [];
            const blocks = items.filter(it => it && typeof it === 'object' && typeof it.getField === 'function');
            const analog = blocks.find(b => b.type === 'arduino_pin_readAnalogPin');
            if (analog && analog.getField('PIN') && analog.getField('PIN').getOptions) {
                return analog.getField('PIN').getOptions();
            }
        } catch (e) {
            // ignore
        }
        return null;
    }

    function isEsp32RotaryEncoderKit () {
        const deviceId = getWorkspaceDeviceId();
        if (deviceIdMatchesList(deviceId, ESP32_KIT_IDS)) {
            return true;
        }
        if (deviceIdMatchesList(deviceId, NANO_KIT_IDS)) {
            return false;
        }

        const flyoutOpts = getFlyoutAnalogPinOptions();
        if (pinOptionsLookEsp32(flyoutOpts)) {
            return true;
        }
        if (pinOptionsLookNano(flyoutOpts)) {
            return false;
        }

        return false;
    }

    function getRotaryEncoderPinOptions () {
        return isEsp32RotaryEncoderKit() ? esp32RotaryEncoderPins : nanoRotaryEncoderPins;
    }

    function getDefaultRotaryEncoderClkPin () {
        return isEsp32RotaryEncoderKit() ? '36' : 'A4';
    }

    function getDefaultRotaryEncoderDtPin () {
        return isEsp32RotaryEncoderKit() ? '39' : 'A5';
    }

    function getDefaultRotaryEncoderSwPin () {
        return isEsp32RotaryEncoderKit() ? '39' : 'A5';
    }

    function pickAlternateRotaryEncoderPin (avoidPin, preferDefault) {
        const validPins = getRotaryEncoderPinOptions().map((entry) => String(entry[1]));
        const avoid = String(avoidPin || '');
        if (preferDefault && preferDefault !== avoid && validPins.includes(preferDefault)) {
            return preferDefault;
        }
        const alternate = validPins.find((pin) => pin !== avoid);
        return alternate || preferDefault || validPins[0] || avoid;
    }

    function fixRotaryEncoderPinFields (block) {
        if (!block || typeof block.getField !== 'function') {
            return;
        }
        const clkField = block.getField('CLK_PIN');
        const dtField = block.getField('DT_PIN');
        const swField = block.getField('SW_PIN');
        const validPins = getRotaryEncoderPinOptions().map((entry) => String(entry[1]));

        if (clkField && !validPins.includes(String(clkField.getValue() || ''))) {
            clkField.setValue(getDefaultRotaryEncoderClkPin());
        }
        if (dtField && !validPins.includes(String(dtField.getValue() || ''))) {
            dtField.setValue(getDefaultRotaryEncoderDtPin());
        }
        if (swField && !validPins.includes(String(swField.getValue() || ''))) {
            swField.setValue(getDefaultRotaryEncoderSwPin());
        }
        if (clkField && dtField && String(clkField.getValue()) === String(dtField.getValue())) {
            dtField.setValue(pickAlternateRotaryEncoderPin(clkField.getValue(), getDefaultRotaryEncoderDtPin()));
        }
    }

    function makeRotaryEncoderPinValidator (getDefaultPin, otherFieldName) {
        return function (newValue) {
            const validPins = getRotaryEncoderPinOptions().map((entry) => String(entry[1]));
            const value = String(newValue || '');
            if (!validPins.includes(value)) {
                return getDefaultPin();
            }
            if (otherFieldName && this.sourceBlock_) {
                const otherField = this.sourceBlock_.getField(otherFieldName);
                if (otherField && String(otherField.getValue()) === value) {
                    return pickAlternateRotaryEncoderPin(value, getDefaultPin());
                }
            }
            return value;
        };
    }

    // ================= INIT =================
    Blockly.Blocks.rotaryencoder_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_INIT,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'CLK_PIN',
                        options: function () {
                            return getRotaryEncoderPinOptions();
                        }
                    },
                    {
                        type: 'field_dropdown',
                        name: 'DT_PIN',
                        options: function () {
                            return getRotaryEncoderPinOptions();
                        }
                    },
                    {
                        type: 'field_dropdown',
                        name: 'SW_PIN',
                        options: function () {
                            return getRotaryEncoderPinOptions();
                        }
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
            const clkField = this.getField('CLK_PIN');
            const dtField = this.getField('DT_PIN');
            const swField = this.getField('SW_PIN');
            if (clkField) {
                clkField.setValidator(makeRotaryEncoderPinValidator(getDefaultRotaryEncoderClkPin, 'DT_PIN'));
            }
            if (dtField) {
                dtField.setValidator(makeRotaryEncoderPinValidator(getDefaultRotaryEncoderDtPin, 'CLK_PIN'));
            }
            if (swField) {
                swField.setValidator(makeRotaryEncoderPinValidator(getDefaultRotaryEncoderSwPin));
            }
            fixRotaryEncoderPinFields(this);
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

    // ================= SPEED (steps/s) =================
    Blockly.Blocks.rotaryencoder_speed = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.ROTARYENCODER_SPEED,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    return Blockly;
}

module.exports = addBlocks;
