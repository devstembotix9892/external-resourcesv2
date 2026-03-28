// function addGenerator(Blockly) {
//   Blockly.Arduino.wifi_connect = function (block) {
//     const ssid =
//       Blockly.Arduino.valueToCode(block, 'SSID', Blockly.Arduino.ORDER_ATOMIC) || '""';
//     const password =
//       Blockly.Arduino.valueToCode(block, 'PASSWORD', Blockly.Arduino.ORDER_ATOMIC) || '""';

//     // ================= INCLUDES =================
//     Blockly.Arduino.includes_['wifi'] = `
// #include <WiFi.h>
// #include <WebServer.h>
// #include <ESP32Servo.h>`;

//     // ================= DEFINITIONS =================
//     Blockly.Arduino.definitions_['wifi_credentials'] = `
// const char* ssid = ${ssid};
// const char* password = ${password};
// WebServer server(80);
// Servo __blockly_servo__;`;

//     // ================= SETUP =================
//     Blockly.Arduino.setups_['wifi_setup'] = `
// Serial.begin(115200);
// initializeWiFi();`;

//     // ================= WIFI FUNCTION =================
//     Blockly.Arduino.definitions_['initialize_wifi_function'] = `
// void initializeWiFi() {
//   Serial.println("Connecting to WiFi...");
//   WiFi.begin(ssid, password);

//   unsigned long startAttemptTime = millis();
//   while (WiFi.status() != WL_CONNECTED) {
//     if (millis() - startAttemptTime >= 10000) {
//       Serial.println("❌ WiFi Connection Failed!");
//       return;
//     }
//     delay(500);
//     Serial.print(".");
//   }

//   Serial.println("");
//   Serial.println("✅ Connected to WiFi");
//   Serial.println(WiFi.localIP());

//   server.on("/control", HTTP_POST, []() {
//     server.sendHeader("Access-Control-Allow-Origin", "*");

//     if (!server.hasArg("plain")) {
//       server.send(400, "text/plain", "No data");
//       return;
//     }

//     String cmd = server.arg("plain");
//     cmd.trim();
//     Serial.println(cmd);

//     // ================= SET DIGITAL OUTPUT (UPDATED) =================
//     if (cmd.startsWith("SET_DIGITAL_OUTPUT")) {
//       int pin[4];
//       char state[4][10];

//       int count = sscanf(
//         cmd.c_str(),
//         "SET_DIGITAL_OUTPUT %d %s %d %s %d %s %d %s",
//         &pin[0], state[0],
//         &pin[1], state[1],
//         &pin[2], state[2],
//         &pin[3], state[3]
//       );

//       for (int i = 0; i < count / 2; i++) {
//         pinMode(pin[i], OUTPUT);
//         digitalWrite(pin[i], strcmp(state[i], "HIGH") == 0 ? HIGH : LOW);
//       }

//       delay(50);
//       server.send(200, "text/plain", "OK");
//     }

//     // ================= SET PIN MODE =================
//     else if (cmd.startsWith("SET_PIN_MODE")) {
//       int pin;
//       char mode[10];
//       sscanf(cmd.c_str(), "SET_PIN_MODE %d %s", &pin, mode);
//       pinMode(pin, strcmp(mode, "INPUT") == 0 ? INPUT : OUTPUT);
//       server.send(200, "text/plain", "OK");
//     }

//     // ================= DIGITAL WRITE =================
//     else if (cmd.startsWith("DIGITAL_WRITE")) {
//       int pin, val;
//       sscanf(cmd.c_str(), "DIGITAL_WRITE %d %d", &pin, &val);
//       pinMode(pin, OUTPUT);
//       digitalWrite(pin, val);
//       server.send(200, "text/plain", "OK");
//     }

//     // ================= DIGITAL READ =================
//     else if (cmd.startsWith("DIGITAL_READ")) {
//       int pin;
//       sscanf(cmd.c_str(), "DIGITAL_READ %d", &pin);
//       pinMode(pin, INPUT);
//       server.send(200, "text/plain", String(digitalRead(pin)));
//     }

//     // ================= ANALOG READ =================
//     else if (cmd.startsWith("READ_ANALOG")) {
//       int pin;
//       sscanf(cmd.c_str(), "READ_ANALOG %d", &pin);
//       server.send(200, "text/plain", String(analogRead(pin)));
//     }

//     // ================= PWM OUTPUT =================
//     else if (cmd.startsWith("SET_PWM_OUTPUT")) {
//       int pin, value;
//       sscanf(cmd.c_str(), "SET_PWM_OUTPUT %d %d", &pin, &value);

//       int channel = pin % 16;     // ESP32 supports 16 channels
//       ledcSetup(channel, 5000, 8);
//       ledcAttachPin(pin, channel);
//       ledcWrite(channel, value);

//       server.send(200, "text/plain", "OK");
//     }


//     // ================= SERVO OUTPUT =================
//     else if (cmd.startsWith("SET_SERVO_OUTPUT")) {
//       int pin, angle;
//       sscanf(cmd.c_str(), "SET_SERVO_OUTPUT %d %d", &pin, &angle);
//       __blockly_servo__.attach(pin);
//       __blockly_servo__.write(angle);
//       server.send(200, "text/plain", "OK");
//     }

//     else {
//       server.send(400, "text/plain", "UNKNOWN");
//     }
//   });

//   server.begin();
//   Serial.println("🌍 HTTP Server Started");
// }
// `;

//     // ================= LOOP =================
//     Blockly.Arduino.loops_['wifi_loop'] = `
// server.handleClient();`;

//     return '';
//   };

//   return Blockly;
// }

// exports = addGenerator;
/**
 * WiFi Block Generator - Full ESP32 HTTP control
 * Matches esp-peripheral.js features: DHT, Ultrasonic, TM1637, LED Matrix, Stepper, Serial, etc.
 * Use with Blockly Arduino code generation; ESP32 runs this code and accepts POST /control with command body.
 */
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
#include <DHT.h>     // ✅ CORRECT
#include <TM1637Display.h>
#include <Adafruit_NeoPixel.h>`;

    // ================= DEFINITIONS =================
    Blockly.Arduino.definitions_['wifi_credentials'] = `
const char* ssid = ${ssid};
const char* password = ${password};
WebServer server(80);
Servo __blockly_servo__;

// DHT: support 1 sensor (expand to array if needed)
DHT* __blockly_dht__ = nullptr;
int __blockly_dht_pin__ = -1;
int __blockly_dht_model__ = DHT22;

// Ultrasonic: support 1 sensor (trig, echo)
int __blockly_ultra_trig__ = -1;
int __blockly_ultra_echo__ = -1;


// TM1637 4-digit display (dio, clk)
TM1637Display* __blockly_tm1637__ = nullptr;
int __blockly_tm1637_dio__ = -1;
int __blockly_tm1637_clk__ = -1;

// LED Matrix WS2812 (NeoPixel)
Adafruit_NeoPixel* __blockly_ledmatrix__ = nullptr;
int __blockly_ledmatrix_pin__ = -1;
int __blockly_ledmatrix_num__ = 25;

// Stepper
int __blockly_stepper_dir__ = -1;
int __blockly_stepper_step__ = -1;
int __blockly_stepper_steps_per_rev__ = 200;`;

    // ================= SETUP =================
    Blockly.Arduino.setups_['wifi_setup'] = `
Serial.begin(115200);
initializeWiFi();`;

    // ================= WIFI + ALL HANDLERS =================
    Blockly.Arduino.definitions_['initialize_wifi_function'] = `
// ----- Ultrasonic helper (no library) -----
float readUltrasonicCm(int trigPin, int echoPin) {
  if (trigPin < 0 || echoPin < 0) return 0;
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long d = pulseIn(echoPin, HIGH, 30000);
  if (d <= 0) return 0;
  return d / 58.0;
}

void initializeWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startAttemptTime >= 10000) {
      Serial.println("WiFi Connection Failed!");
      return;
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());

  server.on("/control", HTTP_POST, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");

    if (!server.hasArg("plain")) {
      server.send(400, "text/plain", "No data");
      return;
    }

    String cmd = server.arg("plain");
    cmd.trim();
    Serial.println(cmd);

    // ================= SET DIGITAL OUTPUT =================
    if (cmd.startsWith("SET_DIGITAL_OUTPUT")) {
      int pin[4];
      char state[4][10];
      int count = sscanf(cmd.c_str(), "SET_DIGITAL_OUTPUT %d %s %d %s %d %s %d %s",
        &pin[0], state[0], &pin[1], state[1], &pin[2], state[2], &pin[3], state[3]);
      for (int i = 0; i < count / 2; i++) {
        pinMode(pin[i], OUTPUT);
        digitalWrite(pin[i], strcmp(state[i], "HIGH") == 0 ? HIGH : LOW);
      }
      delay(50);
      server.send(200, "text/plain", "OK");
    }

    // ================= SET PIN MODE =================
    else if (cmd.startsWith("SET_PIN_MODE")) {
      int pin;
      char mode[10];
      sscanf(cmd.c_str(), "SET_PIN_MODE %d %s", &pin, mode);
      if (strcmp(mode, "INPUT_PULLUP") == 0)
        pinMode(pin, INPUT_PULLUP);
      else if (strcmp(mode, "INPUT") == 0)
        pinMode(pin, INPUT);
      else
        pinMode(pin, OUTPUT);
      server.send(200, "text/plain", "OK");
    }

    // ================= DIGITAL WRITE =================
    else if (cmd.startsWith("DIGITAL_WRITE")) {
      int pin, val;
      sscanf(cmd.c_str(), "DIGITAL_WRITE %d %d", &pin, &val);
      pinMode(pin, OUTPUT);
      digitalWrite(pin, val);
      server.send(200, "text/plain", "OK");
    }

    // ================= DIGITAL READ =================
    else if (cmd.startsWith("DIGITAL_READ")) {
      int pin;
      sscanf(cmd.c_str(), "DIGITAL_READ %d", &pin);
      pinMode(pin, INPUT);
      server.send(200, "text/plain", String(digitalRead(pin)));
    }

    // ================= ANALOG READ =================
    else if (cmd.startsWith("READ_ANALOG")) {
      int pin;
      sscanf(cmd.c_str(), "READ_ANALOG %d", &pin);
      server.send(200, "text/plain", String(analogRead(pin)));
    }

    // ================= PWM OUTPUT =================
   else if (cmd.startsWith("SET_PWM_OUTPUT")) {
    int pin, value;
    sscanf(cmd.c_str(), "SET_PWM_OUTPUT %d %d", &pin, &value);

    // NEW API (ESP32 Core 3.x)
    ledcAttach(pin, 5000, 8);   // pin, frequency, resolution
    ledcWrite(pin, value);      // NOTE: pin use thay che, channel nahi

    server.send(200, "text/plain", "OK");
}

    // ================= SERVO OUTPUT =================
    else if (cmd.startsWith("SET_SERVO_OUTPUT")) {
      int pin, angle;
      sscanf(cmd.c_str(), "SET_SERVO_OUTPUT %d %d", &pin, &angle);
      angle = (angle < 0) ? 0 : (angle > 180) ? 180 : angle;
      __blockly_servo__.attach(pin);
      __blockly_servo__.write(angle);
      server.send(200, "text/plain", "OK");
    }

    // ================= DHT INIT =================
     // ---------- DHT INIT ----------
    if (cmd.startsWith("DHT_INIT")) {
      int no, pin, model;
      sscanf(cmd.c_str(), "DHT_INIT %d %d %d", &no, &pin, &model);

      if (__blockly_dht__ != nullptr) {
        delete __blockly_dht__;
        __blockly_dht__ = nullptr;
      }

      __blockly_dht_model__ =
        (model == 11) ? DHT11 :
        (model == 21) ? DHT21 : DHT22;

      __blockly_dht_pin__ = pin;
      __blockly_dht__ = new DHT(pin, __blockly_dht_model__);
      __blockly_dht__->begin();

      server.send(200, "text/plain", "OK");
    }

    // ---------- DHT HUM ----------
    else if (cmd.startsWith("DHT_READ_HUM")) {
      if (!__blockly_dht__) { server.send(200, "text/plain", "0"); return; }
      float h = __blockly_dht__->readHumidity();
      if (isnan(h)) h = 0;
      server.send(200, "text/plain", String(h, 2));
    }

    // ---------- DHT TEMP ----------
    else if (cmd.startsWith("DHT_READ_TEMP")) {
      int f = 0;
      sscanf(cmd.c_str(), "DHT_READ_TEMP %d", &f);
      if (!__blockly_dht__) { server.send(200, "text/plain", "0"); return; }
      float t = __blockly_dht__->readTemperature();
      if (isnan(t)) t = 0;
      if (f) t = t * 1.8 + 32;
      server.send(200, "text/plain", String(t, 2));
    }

    // ================= ULTRASONIC INIT =================
    else if (cmd.startsWith("ULTRASONIC_INIT")) {
      int no, trig, echo;
      sscanf(cmd.c_str(), "ULTRASONIC_INIT %d %d %d", &no, &trig, &echo);
      __blockly_ultra_trig__ = trig;
      __blockly_ultra_echo__ = echo;
      server.send(200, "text/plain", "OK");
    }

    // ================= ULTRASONIC READ =================
    else if (cmd.startsWith("ULTRASONIC_READ")) {
      int isInch = 0;
      sscanf(cmd.c_str(), "ULTRASONIC_READ %d", &isInch);
      float cm = readUltrasonicCm(__blockly_ultra_trig__, __blockly_ultra_echo__);
      if (isInch) cm = cm / 2.54f;
      server.send(200, "text/plain", String(cm, 2));
    }

    // ================= TM1637 INIT =================
    else if (cmd.startsWith("TM1637_INIT")) {
      int dio, clk;
      sscanf(cmd.c_str(), "TM1637_INIT %d %d", &dio, &clk);
      if (__blockly_tm1637__ != nullptr) { delete __blockly_tm1637__; __blockly_tm1637__ = nullptr; }
      __blockly_tm1637_dio__ = dio;
      __blockly_tm1637_clk__ = clk;
      __blockly_tm1637__ = new TM1637Display(dio, clk);
      __blockly_tm1637__->setBrightness(0x0f);
      __blockly_tm1637__->clear();
      server.send(200, "text/plain", "OK");
    }

    // ================= TM1637 BRIGHTNESS =================
    else if (cmd.startsWith("TM1637_BRIGHTNESS")) {
      int b;
      sscanf(cmd.c_str(), "TM1637_BRIGHTNESS %d", &b);
      if (__blockly_tm1637__ != nullptr) {
        b = (b < 0) ? 0 : (b > 7) ? 7 : b;
        __blockly_tm1637__->setBrightness(b);
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= TM1637 DISPLAY NUMBER =================
    else if (cmd.startsWith("TM1637_DISPLAY_NUM")) {
      int num;
      sscanf(cmd.c_str(), "TM1637_DISPLAY_NUM %d", &num);
      if (__blockly_tm1637__ != nullptr)
        __blockly_tm1637__->showNumberDec(num, true);
      server.send(200, "text/plain", "OK");
    }

    // ================= TM1637 DISPLAY STRING =================
    else if (cmd.startsWith("TM1637_DISPLAY_STR ")) {
      String s = cmd.substring(19);
      s.trim();
      if (__blockly_tm1637__ != nullptr && s.length() > 0) {
        for (unsigned int i = 0; i < 4 && i < s.length(); i++)
          __blockly_tm1637__->setSegments((uint8_t*)s.c_str(), 1, i);
        __blockly_tm1637__->showNumberDec(s.toInt(), false, 4, 0);
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= TM1637 DISPLAY POSITION =================
    else if (cmd.startsWith("TM1637_DISPLAY_POS")) {
      int pos, val;
      sscanf(cmd.c_str(), "TM1637_DISPLAY_POS %d %d", &pos, &val);
      if (__blockly_tm1637__ != nullptr && pos >= 0 && pos <= 3) {
        uint8_t seg = __blockly_tm1637__->encodeDigit(val % 10);
        __blockly_tm1637__->setSegments(&seg, 1, 3 - pos);
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= TM1637 SET POINT (colon) =================
      // ---------- TM1637 INIT ----------
    else if (cmd.startsWith("TM1637_INIT")) {
      int dio, clk;
      sscanf(cmd.c_str(), "TM1637_INIT %d %d", &dio, &clk);
      if (__blockly_tm1637__) delete __blockly_tm1637__;
      __blockly_tm1637__ = new TM1637Display(clk, dio);
      __blockly_tm1637__->setBrightness(7);
      __blockly_tm1637__->clear();
      server.send(200, "text/plain", "OK");
    }

    // ---------- TM1637 NUMBER ----------
    else if (cmd.startsWith("TM1637_DISPLAY_NUM")) {
      int n;
      sscanf(cmd.c_str(), "TM1637_DISPLAY_NUM %d", &n);
      if (__blockly_tm1637__)
        __blockly_tm1637__->showNumberDec(n, true);
      server.send(200, "text/plain", "OK");
    }

    // ---------- TM1637 CLEAR ----------
    else if (cmd.startsWith("TM1637_CLEAR")) {
      if (__blockly_tm1637__) __blockly_tm1637__->clear();
      server.send(200, "text/plain", "OK");
    }

    // ================= LED MATRIX (NeoPixel) INIT =================
    else if (cmd.startsWith("LEDMATRIX_INIT")) {
      int pin, num, bright;
      sscanf(cmd.c_str(), "LEDMATRIX_INIT %d %d %d", &pin, &num, &bright);
      if (__blockly_ledmatrix__ != nullptr) { delete __blockly_ledmatrix__; __blockly_ledmatrix__ = nullptr; }
      __blockly_ledmatrix_pin__ = pin;
      __blockly_ledmatrix_num__ = (num > 0) ? num : 25;
      __blockly_ledmatrix__ = new Adafruit_NeoPixel(__blockly_ledmatrix_num__, pin, NEO_GRB + NEO_KHZ800);
      __blockly_ledmatrix__->begin();
      __blockly_ledmatrix__->setBrightness((bright >= 0 && bright <= 255) ? bright : 50);
      __blockly_ledmatrix__->show();
      server.send(200, "text/plain", "OK");
    }

    // ================= LED MATRIX DIGIT (simple 5x5 style on first 25 LEDs) =================
    else if (cmd.startsWith("LEDMATRIX_DIGIT")) {
      int d;
      sscanf(cmd.c_str(), "LEDMATRIX_DIGIT %d", &d);
      d = d % 10;
      if (__blockly_ledmatrix__ != nullptr) {
        __blockly_ledmatrix__->clear();
        // Minimal digit patterns (5 columns, 5 rows = 25 LEDs)
        const uint32_t digits[10][5] = {
          { 0x1F, 0x11, 0x11, 0x11, 0x1F }, // 0
          { 0x04, 0x0C, 0x04, 0x04, 0x0E }, // 1
          { 0x1F, 0x01, 0x1F, 0x10, 0x1F }, // 2
          { 0x1F, 0x01, 0x1F, 0x01, 0x1F }, // 3
          { 0x11, 0x11, 0x1F, 0x01, 0x01 }, // 4
          { 0x1F, 0x10, 0x1F, 0x01, 0x1F }, // 5
          { 0x1F, 0x10, 0x1F, 0x11, 0x1F }, // 6
          { 0x1F, 0x01, 0x02, 0x04, 0x04 }, // 7
          { 0x1F, 0x11, 0x1F, 0x11, 0x1F }, // 8
          { 0x1F, 0x11, 0x1F, 0x01, 0x1F }  // 9
        };
        for (int col = 0; col < 5; col++)
          for (int row = 0; row < 5; row++)
            if (digits[d][col] & (1 << row))
              __blockly_ledmatrix__->setPixelColor(col + row * 5, __blockly_ledmatrix__->Color(50, 50, 50));
        __blockly_ledmatrix__->show();
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= LED MATRIX LETTER =================
    else if (cmd.startsWith("LEDMATRIX_LETTER")) {
      char c;
      sscanf(cmd.c_str(), "LEDMATRIX_LETTER %c", &c);
      if (__blockly_ledmatrix__ != nullptr) {
        __blockly_ledmatrix__->clear();
        int idx = (c >= 'A' && c <= 'Z') ? (c - 'A') : (c >= 'a' && c <= 'z') ? (c - 'a') : 0;
        // Simple A-Z 5x5 (first letter A as placeholder for any)
        uint8_t pat[5] = { 0x1F, 0x11, 0x1F, 0x11, 0x11 };
        for (int col = 0; col < 5; col++)
          for (int row = 0; row < 5; row++)
            if (pat[col] & (1 << row))
              __blockly_ledmatrix__->setPixelColor(col + row * 5, __blockly_ledmatrix__->Color(50, 50, 50));
        __blockly_ledmatrix__->show();
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= LED MATRIX SYMBOL (id 0-11) =================
    else if (cmd.startsWith("LEDMATRIX_SYMBOL")) {
      int id;
      sscanf(cmd.c_str(), "LEDMATRIX_SYMBOL %d", &id);
      if (__blockly_ledmatrix__ != nullptr) {
        __blockly_ledmatrix__->clear();
        id = (id < 0 || id > 11) ? 0 : id;
        // Heart-like pattern for id 0
        uint8_t heart[5] = { 0x0A, 0x1F, 0x1F, 0x0E, 0x04 };
        for (int col = 0; col < 5; col++)
          for (int row = 0; row < 5; row++)
            if (heart[col] & (1 << row))
              __blockly_ledmatrix__->setPixelColor(col + row * 5, __blockly_ledmatrix__->Color(80, 0, 0));
        __blockly_ledmatrix__->show();
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= LED MATRIX CLEAR =================
    else if (cmd.startsWith("LEDMATRIX_CLEAR")) {
      if (__blockly_ledmatrix__ != nullptr) {
        __blockly_ledmatrix__->clear();
        __blockly_ledmatrix__->show();
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= STEPPER INIT =================
    else if (cmd.startsWith("STEPPER_INIT")) {
      int dirPin, stepPin, steps;
      sscanf(cmd.c_str(), "STEPPER_INIT %d %d %d", &dirPin, &stepPin, &steps);
      __blockly_stepper_dir__ = dirPin;
      __blockly_stepper_step__ = stepPin;
      __blockly_stepper_steps_per_rev__ = (steps > 0) ? steps : 200;
      pinMode(__blockly_stepper_dir__, OUTPUT);
      pinMode(__blockly_stepper_step__, OUTPUT);
      server.send(200, "text/plain", "OK");
    }

    // ================= STEPPER ROTATE =================
    else if (cmd.startsWith("STEPPER_ROTATE")) {
      int dir, speedUs, steps;
      sscanf(cmd.c_str(), "STEPPER_ROTATE %d %d %d", &dir, &speedUs, &steps);
      if (__blockly_stepper_dir__ < 0 || __blockly_stepper_step__ < 0) { server.send(200, "text/plain", "OK"); return; }
      if (speedUs <= 0) speedUs = 1000;
      digitalWrite(__blockly_stepper_dir__, dir ? HIGH : LOW);
      for (int i = 0; i < steps; i++) {
        digitalWrite(__blockly_stepper_step__, HIGH);
        delayMicroseconds(speedUs);
        digitalWrite(__blockly_stepper_step__, LOW);
        delayMicroseconds(speedUs);
      }
      server.send(200, "text/plain", "OK");
    }

    // ================= SERIAL BEGIN =================
    else if (cmd.startsWith("SERIAL_BEGIN")) {
      int port, baud;
      sscanf(cmd.c_str(), "SERIAL_BEGIN %d %d", &port, &baud);
      if (port == 0) { Serial.begin(baud); }
      else if (port == 1) { Serial1.begin(baud); }
      else if (port == 2) { Serial2.begin(baud); }
      server.send(200, "text/plain", "OK");
    }

    // ================= SERIAL PRINT =================
    else if (cmd.startsWith("SERIAL_PRINT ")) {
      int port;
      String rest = cmd.substring(12);
      int sep = rest.indexOf(" ");
      if (sep < 0) { server.send(400, "text/plain", "Bad SERIAL_PRINT"); return; }
      port = rest.substring(0, sep).toInt();
      String text = rest.substring(sep + 1);
      if (text.endsWith("\\\\n")) { text.remove(text.length() - 2); text += "\\\\n"; }
      else if (rest.indexOf(" warp") >= 0) { text = rest.substring(sep + 1, rest.indexOf(" warp")); text += "\\\\n"; }
      if (port == 0) Serial.print(text);
      else if (port == 1) Serial1.print(text);
      else if (port == 2) Serial2.print(text);
      server.send(200, "text/plain", "OK");
    }

    // ================= SERIAL AVAILABLE =================
    else if (cmd.startsWith("SERIAL_AVAILABLE")) {
      int port;
      sscanf(cmd.c_str(), "SERIAL_AVAILABLE %d", &port);
      int n = 0;
      if (port == 0) n = Serial.available();
      else if (port == 1) n = Serial1.available();
      else if (port == 2) n = Serial2.available();
      server.send(200, "text/plain", String(n));
    }

    // ================= SERIAL READ BYTE =================
    else if (cmd.startsWith("SERIAL_READ_BYTE")) {
      int port;
      sscanf(cmd.c_str(), "SERIAL_READ_BYTE %d", &port);
      int b = -1;
      if (port == 0 && Serial.available()) b = Serial.read();
      else if (port == 1 && Serial1.available()) b = Serial1.read();
      else if (port == 2 && Serial2.available()) b = Serial2.read();
      server.send(200, "text/plain", String(b));
    }

    // ================= SERIAL READ STRING =================
    else if (cmd.startsWith("SERIAL_READ_STR")) {
      int port;
      sscanf(cmd.c_str(), "SERIAL_READ_STR %d", &port);
      String s = "";
      if (port == 0) while (Serial.available()) s += (char)Serial.read();
      else if (port == 1) while (Serial1.available()) s += (char)Serial1.read();
      else if (port == 2) while (Serial2.available()) s += (char)Serial2.read();
      server.send(200, "text/plain", s);
    }

    else {
      server.send(400, "text/plain", "UNKNOWN");
    }
  });

  server.begin();
  Serial.println("HTTP Server Started");
}
`;

    // ================= LOOP =================
    Blockly.Arduino.loops_['wifi_loop'] = `
server.handleClient();`;

    return '';
  };

  return Blockly;
}

module.exports = addGenerator;
