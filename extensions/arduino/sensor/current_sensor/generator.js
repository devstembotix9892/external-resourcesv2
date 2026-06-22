/* eslint-disable func-style */
/* eslint-disable require-jsdoc */

function addGenerator(Blockly) {

    // ================================
    // INIT
    // ================================
    Blockly.Arduino.currentsensor_init = function (block) {
        const pin = block.getFieldValue('PIN');
        const sensitivityRaw = block.getFieldValue('MODEL'); // V/A (preferred), or legacy mV/A (e.g. 100)
        const sensitivityNum = Number(sensitivityRaw);
        const sensitivityVA = (Number.isFinite(sensitivityNum) && sensitivityNum > 1)
          ? (sensitivityNum / 1000.0) // legacy mV/A -> V/A
          : sensitivityRaw;

        Blockly.Arduino.definitions_.currentsensor_pins = `
#define CURRENT_PIN ${pin}
#define ACS712_SENSITIVITY ${sensitivityVA}  // V per Amp
#define ACS712_ZERO_POINT 2.5                // V at 0A (VCC/2 for 5V boards)
`;

        Blockly.Arduino.definitions_.currentsensor_func = `
float readCurrentAmps() {
  long sum = 0;
  // Average 100 readings (noise reduction)
  for (int i = 0; i < 100; i++) {
    sum += analogRead(CURRENT_PIN);
    delay(2);
  }

  float adcValue = sum / 100.0;

  // Convert ADC → Voltage
  float voltage = adcValue * (5.0 / 1023.0);

  // Voltage → Current
  float current = (voltage - ACS712_ZERO_POINT) / ACS712_SENSITIVITY;
  return current;
}

float readCurrentMilliAmps() {
  return readCurrentAmps() * 1000.0;
}
`;

        Blockly.Arduino.setups_.currentsensor_setup = `
// ACS712 no setup nathi - analog read auto kare
`;

        return '';
    };

    // ================================
    // READ AMPS
    // ================================
    Blockly.Arduino.currentsensor_readAmps = function (block) {
        return ['readCurrentAmps()', Blockly.Arduino.ORDER_ATOMIC];
    };

    // ================================
    // READ RAW
    // ================================
    Blockly.Arduino.currentsensor_readRaw = function (block) {
        return ['analogRead(CURRENT_PIN)', Blockly.Arduino.ORDER_ATOMIC];
    };

    // ================================
    // READ MILLIAMPS
    // ================================
    Blockly.Arduino.currentsensor_readMilliAmps = function (block) {
        return ['readCurrentMilliAmps()', Blockly.Arduino.ORDER_ATOMIC];
    };

    return Blockly;
}

module.exports = addGenerator;
