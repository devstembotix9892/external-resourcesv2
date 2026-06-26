function addGenerator(Blockly) {

    const motorPinChannels = {
        MOTOR_FL1: 0,
        MOTOR_FL2: 1,
        MOTOR_FR1: 2,
        MOTOR_FR2: 3,
        MOTOR_BL1: 4,
        MOTOR_BL2: 5,
        MOTOR_BR1: 6,
        MOTOR_BR2: 7
    };

    const motorGroups = {
        M1: ['MOTOR_FL1', 'MOTOR_FL2'],
        M2: ['MOTOR_FR1', 'MOTOR_FR2'],
        M3: ['MOTOR_BL1', 'MOTOR_BL2'],
        M4: ['MOTOR_BR1', 'MOTOR_BR2']
    };

    function motorAttachCode (pinA, pinB) {
        const ch0 = motorPinChannels[pinA];
        const ch1 = motorPinChannels[pinB];
        return `
#if defined(ESP_ARDUINO_VERSION_MAJOR) && (ESP_ARDUINO_VERSION_MAJOR >= 3)
ledcAttach(${pinA}, 5000, 8);
ledcAttach(${pinB}, 5000, 8);
#else
ledcSetup(${ch0}, 5000, 8);
ledcAttachPin(${pinA}, ${ch0});
ledcSetup(${ch1}, 5000, 8);
ledcAttachPin(${pinB}, ${ch1});
#endif
`;
    }

    function ensureRcCarBase (Blockly) {
        Blockly.Arduino.includes_['ble'] = `#include "BluetoothSerial.h"`;
        Blockly.Arduino.includes_['servo'] = `#include <ESP32Servo.h>`;

        Blockly.Arduino.definitions_['vars'] = `
BluetoothSerial SerialBT;
char command;
int motorSpeed = 200;

Servo servo_5;
Servo servo_14;
Servo servo_32;
Servo servo_33;

int servoPin = 14;
int servoAngle = 50;
`;

        Blockly.Arduino.setups_['servo_setup'] = `
servo_5.attach(5);
servo_14.attach(14);
servo_32.attach(32);
servo_33.attach(33);
`;

        Blockly.Arduino.definitions_['channels'] = `
// MOTOR PINS
#define MOTOR_FL1 27
#define MOTOR_FL2 19
#define MOTOR_FR1 15
#define MOTOR_FR2 23
#define MOTOR_BL1 12
#define MOTOR_BL2 18
#define MOTOR_BR1 13
#define MOTOR_BR2 2

#if defined(ARDUINO_ARCH_ESP32) && !(defined(ESP_ARDUINO_VERSION_MAJOR) && (ESP_ARDUINO_VERSION_MAJOR >= 3))
#define RCCAR_CH_FL1 0
#define RCCAR_CH_FL2 1
#define RCCAR_CH_FR1 2
#define RCCAR_CH_FR2 3
#define RCCAR_CH_BL1 4
#define RCCAR_CH_BL2 5
#define RCCAR_CH_BR1 6
#define RCCAR_CH_BR2 7
static void rccarLedcWrite(uint8_t pin, uint32_t val) {
  if (pin == MOTOR_FL1) ledcWrite(RCCAR_CH_FL1, val);
  else if (pin == MOTOR_FL2) ledcWrite(RCCAR_CH_FL2, val);
  else if (pin == MOTOR_FR1) ledcWrite(RCCAR_CH_FR1, val);
  else if (pin == MOTOR_FR2) ledcWrite(RCCAR_CH_FR2, val);
  else if (pin == MOTOR_BL1) ledcWrite(RCCAR_CH_BL1, val);
  else if (pin == MOTOR_BL2) ledcWrite(RCCAR_CH_BL2, val);
  else if (pin == MOTOR_BR1) ledcWrite(RCCAR_CH_BR1, val);
  else if (pin == MOTOR_BR2) ledcWrite(RCCAR_CH_BR2, val);
}
#define RCCAR_LEDC_WRITE(p, v) rccarLedcWrite((p), (v))
#else
#define RCCAR_LEDC_WRITE(p, v) ledcWrite((p), (v))
#endif
`;

        Blockly.Arduino.definitions_['robot_functions'] = `

void setServoByPin(int pin, int angle){

  switch(pin){

    case 5: servo_5.write(angle); break;
    case 14: servo_14.write(angle); break;
    case 32: servo_32.write(angle); break;
    case 33: servo_33.write(angle); break;

  }
}

void moveForward() {
  RCCAR_LEDC_WRITE(MOTOR_FL1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_FL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_FR1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_FR2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BL1, 0); RCCAR_LEDC_WRITE(MOTOR_BL2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_BR1, 0); RCCAR_LEDC_WRITE(MOTOR_BR2, motorSpeed);
}

void moveBackward() {
  RCCAR_LEDC_WRITE(MOTOR_FL1, 0); RCCAR_LEDC_WRITE(MOTOR_FL2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_FR1, 0); RCCAR_LEDC_WRITE(MOTOR_FR2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_BL1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_BL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BR1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_BR2, 0);
}

void moveLeft() {
  RCCAR_LEDC_WRITE(MOTOR_FL1, 0); RCCAR_LEDC_WRITE(MOTOR_FL2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_FR1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_FR2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BL1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_BL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BR1, 0); RCCAR_LEDC_WRITE(MOTOR_BR2, motorSpeed);
}

void moveRight() {
  RCCAR_LEDC_WRITE(MOTOR_FL1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_FL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_FR1, 0); RCCAR_LEDC_WRITE(MOTOR_FR2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_BL1, 0); RCCAR_LEDC_WRITE(MOTOR_BL2, motorSpeed);
  RCCAR_LEDC_WRITE(MOTOR_BR1, motorSpeed); RCCAR_LEDC_WRITE(MOTOR_BR2, 0);
}

void stopMotors() {
  RCCAR_LEDC_WRITE(MOTOR_FL1, 0); RCCAR_LEDC_WRITE(MOTOR_FL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_FR1, 0); RCCAR_LEDC_WRITE(MOTOR_FR2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BL1, 0); RCCAR_LEDC_WRITE(MOTOR_BL2, 0);
  RCCAR_LEDC_WRITE(MOTOR_BR1, 0); RCCAR_LEDC_WRITE(MOTOR_BR2, 0);
}

void handleCommand(char cmd) {
  switch (cmd) {
    case 'u': moveForward(); break;
    case 'd': moveBackward(); break;
    case 'l': moveLeft(); break;
    case 'r': moveRight(); break;
    case 'n': stopMotors(); break;
    case 'f': setServoByPin(servoPin, servoAngle); break;
    case 'b': setServoByPin(servoPin, 0); break;
  }
}
`;

        Blockly.Arduino.loops_['main_loop'] = `
if (SerialBT.available()) {
  command = SerialBT.read();
  handleCommand(command);
}
`;
    }

    function ensureBluetoothStart (Blockly, name) {
        Blockly.Arduino.setups_['bt_start'] = `
Serial.begin(9600);
SerialBT.begin(${name});
Serial.println("Bluetooth Device Ready");
`;
    }

    // =========================
    // 1. BLUETOOTH CONNECT
    // =========================
    Blockly.Arduino.bt_connect = function () {
        ensureRcCarBase(Blockly);
        if (!Blockly.Arduino.setups_['bt_start']) {
            ensureBluetoothStart(Blockly, '"MyCar"');
        }
        return '';
    };

    // =========================
    // 2. SET NAME
    // =========================
    Blockly.Arduino.bt_name = function (block) {
        ensureRcCarBase(Blockly);

        const name = Blockly.Arduino.valueToCode(
            block,
            'NAME',
            Blockly.Arduino.ORDER_ATOMIC
        ) || '"MyCar"';

        ensureBluetoothStart(Blockly, name);
        return '';
    };


    // =========================
    // 3. MOTOR SETUP
    // =========================
    Blockly.Arduino.motor_setup = function () {
        ensureRcCarBase(Blockly);

        let setupCode = '';
        Object.keys(motorGroups).forEach(motor => {
            const pins = motorGroups[motor];
            setupCode += `
// ${motor}${motorAttachCode(pins[0], pins[1])}`;
        });

        if (!Blockly.Arduino.setups_['motor_setup']) {
            Blockly.Arduino.setups_['motor_setup'] = '';
        }

        Blockly.Arduino.setups_['motor_setup'] += setupCode;
        return '';
    };
    // =========================
    // 4. SPEED CONTROL
    // =========================
Blockly.Arduino.set_speed = function (block) {
    ensureRcCarBase(Blockly);

    const speed = Blockly.Arduino.valueToCode(
        block,
        'SPEED',
        Blockly.Arduino.ORDER_ATOMIC
    ) || 200;

    return `motorSpeed = ${speed};\n`;
};

Blockly.Arduino.set_servo = function (block) {
    ensureRcCarBase(Blockly);

    const pin = block.getFieldValue('PIN');
    const angle = Blockly.Arduino.valueToCode(
        block,
        'ANGLE',
        Blockly.Arduino.ORDER_ATOMIC
    ) || 90;

    return `
servoPin = ${pin};
servoAngle = ${angle};
setServoByPin(${pin}, ${angle});
`;
};

// Blockly.Arduino.ble_robot_full_1 = function(block){

// const name =
// Blockly.Arduino.valueToCode(block,'NAME',
// Blockly.Arduino.ORDER_ATOMIC) || '"DOZZRE"';


// // ===== INCLUDE =====

// Blockly.Arduino.includes_['ble_robot'] = `
// #include "BluetoothSerial.h"
// #include <ESP32Servo.h>
// `;


// // ===== MOTOR PINS =====

// Blockly.Arduino.definitions_['motor_pins'] = `
// #define MOTOR_FL1 13
// #define MOTOR_FL2 2
// #define MOTOR_FR1 18
// #define MOTOR_FR2 12
// #define MOTOR_BL1 15
// #define MOTOR_BL2 23
// #define MOTOR_BR1 19
// #define MOTOR_BR2 27

// #define SERVO_PIN 14
// `;


// // ===== VARIABLES =====

// Blockly.Arduino.definitions_['robot_vars'] = `
// BluetoothSerial SerialBT;

// Servo myServo;

// int servoPosition = 0;

// char command;
// `;


// // ===== FUNCTIONS =====

// Blockly.Arduino.definitions_['robot_functions'] = `

// // ---------- MOVEMENT ----------

// void moveForward() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveBackward() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void moveLeft() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveRight() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void rotateClockwise() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void rotateAnticlockwise() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void stopMotors() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, LOW);

// }


// // ---------- SERVO ----------

// void setServoPosition(int position){

// servoPosition = position;

// myServo.detach();

// delay(10);

// myServo.attach(SERVO_PIN);

// myServo.write(servoPosition);

// }

// `;


// // ===== SETUP =====

// Blockly.Arduino.setups_['robot_setup'] = `

// pinMode(MOTOR_FL1, OUTPUT);
// pinMode(MOTOR_FL2, OUTPUT);
// pinMode(MOTOR_FR1, OUTPUT);
// pinMode(MOTOR_FR2, OUTPUT);
// pinMode(MOTOR_BL1, OUTPUT);
// pinMode(MOTOR_BL2, OUTPUT);
// pinMode(MOTOR_BR1, OUTPUT);
// pinMode(MOTOR_BR2, OUTPUT);

// myServo.attach(SERVO_PIN);
// myServo.write(servoPosition);

// SerialBT.begin(${name});

// Serial.println("Bluetooth Robot Ready");

// `;


// // ===== LOOP =====

// Blockly.Arduino.loops_['robot_loop'] = `

// if (SerialBT.available()) {

// command = SerialBT.read();

// switch(command){

// case 'u': moveForward(); break;
// case 'd': moveBackward(); break;
// case 'l': moveLeft(); break;
// case 'r': moveRight(); break;
// case 'C': rotateClockwise(); break;
// case 'G': rotateAnticlockwise(); break;
// case 'n': stopMotors(); break;
// case 'f': setServoPosition(70); break;
// case 'b': setServoPosition(0); break;

// break;
// }

// }

// `;

// return '';

// };


// Blockly.Arduino.ble_robot_full_2 = function(block){

// const name =
// Blockly.Arduino.valueToCode(block,'NAME',
// Blockly.Arduino.ORDER_ATOMIC) || '"Pen"';


// // ===== INCLUDE =====

// Blockly.Arduino.includes_['ble_robot'] = `
// #include "BluetoothSerial.h"
// #include <ESP32Servo.h>
// `;


// // ===== MOTOR PINS =====

// Blockly.Arduino.definitions_['motor_pins'] = `
// #define MOTOR_FL1 13
// #define MOTOR_FL2 2
// #define MOTOR_FR1 18
// #define MOTOR_FR2 12
// #define MOTOR_BL1 15
// #define MOTOR_BL2 23
// #define MOTOR_BR1 19
// #define MOTOR_BR2 27

// #define SERVO_PIN 14
// `;


// // ===== VARIABLES =====

// Blockly.Arduino.definitions_['robot_vars'] = `
// BluetoothSerial SerialBT;

// Servo myServo;

// int servoPosition = 0;

// char command;
// `;


// // ===== FUNCTIONS =====

// Blockly.Arduino.definitions_['robot_functions'] = `

// // ---------- MOVEMENT ----------

// void moveForward() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveBackward() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void moveLeft() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveRight() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void rotateClockwise() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void rotateAnticlockwise() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void stopMotors() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, LOW);

// }


// // ---------- SERVO ----------

// void setServoPosition(int position){

// servoPosition = position;

// myServo.detach();

// delay(10);

// myServo.attach(SERVO_PIN);

// myServo.write(servoPosition);

// }

// `;


// // ===== SETUP =====

// Blockly.Arduino.setups_['robot_setup'] = `

// pinMode(MOTOR_FL1, OUTPUT);
// pinMode(MOTOR_FL2, OUTPUT);
// pinMode(MOTOR_FR1, OUTPUT);
// pinMode(MOTOR_FR2, OUTPUT);
// pinMode(MOTOR_BL1, OUTPUT);
// pinMode(MOTOR_BL2, OUTPUT);
// pinMode(MOTOR_BR1, OUTPUT);
// pinMode(MOTOR_BR2, OUTPUT);

// myServo.attach(SERVO_PIN);
// myServo.write(servoPosition);

// SerialBT.begin(${name});

// Serial.println("Bluetooth Robot Ready");

// `;


// // ===== LOOP =====

// Blockly.Arduino.loops_['robot_loop'] = `

// if (SerialBT.available()) {

// command = SerialBT.read();

// switch(command){

// case 'u': moveForward(); break;
// case 'd': moveBackward(); break;
// case 'l': moveLeft(); break;
// case 'r': moveRight(); break;
// case 'C': rotateClockwise(); break;
// case 'G': rotateAnticlockwise(); break;
// case 'n': stopMotors(); break;
// case 'f': setServoPosition(70); break;
// case 'b': setServoPosition(0); break;

// break;
// }

// }

// `;

// return '';

// };



// Blockly.Arduino.ble_robot_full_3 = function(block){

// const name =
// Blockly.Arduino.valueToCode(block,'NAME',
// Blockly.Arduino.ORDER_ATOMIC) || '"Soccer"';


// // ===== INCLUDE =====

// Blockly.Arduino.includes_['ble_robot'] = `
// #include "BluetoothSerial.h"
// #include <ESP32Servo.h>
// `;


// // ===== MOTOR PINS =====

// Blockly.Arduino.definitions_['motor_pins'] = `
// #define MOTOR_FL1 13
// #define MOTOR_FL2 2
// #define MOTOR_FR1 18
// #define MOTOR_FR2 12
// #define MOTOR_BL1 15
// #define MOTOR_BL2 23
// #define MOTOR_BR1 19
// #define MOTOR_BR2 27

// #define SERVO_PIN 14
// `;


// // ===== VARIABLES =====

// Blockly.Arduino.definitions_['robot_vars'] = `
// BluetoothSerial SerialBT;

// Servo myServo;

// int servoPosition = 0;

// char command;
// `;


// // ===== FUNCTIONS =====

// Blockly.Arduino.definitions_['robot_functions'] = `

// // ---------- MOVEMENT ----------

// void moveForward() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveBackward() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void moveLeft() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveRight() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void rotateClockwise() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void rotateAnticlockwise() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void stopMotors() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, LOW);

// }


// // ---------- SERVO ----------

// void setServoPosition(int position){

// servoPosition = position;

// myServo.detach();

// delay(10);

// myServo.attach(SERVO_PIN);

// myServo.write(servoPosition);

// }

// `;


// // ===== SETUP =====

// Blockly.Arduino.setups_['robot_setup'] = `

// pinMode(MOTOR_FL1, OUTPUT);
// pinMode(MOTOR_FL2, OUTPUT);
// pinMode(MOTOR_FR1, OUTPUT);
// pinMode(MOTOR_FR2, OUTPUT);
// pinMode(MOTOR_BL1, OUTPUT);
// pinMode(MOTOR_BL2, OUTPUT);
// pinMode(MOTOR_BR1, OUTPUT);
// pinMode(MOTOR_BR2, OUTPUT);

// myServo.attach(SERVO_PIN);
// myServo.write(servoPosition);

// SerialBT.begin(${name});

// Serial.println("Bluetooth Robot Ready");

// `;


// // ===== LOOP =====

// Blockly.Arduino.loops_['robot_loop'] = `

// if (SerialBT.available()) {

// command = SerialBT.read();

// switch(command){

// case 'u': moveForward(); break;
// case 'd': moveBackward(); break;
// case 'l': moveLeft(); break;
// case 'r': moveRight(); break;
// case 'C': rotateClockwise(); break;
// case 'G': rotateAnticlockwise(); break;
// case 'n': stopMotors(); break;
// case 'f': setServoPosition(70); break;
// case 'b': setServoPosition(0); break;

// break;
// }

// }

// `;

// return '';

// };



// Blockly.Arduino.ble_robot_full_4 = function(block){

// const name =
// Blockly.Arduino.valueToCode(block,'NAME',
// Blockly.Arduino.ORDER_ATOMIC) || '"Gripper"';


// // ===== INCLUDE =====

// Blockly.Arduino.includes_['ble_robot'] = `
// #include "BluetoothSerial.h"
// #include <ESP32Servo.h>
// `;


// // ===== MOTOR PINS =====

// Blockly.Arduino.definitions_['motor_pins'] = `
// #define MOTOR_FL1 13
// #define MOTOR_FL2 2
// #define MOTOR_FR1 18
// #define MOTOR_FR2 12
// #define MOTOR_BL1 15
// #define MOTOR_BL2 23
// #define MOTOR_BR1 19
// #define MOTOR_BR2 27

// #define SERVO_PIN 14
// `;


// // ===== VARIABLES =====

// Blockly.Arduino.definitions_['robot_vars'] = `
// BluetoothSerial SerialBT;

// Servo myServo;

// int servoPosition = 0;

// char command;
// `;


// // ===== FUNCTIONS =====

// Blockly.Arduino.definitions_['robot_functions'] = `

// // ---------- MOVEMENT ----------

// void moveForward() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveBackward() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void moveLeft() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void moveRight() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void rotateClockwise() {

// digitalWrite(MOTOR_FL1, HIGH);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, HIGH);

// digitalWrite(MOTOR_BL1, HIGH);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, HIGH);

// }


// void rotateAnticlockwise() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, HIGH);

// digitalWrite(MOTOR_FR1, HIGH);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, HIGH);

// digitalWrite(MOTOR_BR1, HIGH);
// digitalWrite(MOTOR_BR2, LOW);

// }


// void stopMotors() {

// digitalWrite(MOTOR_FL1, LOW);
// digitalWrite(MOTOR_FL2, LOW);

// digitalWrite(MOTOR_FR1, LOW);
// digitalWrite(MOTOR_FR2, LOW);

// digitalWrite(MOTOR_BL1, LOW);
// digitalWrite(MOTOR_BL2, LOW);

// digitalWrite(MOTOR_BR1, LOW);
// digitalWrite(MOTOR_BR2, LOW);

// }


// // ---------- SERVO ----------

// void setServoPosition(int position){

// servoPosition = position;

// myServo.detach();

// delay(10);

// myServo.attach(SERVO_PIN);

// myServo.write(servoPosition);

// }

// `;


// // ===== SETUP =====

// Blockly.Arduino.setups_['robot_setup'] = `

// pinMode(MOTOR_FL1, OUTPUT);
// pinMode(MOTOR_FL2, OUTPUT);
// pinMode(MOTOR_FR1, OUTPUT);
// pinMode(MOTOR_FR2, OUTPUT);
// pinMode(MOTOR_BL1, OUTPUT);
// pinMode(MOTOR_BL2, OUTPUT);
// pinMode(MOTOR_BR1, OUTPUT);
// pinMode(MOTOR_BR2, OUTPUT);

// myServo.attach(SERVO_PIN);
// myServo.write(servoPosition);

// SerialBT.begin(${name});

// Serial.println("Bluetooth Robot Ready");

// `;


// // ===== LOOP =====

// Blockly.Arduino.loops_['robot_loop'] = `

// if (SerialBT.available()) {

// command = SerialBT.read();

// switch(command){

// case 'u': moveForward(); break;
// case 'd': moveBackward(); break;
// case 'l': moveLeft(); break;
// case 'r': moveRight(); break;
// case 'C': rotateClockwise(); break;
// case 'G': rotateAnticlockwise(); break;
// case 'n': stopMotors(); break;
// case 'f': setServoPosition(60); break;
// case 'b': setServoPosition(0); break;

// break;
// }

// }

// `;

// return '';

// <block type="ble_robot_full_1">
//   <value name="NAME">
    // <shadow type="text">
    //   <field name="TEXT">DOZZRE</field>
//     </shadow>
//   </value>
// </block>

// <block type="ble_robot_full_2">
//   <value name="NAME">
//     <shadow type="text">
//       <field name="TEXT">pen</field>
//     </shadow>
//   </value>
// </block>
// <block type="ble_robot_full_3">
//   <value name="NAME">
//     <shadow type="text">
//       <field name="TEXT">Soccer</field>
//     </shadow>
//   </value>
// </block>
// <block type="ble_robot_full_4">
//   <value name="NAME">
//     <shadow type="text">
//       <field name="TEXT">Gripper</field>
//     </shadow>
//   </value>
// </block>
// };
return Blockly;

}

exports = addGenerator;