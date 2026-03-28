function addGenerator(Blockly) {
    Blockly.Arduino.nano_ble_connection = function (block) {
        const rxPin = Blockly.Arduino.valueToCode(block, 'RX', Blockly.Arduino.ORDER_ATOMIC) || '10';
        const txPin = Blockly.Arduino.valueToCode(block, 'TX', Blockly.Arduino.ORDER_ATOMIC) || '11';
        const baud = Blockly.Arduino.valueToCode(block, 'BAUD', Blockly.Arduino.ORDER_ATOMIC) || '9600';

        Blockly.Arduino.includes_['software_serial'] = `#include <SoftwareSerial.h>`;
        Blockly.Arduino.definitions_['ble_serial'] = `SoftwareSerial BLESerial(${rxPin}, ${txPin});`;
        Blockly.Arduino.definitions_['ble_buffer'] = `String inputBuffer = ""; unsigned long lastReadTime = 0; const unsigned long flushTimeout = 10;`;

        Blockly.Arduino.setups_['ble_serial_begin'] = `
Serial.begin(${baud});
BLESerial.begin(${baud});
Serial.println("🚀 Starting Bluetooth Serial...");
delay(1000);
Serial.println("✅ Ready for Bluetooth Commands");
`;

        Blockly.Arduino.loops_['ble_loop'] = `
while (BLESerial.available()) {
    char c = BLESerial.read();
    if (c == '\\n' || c == '\\r') {
        if (inputBuffer.length() > 0) {
            handleCommand(inputBuffer);
            inputBuffer = "";
        }
    } else {
        inputBuffer += c;
        lastReadTime = millis();
    }
}
if (inputBuffer.length() > 0 && millis() - lastReadTime > flushTimeout) {
    handleCommand(inputBuffer);
    inputBuffer = "";
}
`;

        Blockly.Arduino.definitions_['ble_handleCommand'] = `
// ====== COMMAND HANDLER ======
void sendResponse(const String &msg) {
  BLESerial.println(msg);
  Serial.println(msg);
}

#define IS_PIN_ANALOG(pin) (pin >= 0 && pin <= 7)

void handleCommand(String rxData) {
  rxData.trim();
  if (rxData.length() == 0) return;
  Serial.print("📥 RX: "); Serial.println(rxData);

  int pin, value;
  char mode[10], state[10];

  if (sscanf(rxData.c_str(), "%d%s", &pin, state) == 2) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, strcmp(state, "HIGH") == 0 ? HIGH : LOW);
    sendResponse("✅ Pin " + String(pin) + " set " + String(state));
    return;
  }

  if (rxData.startsWith("pinMode")) {
    if (sscanf(rxData.c_str(), "pinMode %d %s", &pin, mode) == 2) {
      if (strcmp(mode, "OUTPUT") == 0) pinMode(pin, OUTPUT);
      else pinMode(pin, INPUT);
      sendResponse("✅ PinMode " + String(pin) + " set " + String(mode));
    }
    return;
  }

  if (rxData.startsWith("PWM")) {
    if (sscanf(rxData.c_str(), "PWM %d %d", &pin, &value) == 2) {
      pinMode(pin, OUTPUT);
      analogWrite(pin, value);
      sendResponse("✅ PWM Pin " + String(pin) + " set " + String(value));
    }
    return;
  }

  if (rxData.startsWith("SERVO")) {
    if (sscanf(rxData.c_str(), "SERVO %d %d", &pin, &value) == 2) {
      pinMode(pin, OUTPUT);
      analogWrite(pin, map(value, 0, 180, 0, 255));
      sendResponse("✅ Servo Pin " + String(pin) + " set " + String(value));
    }
    return;
  }

  if (rxData.startsWith("digitalRead")) {
    if (sscanf(rxData.c_str(), "digitalRead %d", &pin) == 1) {
      pinMode(pin, INPUT);
      int val = digitalRead(pin);
      sendResponse(String(val));
    }
    return;
  }

  if (rxData.startsWith("analogRead")) {
    if (sscanf(rxData.c_str(), "analogRead %d", &pin) == 1) {
      if (IS_PIN_ANALOG(pin)) {
        int val = analogRead(pin);
        sendResponse(String(val));
      } else {
        sendResponse("⚠️ Not analog pin");
      }
    }
    return;
  }

  sendResponse("⚠️ Unknown command");
}
`;

        return '';
    };

    return Blockly;
}

exports = addGenerator;
