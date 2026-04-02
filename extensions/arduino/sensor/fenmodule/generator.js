/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addGenerator(Blockly) {
    // --- Initialize motor pins ---
    Blockly.Arduino.motor_init = function (block) {
        const pin1 = block.getFieldValue('PIN1');
        const pin2 = block.getFieldValue('PIN2');

        Blockly.Arduino.definitions_['motor_pins'] = `
int motorPin1 = ${pin1};
int motorPin2 = ${pin2};
`;

        Blockly.Arduino.setups_['motor_setup'] = `
pinMode(motorPin1, OUTPUT);
pinMode(motorPin2, OUTPUT);
`;

        return '';
    };

    // --- Rotate motor block ---
    Blockly.Arduino.motor_rotate = function (block) {
        const direction = block.getFieldValue('DIRECTION');

        let code = '';
        if (direction === 'CW') {
            code = `
digitalWrite(motorPin1, HIGH);
digitalWrite(motorPin2, LOW);
delay(1000);
`;
        } else {
            code = `
digitalWrite(motorPin1, LOW);
digitalWrite(motorPin2, HIGH);
delay(1000);
`;
        }

        return code;
    };

    return Blockly;
}

exports = addGenerator;
