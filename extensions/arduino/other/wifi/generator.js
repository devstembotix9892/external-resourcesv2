function addGenerator(Blockly) {
  Blockly.Arduino.wifi_connect = function (block) {
    const ssid =
      Blockly.Arduino.valueToCode(block, 'SSID', Blockly.Arduino.ORDER_ATOMIC) || '""';
    const password =
      Blockly.Arduino.valueToCode(block, 'PASSWORD', Blockly.Arduino.ORDER_ATOMIC) || '""';

    // ================= INCLUDES =================
    Blockly.Arduino.includes_['wifi'] = `
#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <DHT.h>
#include <TM1637Display.h>
#include <Adafruit_TCS34725.h>
#include <SPI.h>
#include <Adafruit_NeoPixel.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>`;

    // ================= DEFINITIONS =================
    Blockly.Arduino.definitions_['wifi_credentials'] = `
const char* ssid = ${ssid};
const char* password = ${password};
WebServer server(80);
Servo __blockly_servo__;

// DHT Sensors (support up to 4 sensors)
DHT* dhtSensors[4] = {nullptr, nullptr, nullptr, nullptr};

// TM1637 Display
TM1637Display* tm1637Display = nullptr;
// 7-segment segment map for digits and common letters (A,B,C... O,P,E,n etc.)
uint8_t tm1637SegmentForChar(char c) {
  if (c >= '0' && c <= '9') return tm1637Display->encodeDigit(c - '0');
  switch ((char)toupper((int)c)) {
    case 'A': return 0x77; case 'B': return 0x7C; case 'C': return 0x39;
    case 'D': return 0x5E; case 'E': return 0x79; case 'F': return 0x71;
    case 'G': return 0x3D; case 'H': return 0x76; case 'I': return 0x30;
    case 'J': return 0x1E; case 'L': return 0x38; case 'N': return 0x54;
    case 'O': return 0x3F; case 'P': return 0x73; case 'Q': return 0x67;
    case 'R': return 0x50; case 'S': return 0x6D; case 'T': return 0x78;
    case 'U': return 0x3E; case 'Y': return 0x6E; case 'Z': return 0x5B;
    default: return 0x00;
  }
  return 0x00;
}

// TCS3200 Color Sensor
int tcs3200S0 = -1, tcs3200S1 = -1, tcs3200S2 = -1, tcs3200S3 = -1, tcs3200OE = -1;
int tcs3200WhiteCal[3] = {0, 0, 0};
int tcs3200BlackCal[3] = {0, 0, 0};
bool tcs3200Calibrated = false;

// TCS34725 Color Sensor (I2C)
Adafruit_TCS34725* tcs34725 = nullptr;
uint16_t tcs34725Color[4] = {0, 0, 0, 0}; // R, G, B, C

// Ultrasonic Sensor
int ultrasonicTrig = -1;
int ultrasonicEcho = -1;

// Matrix 8x8 (MAX7219) - Simple SPI implementation
int matrix8x8_cs_pin = -1;
uint8_t matrix8x8_buffer[8] = {0};  // 8 rows, each row is 8 bits

// MAX7219 register addresses
#define MAX7219_REG_NOOP        0x00
#define MAX7219_REG_DIGIT0      0x01
#define MAX7219_REG_DIGIT1      0x02
#define MAX7219_REG_DIGIT2      0x03
#define MAX7219_REG_DIGIT3      0x04
#define MAX7219_REG_DIGIT4      0x05
#define MAX7219_REG_DIGIT5      0x06
#define MAX7219_REG_DIGIT6      0x07
#define MAX7219_REG_DIGIT7      0x08
#define MAX7219_REG_DECODEMODE  0x09
#define MAX7219_REG_INTENSITY   0x0A
#define MAX7219_REG_SCANLIMIT   0x0B
#define MAX7219_REG_SHUTDOWN    0x0C
#define MAX7219_REG_DISPLAYTEST 0x0F

// Helper function to send data to MAX7219
void max7219_send(uint8_t reg, uint8_t data) {
  digitalWrite(matrix8x8_cs_pin, LOW);
  SPI.transfer(reg);
  SPI.transfer(data);
  digitalWrite(matrix8x8_cs_pin, HIGH);
}

// LED Matrix (WS2812/NeoPixel 5x7 = 35 LEDs)
Adafruit_NeoPixel* ledMatrixStrip = nullptr;
#define LEDMATRIX_DEFAULT_PIN 4
#define LEDMATRIX_ROWS 7
#define LEDMATRIX_COLS 5
#define LEDMATRIX_LEDS 35

// Helper function to set pixel in 5x7 matrix
void setMatrixPixel(int x, int y, uint32_t color) {
  if (ledMatrixStrip != nullptr && x >= 0 && x < LEDMATRIX_COLS && y >= 0 && y < LEDMATRIX_ROWS) {
    // Row-major order: y * COLS + x
    int idx = y * LEDMATRIX_COLS + x;
    ledMatrixStrip->setPixelColor(idx, color);
  }
}

// Stepper Motor
int stepperDirPin = -1;
int stepperStepPin = -1;
int stepperStepsPerRev = 200;
bool stepperInitialized = false;

// 1602 LCD (I2C) — commands: LCD_INIT_I2C, LCD_CURSOR, LCD_PRINT, LCD_CLEAR, LCD_BACKLIGHT, LCD_ACTION
LiquidCrystal_I2C* lcdI2c = nullptr;
bool lcdReady = false;
int lcdI2cAddrStored = 39;
int lcdI2cChipStored = 1602;

bool lcdDoInit(int addr, int chip) {
  if (lcdI2c != nullptr) {
    delete lcdI2c;
    lcdI2c = nullptr;
  }
  int cols = 16, rows = 2;
  if (chip == 2004) { cols = 20; rows = 4; }
  lcdI2cAddrStored = addr;
  lcdI2cChipStored = chip;
#if defined(ARDUINO_ARCH_ESP32)
  Wire.begin(21, 22);
#else
  Wire.begin();
#endif
  lcdI2c = new LiquidCrystal_I2C(addr, cols, rows);
  lcdI2c->init();
  lcdI2c->backlight();
  lcdI2c->display();
  lcdI2c->clear();
  lcdReady = true;
  return true;
}

bool lcdEnsureReady() {
  if (lcdReady && lcdI2c != nullptr) return true;
  return lcdDoInit(lcdI2cAddrStored, lcdI2cChipStored);
}

// RGB LED (WS2812/NeoPixel, one LED per data pin) — RGBLED_INIT, RGBLED_SET, RGBLED_OFF
#define RGBLED_MAX_STRIPS 8
struct RgbLedEntry {
  int pin;
  Adafruit_NeoPixel* strip;
};
RgbLedEntry rgbLedStrips[RGBLED_MAX_STRIPS];
int rgbLedStripCount = 0;

Adafruit_NeoPixel* rgbLedGetStrip(int pin) {
  for (int i = 0; i < rgbLedStripCount; i++) {
    if (rgbLedStrips[i].pin == pin) return rgbLedStrips[i].strip;
  }
  if (rgbLedStripCount >= RGBLED_MAX_STRIPS) return nullptr;
  Adafruit_NeoPixel* px = new Adafruit_NeoPixel(1, pin, NEO_GRB + NEO_KHZ800);
  px->begin();
  px->setBrightness(255);
  px->clear();
  px->show();
  rgbLedStrips[rgbLedStripCount].pin = pin;
  rgbLedStrips[rgbLedStripCount].strip = px;
  rgbLedStripCount++;
  return px;
}

// Rotary encoder — ENCODER_INIT, ENCODER_GET_COUNT, ENCODER_RESET, ENCODER_GET_DIRECTION, ENCODER_GET_SPEED
#define ENC_STEPS_PER_CLICK 4
int encClkPin = -1, encDtPin = -1, encSwPin = -1;
volatile long encCount = 0;
volatile int8_t encDir = 0;
volatile uint8_t encPrevState = 0;
volatile int8_t encAcc = 0;
volatile uint32_t encLastStepUs = 0;
volatile int32_t encSpeedMilliSps = 0;
bool encInitialized = false;

uint8_t encReadState() {
  uint8_t clk = (uint8_t)digitalRead(encClkPin);
  uint8_t dt = (uint8_t)digitalRead(encDtPin);
  return (uint8_t)((clk << 1) | dt);
}

void encApplyDelta(int8_t delta) {
  if (delta == 0) return;
  encAcc += delta;
  if (encAcc >= 4) {
    uint32_t now = micros();
    if (encLastStepUs != 0) {
      uint32_t dt = (uint32_t)(now - encLastStepUs);
      if (dt > 80UL && dt < 400000UL) {
        int32_t inst = (int32_t)(1000000000LL / (int64_t)dt);
        encSpeedMilliSps = (int32_t)(((int64_t)encSpeedMilliSps * 6 + (int64_t)inst * 4) / 10);
      }
    }
    encLastStepUs = now;
    encCount++;
    encDir = 1;
    encAcc = 0;
  } else if (encAcc <= -4) {
    uint32_t now = micros();
    if (encLastStepUs != 0) {
      uint32_t dt = (uint32_t)(now - encLastStepUs);
      if (dt > 80UL && dt < 400000UL) {
        int32_t inst = -(int32_t)(1000000000LL / (int64_t)dt);
        encSpeedMilliSps = (int32_t)(((int64_t)encSpeedMilliSps * 6 + (int64_t)inst * 4) / 10);
      }
    }
    encLastStepUs = now;
    encCount--;
    encDir = -1;
    encAcc = 0;
  }
}

void IRAM_ATTR encISR() {
  const uint8_t state = encReadState();
  const uint8_t idx = (uint8_t)((encPrevState << 2) | state);
  static const int8_t tbl[16] = {
    0, -1,  1,  0,
    1,  0,  0, -1,
   -1,  0,  0,  1,
    0,  1, -1,  0
  };
  encApplyDelta(tbl[idx]);
  encPrevState = state;
}

void encPoll() {
  if (!encInitialized) return;
  const uint8_t state = encReadState();
  const uint8_t idx = (uint8_t)((encPrevState << 2) | state);
  static const int8_t tbl[16] = {
    0, -1,  1,  0,
    1,  0,  0, -1,
   -1,  0,  0,  1,
    0,  1, -1,  0
  };
  encApplyDelta(tbl[idx]);
  encPrevState = state;
}

long encGetCount() {
  encPoll();
  noInterrupts();
  long c = encCount;
  interrupts();
  return c;
}

// Blockzie runtime divides by 4 — return step count (detents * 4), not detents
long encGetCountForApp() {
  long detents = encGetCount();
  return detents * ENC_STEPS_PER_CLICK;
}

String encGetDirectionStr() {
  encPoll();
  noInterrupts();
  int8_t d = encDir;
  interrupts();
  uint32_t now = micros();
  if (encLastStepUs == 0 || (uint32_t)(now - encLastStepUs) > 250000UL) return "stopped";
  if (d > 0) return "clockwise";
  if (d < 0) return "anticlockwise";
  return "stopped";
}

float encGetSpeed() {
  encPoll();
  uint32_t now = micros();
  noInterrupts();
  uint32_t last = encLastStepUs;
  int32_t sm = encSpeedMilliSps;
  interrupts();
  if (last == 0 || (uint32_t)(now - last) > 250000UL) return 0.0f;
  return (float)sm / 1000.0f;
}

void encReset() {
  noInterrupts();
  encCount = 0;
  encDir = 0;
  encAcc = 0;
  encLastStepUs = 0;
  encSpeedMilliSps = 0;
  interrupts();
}

void encInitPins(int clk, int dt, int sw) {
  if (encInitialized) {
    detachInterrupt(digitalPinToInterrupt(encClkPin));
    detachInterrupt(digitalPinToInterrupt(encDtPin));
    encInitialized = false;
  }
  encClkPin = clk;
  encDtPin = dt;
  encSwPin = sw;
#if defined(ARDUINO_ARCH_ESP32)
  pinMode(encClkPin, (encClkPin >= 34 && encClkPin <= 39) ? INPUT : INPUT_PULLUP);
  pinMode(encDtPin, (encDtPin >= 34 && encDtPin <= 39) ? INPUT : INPUT_PULLUP);
  pinMode(encSwPin, (encSwPin >= 34 && encSwPin <= 39) ? INPUT : INPUT_PULLUP);
#else
  pinMode(encClkPin, INPUT_PULLUP);
  pinMode(encDtPin, INPUT_PULLUP);
  pinMode(encSwPin, INPUT_PULLUP);
#endif
  encReset();
  encPrevState = encReadState();
  attachInterrupt(digitalPinToInterrupt(encClkPin), encISR, CHANGE);
  attachInterrupt(digitalPinToInterrupt(encDtPin), encISR, CHANGE);
  encInitialized = true;
}`;

    // ================= SETUP =================
    Blockly.Arduino.setups_['wifi_setup'] = `
Serial.begin(115200);
initializeWiFi();`;

    // ================= WIFI FUNCTION =================
    Blockly.Arduino.definitions_['initialize_wifi_function'] = `
void initializeWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startAttemptTime >= 10000) {
      Serial.println("❌ WiFi Connection Failed!");
      return;
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("✅ Connected to WiFi");
  Serial.println(WiFi.localIP());

  server.on("/control", HTTP_POST, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");

    String cmd;
    if (server.hasArg("plain")) {
      cmd = server.arg("plain");
    } else if (server.hasArg("body")) {
      cmd = server.arg("body");
    } else {
      server.send(400, "text/plain", "No data");
      return;
    }
    cmd.trim();
    Serial.println("📥 Received: " + cmd);

    // ================= SET PIN MODE =================
    if (cmd.startsWith("SET_PIN_MODE")) {
      int pin;
      char mode[10];
      if (sscanf(cmd.c_str(), "SET_PIN_MODE %d %s", &pin, mode) == 2) {
        pinMode(pin, strcmp(mode, "INPUT") == 0 ? INPUT : OUTPUT);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= SET DIGITAL OUTPUT =================
    if (cmd.startsWith("SET_DIGITAL_OUTPUT")) {
      int pin[4];
      char state[4][10];
      int count = sscanf(
        cmd.c_str(),
        "SET_DIGITAL_OUTPUT %d %s %d %s %d %s %d %s",
        &pin[0], state[0],
        &pin[1], state[1],
        &pin[2], state[2],
        &pin[3], state[3]
      );
      for (int i = 0; i < count / 2; i++) {
        pinMode(pin[i], OUTPUT);
        digitalWrite(pin[i], strcmp(state[i], "HIGH") == 0 ? HIGH : LOW);
      }
      delay(50);
      server.send(200, "text/plain", "OK");
      return;
    }

    // ================= DIGITAL WRITE =================
    if (cmd.startsWith("DIGITAL_WRITE")) {
      int pin, val;
      if (sscanf(cmd.c_str(), "DIGITAL_WRITE %d %d", &pin, &val) == 2) {
        pinMode(pin, OUTPUT);
        digitalWrite(pin, val);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= DIGITAL READ =================
    if (cmd.startsWith("DIGITAL_READ")) {
      int pin;
      if (sscanf(cmd.c_str(), "DIGITAL_READ %d", &pin) == 1) {
        pinMode(pin, INPUT);
        int value = digitalRead(pin);
        server.send(200, "text/plain", String(value));
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= ANALOG READ =================
    if (cmd.startsWith("READ_ANALOG")) {
      int pin;
      if (sscanf(cmd.c_str(), "READ_ANALOG %d", &pin) == 1) {
        int value = analogRead(pin);
        server.send(200, "text/plain", String(value));
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= PWM OUTPUT =================
    if (cmd.startsWith("SET_PWM_OUTPUT")) {
      int pin, value;
      if (sscanf(cmd.c_str(), "SET_PWM_OUTPUT %d %d", &pin, &value) == 2) {
        // ESP32 Core 3.x API — pin-based, no channel
        ledcAttach(pin, 5000, 8);
        ledcWrite(pin, value);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= SERVO OUTPUT =================
    if (cmd.startsWith("SET_SERVO_OUTPUT")) {
      int pin, angle;
      if (sscanf(cmd.c_str(), "SET_SERVO_OUTPUT %d %d", &pin, &angle) == 2) {
        __blockly_servo__.attach(pin);
        __blockly_servo__.write(angle);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= TM1637 INIT =================
    if (cmd.startsWith("TM1637_INIT")) {
      int dio, clk;
      if (sscanf(cmd.c_str(), "TM1637_INIT %d %d", &dio, &clk) == 2) {
        if (tm1637Display == nullptr) {
          tm1637Display = new TM1637Display(clk, dio);
          tm1637Display->setBrightness(7);
          tm1637Display->clear();
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= TM1637 BRIGHTNESS =================
    if (cmd.startsWith("TM1637_BRIGHTNESS")) {
      int brightness;
      if (sscanf(cmd.c_str(), "TM1637_BRIGHTNESS %d", &brightness) == 1 && tm1637Display != nullptr) {
        tm1637Display->setBrightness(brightness);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TM1637 NUMBER =================
    if (cmd.startsWith("TM1637_NUMBER")) {
      int number;
      if (sscanf(cmd.c_str(), "TM1637_NUMBER %d", &number) == 1 && tm1637Display != nullptr) {
        tm1637Display->showNumberDec(number);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TM1637 STRING (digits + letters e.g. Open) =================
    if (cmd.startsWith("TM1637_STRING")) {
      char data[10];
      if (sscanf(cmd.c_str(), "TM1637_STRING %s", data) == 1 && tm1637Display != nullptr) {
        int len = (int)strlen(data);
        if (len > 4) len = 4;
        for (int i = 0; i < len; i++) {
          uint8_t seg = tm1637SegmentForChar(data[i]);
          tm1637Display->setSegments(&seg, 1, i);
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TM1637 DIGIT =================
    if (cmd.startsWith("TM1637_DIGIT")) {
      int digit, pos;
      if (sscanf(cmd.c_str(), "TM1637_DIGIT %d %d", &digit, &pos) == 2 && tm1637Display != nullptr) {
        tm1637Display->showNumberDec(digit, false, 1, pos);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TM1637 CLEAR =================
    if (cmd.startsWith("TM1637_CLEAR")) {
      if (tm1637Display != nullptr) {
        tm1637Display->clear();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TM1637 COLON =================
    if (cmd.startsWith("TM1637_COLON")) {
      char state[10];
      if (sscanf(cmd.c_str(), "TM1637_COLON %s", state) == 1 && tm1637Display != nullptr) {
        bool colonOn = (strcmp(state, "true") == 0);
        // Note: The standard TM1637Display library doesn't have setColon()
        // You need to handle colon as part of the number display
        // Use showNumberDecEx() with 0x80 flag for colon
        server.send(200, "text/plain", "COLON_NOT_SUPPORTED_DIRECTLY");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= DHT INIT =================
    if (cmd.startsWith("DHT_INIT")) {
      int no, pin, model;
      if (sscanf(cmd.c_str(), "DHT_INIT %d %d %d", &no, &pin, &model) == 3 && no >= 0 && no < 4) {
        if (dhtSensors[no] != nullptr) {
          delete dhtSensors[no];
        }
        dhtSensors[no] = new DHT(pin, model);
        dhtSensors[no]->begin();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= DHT READ TEMPERATURE =================
    if (cmd.startsWith("DHT_READ_TEMP")) {
      int no, isFahrenheit;
      if (sscanf(cmd.c_str(), "DHT_READ_TEMP %d %d", &no, &isFahrenheit) == 2 && 
          no >= 0 && no < 4 && dhtSensors[no] != nullptr) {
        float temp = isFahrenheit ? dhtSensors[no]->readTemperature(true) : dhtSensors[no]->readTemperature();
        if (!isnan(temp)) {
          server.send(200, "text/plain", String(temp));
        } else {
          server.send(400, "text/plain", "READ_ERROR");
        }
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= DHT READ HUMIDITY =================
    if (cmd.startsWith("DHT_READ_HUM")) {
      int no;
      if (sscanf(cmd.c_str(), "DHT_READ_HUM %d", &no) == 1 && 
          no >= 0 && no < 4 && dhtSensors[no] != nullptr) {
        float hum = dhtSensors[no]->readHumidity();
        if (!isnan(hum)) {
          server.send(200, "text/plain", String(hum));
        } else {
          server.send(400, "text/plain", "READ_ERROR");
        }
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= ULTRASONIC READ =================
    if (cmd.startsWith("ULTRASONIC_READ")) {
      int trig, echo, isInch;
      if (sscanf(cmd.c_str(), "ULTRASONIC_READ %d %d %d", &trig, &echo, &isInch) == 3) {
        pinMode(trig, OUTPUT);
        pinMode(echo, INPUT);
        digitalWrite(trig, LOW);
        delayMicroseconds(2);
        digitalWrite(trig, HIGH);
        delayMicroseconds(10);
        digitalWrite(trig, LOW);
        long duration = pulseIn(echo, HIGH);
        float distance = duration * (isInch ? 0.0133 : 0.034) / 2.0;
        server.send(200, "text/plain", String(distance));
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= TCS3200 INIT =================
    if (cmd.startsWith("TCS3200_INIT")) {
      int s0, s1, s2, s3, oe;
      if (sscanf(cmd.c_str(), "TCS3200_INIT %d %d %d %d %d", &s0, &s1, &s2, &s3, &oe) == 5) {
        tcs3200S0 = s0; tcs3200S1 = s1; tcs3200S2 = s2; tcs3200S3 = s3; tcs3200OE = oe;
        pinMode(s0, OUTPUT); pinMode(s1, OUTPUT);
        pinMode(s2, OUTPUT); pinMode(s3, OUTPUT);
        pinMode(oe, OUTPUT);
        digitalWrite(s0, HIGH);
        digitalWrite(s1, LOW);
        digitalWrite(oe, LOW);
        tcs3200Calibrated = false;
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= TCS3200 CALIBRATE WHITE =================
    if (cmd.startsWith("TCS3200_CALIBRATE_WHITE")) {
      if (tcs3200S0 >= 0) {
        // Read RGB values for white calibration
        // Note: Actual implementation would read from sensor pins
        tcs3200WhiteCal[0] = 255; tcs3200WhiteCal[1] = 255; tcs3200WhiteCal[2] = 255;
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS3200 CALIBRATE BLACK =================
    if (cmd.startsWith("TCS3200_CALIBRATE_BLACK")) {
      if (tcs3200S0 >= 0) {
        tcs3200BlackCal[0] = 0; tcs3200BlackCal[1] = 0; tcs3200BlackCal[2] = 0;
        tcs3200Calibrated = true;
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS3200 MEASURE =================
    if (cmd.startsWith("TCS3200_MEASURE")) {
      if (tcs3200S0 >= 0) {
        // Measure color - placeholder implementation
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS3200 GET COLOR =================
    if (cmd.startsWith("TCS3200_GET_COLOR")) {
      char colorType[10];
      if (sscanf(cmd.c_str(), "TCS3200_GET_COLOR %s", colorType) == 1 && tcs3200S0 >= 0) {
        // Return color value based on type (R, G, B)
        int value = 0;
        if (strcmp(colorType, "R") == 0) value = tcs3200WhiteCal[0];
        else if (strcmp(colorType, "G") == 0) value = tcs3200WhiteCal[1];
        else if (strcmp(colorType, "B") == 0) value = tcs3200WhiteCal[2];
        server.send(200, "text/plain", String(value));
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS34725 INIT =================
    if (cmd.startsWith("TCS34725_INIT")) {
      if (tcs34725 == nullptr) {
        tcs34725 = new Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);
        if (tcs34725->begin()) {
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "INIT_FAILED");
        }
      } else {
        server.send(200, "text/plain", "OK");
      }
      return;
    }

    // ================= TCS34725 READ =================
    if (cmd.startsWith("TCS34725_READ")) {
      if (tcs34725 != nullptr && tcs34725->begin()) {
        tcs34725->getRawData(&tcs34725Color[0], &tcs34725Color[1], &tcs34725Color[2], &tcs34725Color[3]);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS34725 GET COLOR =================
    if (cmd.startsWith("TCS34725_GET_COLOR")) {
      if (tcs34725 != nullptr) {
        char colorType[2];
        if (sscanf(cmd.c_str(), "TCS34725_GET_COLOR %s", colorType) == 1) {
          int value = 0;
          if (strcmp(colorType, "R") == 0) value = tcs34725Color[0];
          else if (strcmp(colorType, "G") == 0) value = tcs34725Color[1];
          else if (strcmp(colorType, "B") == 0) value = tcs34725Color[2];
          else if (strcmp(colorType, "C") == 0) value = tcs34725Color[3];
          server.send(200, "text/plain", String(value));
        } else {
          server.send(400, "text/plain", "INVALID_FORMAT");
        }
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= TCS34725 IS COLOR =================
    if (cmd.startsWith("TCS34725_IS_COLOR")) {
      char targetColor[10];
      if (sscanf(cmd.c_str(), "TCS34725_IS_COLOR %s", targetColor) == 1 && tcs34725 != nullptr) {
        // Simple color detection logic
        bool isColor = false;
        // Placeholder - implement actual color detection
        server.send(200, "text/plain", isColor ? "1" : "0");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= MATRIX 8x8 INIT (MAX7219 SPI) =================
    if (cmd.startsWith("MATRIX8X8_INIT")) {
      int cs;
      if (sscanf(cmd.c_str(), "MATRIX8X8_INIT %d", &cs) == 1) {
        matrix8x8_cs_pin = cs;
        pinMode(matrix8x8_cs_pin, OUTPUT);
        digitalWrite(matrix8x8_cs_pin, HIGH);
        
        // Initialize SPI
        SPI.begin();
        
        // Initialize MAX7219
        max7219_send(MAX7219_REG_SHUTDOWN, 0x01);    // Turn on
        max7219_send(MAX7219_REG_DECODEMODE, 0x00);  // No decoding
        max7219_send(MAX7219_REG_SCANLIMIT, 0x07);   // Scan all digits
        max7219_send(MAX7219_REG_INTENSITY, 0x07);   // Medium brightness
        max7219_send(MAX7219_REG_DISPLAYTEST, 0x00); // Normal operation
        
        // Clear display
        for (int i = 0; i < 8; i++) {
          matrix8x8_buffer[i] = 0;
          max7219_send(MAX7219_REG_DIGIT0 + i, 0);
        }
        
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= MATRIX 8x8 PIXEL =================
    if (cmd.startsWith("MATRIX8X8_PIXEL")) {
      int x, y, color;
      if (sscanf(cmd.c_str(), "MATRIX8X8_PIXEL %d %d %d", &x, &y, &color) == 3 && matrix8x8_cs_pin >= 0) {
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          if (color != 0) {
            matrix8x8_buffer[y] |= (1 << (7 - x));  // Set bit
          } else {
            matrix8x8_buffer[y] &= ~(1 << (7 - x)); // Clear bit
          }
          max7219_send(MAX7219_REG_DIGIT0 + y, matrix8x8_buffer[y]);
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "OUT_OF_RANGE");
        }
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= MATRIX 8x8 CLEAR =================
    if (cmd.startsWith("MATRIX8X8_CLEAR")) {
      if (matrix8x8_cs_pin >= 0) {
        for (int i = 0; i < 8; i++) {
          matrix8x8_buffer[i] = 0;
          max7219_send(MAX7219_REG_DIGIT0 + i, 0);
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= MATRIX 8x8 FILL =================
    if (cmd.startsWith("MATRIX8X8_FILL")) {
      int color;
      if (sscanf(cmd.c_str(), "MATRIX8X8_FILL %d", &color) == 1 && matrix8x8_cs_pin >= 0) {
        for (int i = 0; i < 8; i++) {
          matrix8x8_buffer[i] = (color != 0) ? 0xFF : 0x00;
          max7219_send(MAX7219_REG_DIGIT0 + i, matrix8x8_buffer[i]);
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= MATRIX 8x8 BRIGHTNESS =================
    if (cmd.startsWith("MATRIX8X8_BRIGHTNESS")) {
      int brt;
      if (sscanf(cmd.c_str(), "MATRIX8X8_BRIGHTNESS %d", &brt) == 1 && matrix8x8_cs_pin >= 0) {
        int intensity = constrain(brt, 0, 15);
        max7219_send(MAX7219_REG_INTENSITY, intensity);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= MATRIX 8x8 PATTERN =================
    if (cmd.startsWith("MATRIX8X8_PATTERN")) {
      char pattern[9];
      if (sscanf(cmd.c_str(), "MATRIX8X8_PATTERN %s", pattern) == 1 && matrix8x8_cs_pin >= 0) {
        for (int i = 0; i < 8 && i < strlen(pattern); i++) {
          uint8_t row = 0;
          for (int j = 0; j < 8; j++) {
            if (pattern[i] & (1 << j)) {
              row |= (1 << (7 - j));
            }
          }
          matrix8x8_buffer[i] = row;
          max7219_send(MAX7219_REG_DIGIT0 + i, row);
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= LED MATRIX INIT (NeoPixel 5x7) =================
    if (cmd.startsWith("LEDMATRIX_INIT")) {
      int pin, num, brt;
      if (sscanf(cmd.c_str(), "LEDMATRIX_INIT %d %d %d", &pin, &num, &brt) == 3) {
        if (ledMatrixStrip != nullptr) { delete ledMatrixStrip; }
        int n = (num > 0 && num <= 256) ? num : LEDMATRIX_LEDS;
        ledMatrixStrip = new Adafruit_NeoPixel(n, pin, NEO_GRB + NEO_KHZ800);
        ledMatrixStrip->begin();
        ledMatrixStrip->setBrightness(constrain(brt, 0, 255));
        ledMatrixStrip->show();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= LED MATRIX PIXEL (5x7) =================
    if (cmd.startsWith("LEDMATRIX_PIXEL")) {
      int x, y, r, g, b;
      if (sscanf(cmd.c_str(), "LEDMATRIX_PIXEL %d %d %d %d %d", &x, &y, &r, &g, &b) == 5 && ledMatrixStrip != nullptr) {
        if (x >= 0 && x < LEDMATRIX_COLS && y >= 0 && y < LEDMATRIX_ROWS) {
          uint32_t color = ledMatrixStrip->Color(r, g, b);
          setMatrixPixel(x, y, color);
          ledMatrixStrip->show();
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "OUT_OF_RANGE");
        }
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= LED MATRIX CLEAR (5x7) =================
    if (cmd.startsWith("LEDMATRIX_CLEAR")) {
      if (ledMatrixStrip != nullptr) {
        for (int i = 0; i < ledMatrixStrip->numPixels(); i++) {
          ledMatrixStrip->setPixelColor(i, 0);
        }
        ledMatrixStrip->show();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= LED MATRIX CUSTOM (35-char pattern 5x7) =================
    if (cmd.startsWith("LEDMATRIX_CUSTOM")) {
      if (ledMatrixStrip == nullptr) {
        server.send(400, "text/plain", "NOT_INITIALIZED");
        return;
      }
      int idx = cmd.indexOf(" ");
      if (idx < 0) { server.send(400, "text/plain", "INVALID_FORMAT"); return; }
      String pattern = cmd.substring(idx + 1);
      pattern.trim();
      int len = pattern.length();
      int nLeds = ledMatrixStrip->numPixels();
      uint32_t onColor = ledMatrixStrip->Color(255, 255, 255);
      uint32_t offColor = ledMatrixStrip->Color(0, 0, 0);
      for (int i = 0; i < nLeds && i < len; i++) {
        uint32_t c = (pattern[i] == '1') ? onColor : offColor;
        ledMatrixStrip->setPixelColor(i, c);
      }
      for (int i = len; i < nLeds; i++) ledMatrixStrip->setPixelColor(i, offColor);
      ledMatrixStrip->show();
      server.send(200, "text/plain", "OK");
      return;
    }

    // ================= LED MATRIX TEXT (5x7) =================
    if (cmd.startsWith("LEDMATRIX_TEXT")) {
      char text[50];
      int r, g, b;
      if (sscanf(cmd.c_str(), "LEDMATRIX_TEXT %s %d %d %d", text, &r, &g, &b) >= 1 && ledMatrixStrip != nullptr) {
        // Simple text display - each character takes 5 columns
        uint32_t color = ledMatrixStrip->Color(r, g, b);
        ledMatrixStrip->clear();
        
        // Predefined 5x7 font patterns for letters
        // This is a simplified implementation
        for (int i = 0; i < strlen(text) && i < 7; i++) {
          char c = toupper(text[i]);
          // Display simple patterns for demonstration
          if (c == 'A') {
            for (int row = 0; row < 7; row++) {
              if (row == 0 || row == 3) {
                for (int col = 0; col < 5; col++) setMatrixPixel(col, row, color);
              } else {
                setMatrixPixel(0, row, color);
                setMatrixPixel(4, row, color);
              }
            }
          }
          // Add more characters as needed
        }
        
        ledMatrixStrip->show();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= LCD I2C (1602) =================
    if (cmd.startsWith("LCD_INIT_I2C")) {
      int no, addr, chip;
      if (sscanf(cmd.c_str(), "LCD_INIT_I2C %d %i %d", &no, &addr, &chip) == 3) {
        if (lcdDoInit(addr, chip)) {
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "INIT_FAILED");
        }
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    if (cmd.startsWith("LCD_CURSOR")) {
      int no, col, row;
      if (sscanf(cmd.c_str(), "LCD_CURSOR %d %d %d", &no, &col, &row) == 3 && lcdEnsureReady()) {
        lcdI2c->setCursor(col, row);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("LCD_PRINT")) {
      if (lcdEnsureReady()) {
        int sp = cmd.indexOf(' ');
        if (sp > 0) {
          String rest = cmd.substring(sp + 1);
          rest.trim();
          int sp2 = rest.indexOf(' ');
          if (sp2 > 0) {
            String text = rest.substring(sp2 + 1);
            text.trim();
            lcdI2c->print(text);
            server.send(200, "text/plain", "OK");
            return;
          }
        }
        server.send(400, "text/plain", "INVALID_FORMAT");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("LCD_CLEAR")) {
      if (lcdEnsureReady()) {
        lcdI2c->clear();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("LCD_BACKLIGHT")) {
      int no, state;
      if (sscanf(cmd.c_str(), "LCD_BACKLIGHT %d %d", &no, &state) == 2 && lcdEnsureReady()) {
        if (state) lcdI2c->backlight();
        else lcdI2c->noBacklight();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("LCD_ACTION")) {
      int no;
      char action[20];
      if (sscanf(cmd.c_str(), "LCD_ACTION %d %s", &no, action) == 2 && lcdEnsureReady()) {
        if (strcmp(action, "home") == 0) lcdI2c->home();
        else if (strcmp(action, "display") == 0) lcdI2c->display();
        else if (strcmp(action, "noDisplay") == 0) lcdI2c->noDisplay();
        else if (strcmp(action, "cursor") == 0) lcdI2c->cursor();
        else if (strcmp(action, "noCursor") == 0) lcdI2c->noCursor();
        else if (strcmp(action, "blink") == 0) lcdI2c->blink();
        else if (strcmp(action, "noBlink") == 0) lcdI2c->noBlink();
        else if (strcmp(action, "scrollLeft") == 0) lcdI2c->scrollDisplayLeft();
        else if (strcmp(action, "scrollRight") == 0) lcdI2c->scrollDisplayRight();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= RGB LED (NeoPixel) =================
    if (cmd.startsWith("RGBLED_INIT")) {
      int pin;
      if (sscanf(cmd.c_str(), "RGBLED_INIT %d", &pin) == 1) {
        if (rgbLedGetStrip(pin) != nullptr) {
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "INIT_FAILED");
        }
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    if (cmd.startsWith("RGBLED_SET")) {
      int pin, r, g, b;
      if (sscanf(cmd.c_str(), "RGBLED_SET %d %d %d %d", &pin, &r, &g, &b) == 4) {
        Adafruit_NeoPixel* px = rgbLedGetStrip(pin);
        if (px != nullptr) {
          r = constrain(r, 0, 255);
          g = constrain(g, 0, 255);
          b = constrain(b, 0, 255);
          px->setPixelColor(0, px->Color(r, g, b));
          px->show();
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "NOT_INITIALIZED");
        }
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    if (cmd.startsWith("RGBLED_OFF")) {
      int pin;
      if (sscanf(cmd.c_str(), "RGBLED_OFF %d", &pin) == 1) {
        Adafruit_NeoPixel* px = rgbLedGetStrip(pin);
        if (px != nullptr) {
          px->setPixelColor(0, 0);
          px->show();
          server.send(200, "text/plain", "OK");
        } else {
          server.send(400, "text/plain", "NOT_INITIALIZED");
        }
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= ROTARY ENCODER =================
    if (cmd.startsWith("ENCODER_INIT")) {
      int clk, dt, sw;
      if (sscanf(cmd.c_str(), "ENCODER_INIT %d %d %d", &clk, &dt, &sw) == 3) {
        encInitPins(clk, dt, sw);
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    if (cmd.startsWith("ENCODER_GET_COUNT")) {
      if (encInitialized) {
        server.send(200, "text/plain", String(encGetCountForApp()));
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("ENCODER_RESET")) {
      if (encInitialized) {
        encReset();
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("ENCODER_GET_DIRECTION")) {
      if (encInitialized) {
        server.send(200, "text/plain", encGetDirectionStr());
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    if (cmd.startsWith("ENCODER_GET_SPEED")) {
      if (encInitialized) {
        server.send(200, "text/plain", String(encGetSpeed()));
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= VOLTAGE / CURRENT (alias READ_ANALOG) =================
    if (cmd.startsWith("VOLTAGE_READ")) {
      int pin;
      if (sscanf(cmd.c_str(), "VOLTAGE_READ %d", &pin) == 1) {
        server.send(200, "text/plain", String(analogRead(pin)));
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    if (cmd.startsWith("CURRENT_READ")) {
      int pin;
      if (sscanf(cmd.c_str(), "CURRENT_READ %d", &pin) == 1) {
        server.send(200, "text/plain", String(analogRead(pin)));
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= STEPPER INIT =================
    if (cmd.startsWith("STEPPER_INIT")) {
      int dirPin, stepPin, steps;
      if (sscanf(cmd.c_str(), "STEPPER_INIT %d %d %d", &dirPin, &stepPin, &steps) == 3) {
        stepperDirPin = dirPin;
        stepperStepPin = stepPin;
        stepperStepsPerRev = (steps > 0) ? steps : 200;
        pinMode(stepperDirPin, OUTPUT);
        pinMode(stepperStepPin, OUTPUT);
        digitalWrite(stepperDirPin, LOW);
        digitalWrite(stepperStepPin, LOW);
        stepperInitialized = true;
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "INVALID_FORMAT");
      }
      return;
    }

    // ================= STEPPER ROTATE =================
    if (cmd.startsWith("STEPPER_ROTATE")) {
      char dirStr[10];
      int speedUs, steps;
      if (sscanf(cmd.c_str(), "STEPPER_ROTATE %s %d %d", dirStr, &speedUs, &steps) == 3 && stepperInitialized) {
        int dirVal = (strcmp(dirStr, "HIGH") == 0) ? HIGH : LOW;
        digitalWrite(stepperDirPin, dirVal);
        if (speedUs <= 0) speedUs = 1000;
        for (int i = 0; i < steps; i++) {
          digitalWrite(stepperStepPin, HIGH);
          delayMicroseconds(speedUs);
          digitalWrite(stepperStepPin, LOW);
          delayMicroseconds(speedUs);
        }
        server.send(200, "text/plain", "OK");
      } else {
        server.send(400, "text/plain", "NOT_INITIALIZED");
      }
      return;
    }

    // ================= UNKNOWN COMMAND =================
    server.send(400, "text/plain", "UNKNOWN");
  });

  server.begin();
  Serial.println("🌍 HTTP Server Started");
}
`;

    // ================= LOOP =================
    Blockly.Arduino.loops_['wifi_loop'] = `
server.handleClient();`;

    return '';
  };

  return Blockly;
}

exports = addGenerator;