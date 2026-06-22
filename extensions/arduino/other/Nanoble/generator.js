function addGenerator(Blockly) {

    // ============================================================
    // BLE CONNECTION CORE
    // ============================================================
    Blockly.Arduino.nano_ble_connection = function (block) {

        const rxPin = Blockly.Arduino.valueToCode(block, 'RX', Blockly.Arduino.ORDER_ATOMIC) || '10';
        const txPin = Blockly.Arduino.valueToCode(block, 'TX', Blockly.Arduino.ORDER_ATOMIC) || '11';
        const baud  = Blockly.Arduino.valueToCode(block, 'BAUD', Blockly.Arduino.ORDER_ATOMIC) || '9600';

        // ================= INCLUDES =================
        Blockly.Arduino.includes_['software_serial'] = `#include <SoftwareSerial.h>`;
        Blockly.Arduino.includes_['servo'] = `#include <Servo.h>`;
        Blockly.Arduino.includes_['dht'] = `#include <DHT.h>`;
        Blockly.Arduino.includes_['tm1637'] = `#include <TM1637Display.h>`;
        Blockly.Arduino.includes_['neopixel'] = `#include <Adafruit_NeoPixel.h>`;

        // ================= GLOBAL DEFINITIONS =================
        Blockly.Arduino.definitions_['ble_serial'] =
`SoftwareSerial BLESerial(${rxPin}, ${txPin});`;

        Blockly.Arduino.definitions_['ble_buffer'] =
`String inputBuffer = "";
unsigned long lastReadTime = 0;
const unsigned long flushTimeout = 10;`;

        Blockly.Arduino.definitions_['ble_globals'] =
`Servo servoObj;
DHT* dht1 = NULL;
TM1637Display* display4 = NULL;
Adafruit_NeoPixel* ledMatrix = NULL;
long duration;
int distanceCm;`;

        // ================= SETUP =================
        Blockly.Arduino.setups_['ble_setup'] =
`Serial.begin(${baud});
BLESerial.begin(${baud});
Serial.println("Bluetooth Ready");`;

        // ================= LOOP =================
        Blockly.Arduino.loops_['ble_loop'] =
`while (BLESerial.available()) {
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
}`;

        // ================= COMMAND HANDLER =================
        Blockly.Arduino.definitions_['ble_handler'] = `

void sendResponse(const String &msg) {
  BLESerial.println(msg);
  Serial.println(msg);
}

void handleCommand(String rxData) {

  rxData.trim();
  if (rxData.length() == 0) return;

  Serial.print("CMD: ");
  Serial.println(rxData);

  int pin, value, model, num, bright, trig, echo, dio, clk;
  char mode[12], state[12];

  // ---------- DIGITAL WRITE ----------
  if (sscanf(rxData.c_str(), "%d%s", &pin, state) == 2) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, strcmp(state, "HIGH") == 0 ? HIGH : LOW);
    sendResponse("OK");
    return;
  }

  // ---------- PIN MODE ----------
  if (rxData.startsWith("pinMode")) {
    if (sscanf(rxData.c_str(), "pinMode %d %s", &pin, mode) == 2) {
      if (strcmp(mode, "OUTPUT") == 0) pinMode(pin, OUTPUT);
      else if (strcmp(mode, "INPUT_PULLUP") == 0) pinMode(pin, INPUT_PULLUP);
      else pinMode(pin, INPUT);
      sendResponse("OK");
    }
    return;
  }

  // ---------- PWM ----------
  if (rxData.startsWith("PWM")) {
    if (sscanf(rxData.c_str(), "PWM %d %d", &pin, &value) == 2) {
      analogWrite(pin, value);
      sendResponse("OK");
    }
    return;
  }

  // ---------- SERVO ----------
  if (rxData.startsWith("SERVO")) {
    if (sscanf(rxData.c_str(), "SERVO %d %d", &pin, &value) == 2) {
      servoObj.attach(pin);
      servoObj.write(value);
      sendResponse("OK");
    }
    return;
  }

  // ---------- DIGITAL READ ----------
  if (rxData.startsWith("digitalRead")) {
    if (sscanf(rxData.c_str(), "digitalRead %d", &pin) == 1) {
      sendResponse(String(digitalRead(pin)));
    }
    return;
  }

  // ---------- ANALOG READ ----------
  if (rxData.startsWith("analogRead")) {
    if (sscanf(rxData.c_str(), "analogRead %d", &pin) == 1) {
      sendResponse(String(analogRead(pin)));
    }
    return;
  }

  // ---------- DHT ----------
  if (rxData.startsWith("DHT_INIT")) {
    if (sscanf(rxData.c_str(), "DHT_INIT %d %d", &pin, &model) == 2) {
      if (dht1 != NULL) delete dht1;
      dht1 = new DHT(pin, model);
      dht1->begin();
      sendResponse("OK");
    }
    return;
  }

  if (rxData.startsWith("DHT_TEMP")) {
    if (dht1 == NULL) { sendResponse("ERR:DHT_NOT_INIT"); return; }
    sendResponse(String(dht1->readTemperature()));
    return;
  }

  if (rxData.startsWith("DHT_HUM")) {
    if (dht1 == NULL) { sendResponse("ERR:DHT_NOT_INIT"); return; }
    sendResponse(String(dht1->readHumidity()));
    return;
  }

  // ---------- ULTRASONIC ----------
  if (rxData.startsWith("ULTRA")) {
    if (sscanf(rxData.c_str(), "ULTRA %d %d", &trig, &echo) == 2) {

      pinMode(trig, OUTPUT);
      pinMode(echo, INPUT);

      digitalWrite(trig, LOW);
      delayMicroseconds(2);
      digitalWrite(trig, HIGH);
      delayMicroseconds(10);
      digitalWrite(trig, LOW);

      duration = pulseIn(echo, HIGH, 30000);

      if (duration == 0) {
        sendResponse("ERR:TIMEOUT");
      } else {
        distanceCm = duration * 0.034 / 2;
        sendResponse(String(distanceCm));
      }
    }
    return;
  }

  // ---------- TM1637 ----------
  if (rxData.startsWith("TM1637_INIT")) {
    if (sscanf(rxData.c_str(), "TM1637_INIT %d %d", &clk, &dio) == 2) {
      if (display4 != NULL) delete display4;
      display4 = new TM1637Display(clk, dio);
      display4->setBrightness(7);
      display4->clear();
      sendResponse("OK");
    }
    return;
  }

  if (rxData.startsWith("TM1637_SHOW")) {
    int number;
    if (sscanf(rxData.c_str(), "TM1637_SHOW %d", &number) == 1) {
      if (display4 == NULL) { sendResponse("ERR:DISPLAY_NOT_INIT"); return; }
      display4->showNumberDec(number);
      sendResponse("OK");
    }
    return;
  }

  if (rxData.startsWith("TM1637_BRIGHTNESS")) {
    int brightness;
    if (sscanf(rxData.c_str(), "TM1637_BRIGHTNESS %d", &brightness) == 1) {
      if (display4 == NULL) { sendResponse("ERR:DISPLAY_NOT_INIT"); return; }
      brightness = constrain(brightness, 0, 15);
      display4->setBrightness(brightness);
      sendResponse("OK");
    }
    return;
  }

  if (rxData.startsWith("TM1637_CLEAR")) {
    if (display4 == NULL) { sendResponse("ERR:DISPLAY_NOT_INIT"); return; }
    display4->clear();
    sendResponse("OK");
    return;
  }

  // ---------- NEOPIXEL ----------
  if (rxData.startsWith("LED_INIT")) {
    if (sscanf(rxData.c_str(), "LED_INIT %d %d %d", &pin, &num, &bright) == 3) {
      if (ledMatrix != NULL) delete ledMatrix;
      ledMatrix = new Adafruit_NeoPixel(num, pin, NEO_GRB + NEO_KHZ800);
      ledMatrix->begin();
      ledMatrix->setBrightness(bright);
      ledMatrix->show();
      sendResponse("OK");
    }
    return;
  }

  if (rxData.startsWith("LED_SET")) {
    int index, r, g, b;
    if (sscanf(rxData.c_str(), "LED_SET %d %d %d %d", &index, &r, &g, &b) == 4) {
      if (ledMatrix == NULL) { sendResponse("ERR:LED_NOT_INIT"); return; }
      ledMatrix->setPixelColor(index, ledMatrix->Color(r, g, b));
      ledMatrix->show();
      sendResponse("OK");
    }
    return;
  }

  sendResponse("ERR:UNKNOWN_CMD");
}
`;

        return '';
    };

    return Blockly;
}

exports = addGenerator;
