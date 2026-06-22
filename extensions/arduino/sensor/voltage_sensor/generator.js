/* eslint-disable func-style */
/* eslint-disable require-jsdoc */

/** Flyout may use "IO36", "D34", "36", or "A0" — emit a valid Arduino pin number/expression. */
function normalizeArduinoPin (pinVal) {
    const s = String(pinVal == null ? '' : pinVal).trim();
    if (/^A\d+$/i.test(s)) {
        return s.toUpperCase();
    }
    const m = s.match(/(\d+)/);
    return m ? m[1] : s;
}

/** Dropdown uses D4/D34 (ESP32) or A4 (Nano) — emit valid pin for generated code. */
function resolveVoltagePin (pinVal) {
    return normalizeArduinoPin(pinVal);
}

function addGenerator (Blockly) {
    // ================================
    // INIT
    // ================================
    Blockly.Arduino.voltagesensor_init = function (block) {
        const pin = resolveVoltagePin(block.getFieldValue('PIN'));
        const adcRef = block.getFieldValue('ADCREF'); // "5.0" or "3.3"

        Blockly.Arduino.definitions_.voltagesensor_defs = `
#define VOLTAGE_PIN ${pin}
#define VOLTAGE_ADC_REF ${adcRef}
`;

        Blockly.Arduino.definitions_.voltagesensor_func = `
#if defined(ARDUINO_ARCH_ESP32)
  #ifndef VOLTAGE_ADC_MAX
    #define VOLTAGE_ADC_MAX 4095
  #endif
#else
  #ifndef VOLTAGE_ADC_MAX
    #define VOLTAGE_ADC_MAX 1023
  #endif
#endif

float readVoltageVout() {
  long sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += analogRead(VOLTAGE_PIN);
    delay(2);
  }
  int adcValue = (int)(sum / 8);
  float vout = adcValue * (VOLTAGE_ADC_REF / (float)VOLTAGE_ADC_MAX);
  return vout;
}
`;

        Blockly.Arduino.setups_.voltagesensor_setup = `
#if defined(ARDUINO_ARCH_ESP32)
  pinMode(VOLTAGE_PIN, INPUT);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  analogSetPinAttenuation(VOLTAGE_PIN, ADC_11db);
#endif
`;

        return '';
    };

    // ================================
    // READ VOUT (Volts)
    // ================================
    Blockly.Arduino.voltagesensor_readVout = function () {
        return ['readVoltageVout()', Blockly.Arduino.ORDER_ATOMIC];
    };

    // ================================
    // READ RAW
    // ================================
    Blockly.Arduino.voltagesensor_readRaw = function () {
        return ['analogRead(VOLTAGE_PIN)', Blockly.Arduino.ORDER_ATOMIC];
    };

    return Blockly;
}

module.exports = addGenerator;
