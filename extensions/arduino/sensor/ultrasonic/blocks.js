/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addBlocks (Blockly) {
    const color = '#D39DDB';
    const secondaryColour = '#BA55D3';

    // arduinoEsp32 / intermediateKit (AI & Robotics)
    const esp32UltrasonicPins = [
        ['IO16', '16'],
        ['IO17', '17']
    ];

    // arduinoNano / iotAiKit / iotAiKitnew (AI & IoT)
    const nanoUltrasonicPins = [
        ['12', '12'],
        ['8', '8'],
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

    function isEsp32UltrasonicKit () {
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

    function getUltrasonicPinOptions () {
        return isEsp32UltrasonicKit() ? esp32UltrasonicPins : nanoUltrasonicPins;
    }

    function getDefaultUltrasonicTrigPin () {
        return isEsp32UltrasonicKit() ? '16' : '12';
    }

    function getDefaultUltrasonicEchoPin () {
        return isEsp32UltrasonicKit() ? '17' : '8';
    }

    function pickAlternateUltrasonicPin (avoidPin, preferDefault) {
        const validPins = getUltrasonicPinOptions().map((entry) => String(entry[1]));
        const avoid = String(avoidPin || '');
        if (preferDefault && preferDefault !== avoid && validPins.includes(preferDefault)) {
            return preferDefault;
        }
        const alternate = validPins.find((pin) => pin !== avoid);
        return alternate || preferDefault || validPins[0] || avoid;
    }

    function fixUltrasonicPinFields (block) {
        if (!block || typeof block.getField !== 'function') {
            return;
        }
        const trigField = block.getField('TRIG');
        const echoField = block.getField('ECHO');
        const validPins = getUltrasonicPinOptions().map((entry) => String(entry[1]));

        if (trigField && !validPins.includes(String(trigField.getValue() || ''))) {
            trigField.setValue(getDefaultUltrasonicTrigPin());
        }
        if (echoField && !validPins.includes(String(echoField.getValue() || ''))) {
            echoField.setValue(getDefaultUltrasonicEchoPin());
        }
        if (trigField && echoField && String(trigField.getValue()) === String(echoField.getValue())) {
            echoField.setValue(pickAlternateUltrasonicPin(trigField.getValue(), getDefaultUltrasonicEchoPin()));
        }
    }

    function makeUltrasonicPinValidator (getDefaultPin, otherFieldName) {
        return function (newValue) {
            const validPins = getUltrasonicPinOptions().map((entry) => String(entry[1]));
            const value = String(newValue || '');
            if (!validPins.includes(value)) {
                return getDefaultPin();
            }
            if (otherFieldName && this.sourceBlock_) {
                const otherField = this.sourceBlock_.getField(otherFieldName);
                if (otherField && String(otherField.getValue()) === value) {
                    return pickAlternateUltrasonicPin(value, getDefaultPin());
                }
            }
            return value;
        };
    }

    Blockly.Blocks.ultrasonic_readDistance = {
        init: function () { /* eslint-disable-line func-style */
            this.jsonInit({
                message0: Blockly.Msg.ULTRASONIC_READ_DISTANCE,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TRIG',
                        options: function () {
                            return getUltrasonicPinOptions();
                        }
                    },
                    {
                        type: 'field_dropdown',
                        name: 'ECHO',
                        options: function () {
                            return getUltrasonicPinOptions();
                        }
                    },
                    {
                        type: 'field_dropdown',
                        name: 'UNIT',
                        options: [
                            ['cm', 'CM'],
                            ['inch', 'INC']]
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
            const trigField = this.getField('TRIG');
            const echoField = this.getField('ECHO');
            if (trigField) {
                trigField.setValidator(makeUltrasonicPinValidator(getDefaultUltrasonicTrigPin, 'ECHO'));
            }
            if (echoField) {
                echoField.setValidator(makeUltrasonicPinValidator(getDefaultUltrasonicEchoPin, 'TRIG'));
            }
            fixUltrasonicPinFields(this);
        }
    };


    return Blockly;
}

exports = addBlocks;
