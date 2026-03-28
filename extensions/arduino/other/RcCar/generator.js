function addGenerator(Blockly) {

 Blockly.Arduino.ble_robot_full = function (block) {

const name =
Blockly.Arduino.valueToCode(block,'NAME',
Blockly.Arduino.ORDER_ATOMIC) || '"TEAM_BLUE"';


// ===== INCLUDE =====

Blockly.Arduino.includes_['ble_robot'] = `
#include "BluetoothSerial.h"
`;


// ===== MOTOR PINS =====

Blockly.Arduino.definitions_['motor_pins'] = `
#define MOTOR_FL1 27
#define MOTOR_FL2 19
#define MOTOR_FR1 15
#define MOTOR_FR2 23
#define MOTOR_BL1 12
#define MOTOR_BL2 18
#define MOTOR_BR1 13
#define MOTOR_BR2 2
`;


// ===== PWM CONFIG =====

Blockly.Arduino.definitions_['pwm_config'] = `
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8

#define CH_FL1 0
#define CH_FL2 1
#define CH_FR1 2
#define CH_FR2 3
#define CH_BL1 4
#define CH_BL2 5
#define CH_BR1 6
#define CH_BR2 7
`;


// ===== VARIABLES =====

Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

char command;

int motorSpeed = 200;
int lastSpeed = 200;

unsigned long lastCommandTime = 0;
const unsigned long COMMAND_TIMEOUT = 200;
`;


// ===== FUNCTIONS =====

Blockly.Arduino.definitions_['robot_functions'] = `

// ---------- SPEED ----------
void setSpeed(char cmd) {

switch (cmd) {

case '1': motorSpeed = 50; break;
case '2': motorSpeed = 100; break;
case '3': motorSpeed = 150; break;
case '4': motorSpeed = 200; break;
case '5': motorSpeed = 250; break;

}

if (motorSpeed != lastSpeed) {

String msg = "Speed Changed → Current Speed: " + String(motorSpeed);

Serial.println(msg);
SerialBT.println(msg);

lastSpeed = motorSpeed;

}

}


// ---------- COMMAND HANDLER ----------
void handleCommand(char cmd) {

switch (cmd) {

case 'u': moveForward(); logCommand("u"); break;
case 'd': moveBackward(); logCommand("d"); break;
case 'l': moveLeft(); logCommand("l"); break;
case 'r': moveRight(); logCommand("r"); break;
case 'C': rotateClockwise(); logCommand("C"); break;
case 'G': rotateAnticlockwise(); logCommand("G"); break;

case 'n':
stopMotors();
Serial.println("n");
SerialBT.println("n");
break;

}

}


// ---------- LOGGER ----------
void logCommand(String action) {

static unsigned long lastLog = 0;

if (millis() - lastLog > 100) {

String msg = action + " | Current Speed: " + String(motorSpeed);

Serial.println(msg);
SerialBT.println(msg);

lastLog = millis();

}

}


// ---------- MOVEMENT ----------
void moveForward() {
ledcWrite(CH_FL1, motorSpeed); ledcWrite(CH_FL2, 0);
ledcWrite(CH_FR1, motorSpeed); ledcWrite(CH_FR2, 0);
ledcWrite(CH_BL1, 0); ledcWrite(CH_BL2, motorSpeed);
ledcWrite(CH_BR1, 0); ledcWrite(CH_BR2, motorSpeed);
}

void moveBackward() {
ledcWrite(CH_FL1, 0); ledcWrite(CH_FL2, motorSpeed);
ledcWrite(CH_FR1, 0); ledcWrite(CH_FR2, motorSpeed);
ledcWrite(CH_BL1, motorSpeed); ledcWrite(CH_BL2, 0);
ledcWrite(CH_BR1, motorSpeed); ledcWrite(CH_BR2, 0);
}

void moveLeft() {
ledcWrite(CH_FL1, 0); ledcWrite(CH_FL2, motorSpeed);
ledcWrite(CH_FR1, motorSpeed); ledcWrite(CH_FR2, 0);
ledcWrite(CH_BL1, motorSpeed); ledcWrite(CH_BL2, 0);
ledcWrite(CH_BR1, 0); ledcWrite(CH_BR2, motorSpeed);
}

void moveRight() {
ledcWrite(CH_FL1, motorSpeed); ledcWrite(CH_FL2, 0);
ledcWrite(CH_FR1, 0); ledcWrite(CH_FR2, motorSpeed);
ledcWrite(CH_BL1, 0); ledcWrite(CH_BL2, motorSpeed);
ledcWrite(CH_BR1, motorSpeed); ledcWrite(CH_BR2, 0);
}

void rotateClockwise() {
ledcWrite(CH_FL1, motorSpeed); ledcWrite(CH_FL2, 0);
ledcWrite(CH_FR1, 0); ledcWrite(CH_FR2, motorSpeed);
ledcWrite(CH_BL1, motorSpeed); ledcWrite(CH_BL2, 0);
ledcWrite(CH_BR1, 0); ledcWrite(CH_BR2, motorSpeed);
}

void rotateAnticlockwise() {
ledcWrite(CH_FL1, 0); ledcWrite(CH_FL2, motorSpeed);
ledcWrite(CH_FR1, motorSpeed); ledcWrite(CH_FR2, 0);
ledcWrite(CH_BL1, 0); ledcWrite(CH_BL2, motorSpeed);
ledcWrite(CH_BR1, motorSpeed); ledcWrite(CH_BR2, 0);
}

void stopMotors() {
ledcWrite(CH_FL1, 0); ledcWrite(CH_FL2, 0);
ledcWrite(CH_FR1, 0); ledcWrite(CH_FR2, 0);
ledcWrite(CH_BL1, 0); ledcWrite(CH_BL2, 0);
ledcWrite(CH_BR1, 0); ledcWrite(CH_BR2, 0);
}

`;


// ===== SETUP =====

Blockly.Arduino.setups_['robot_setup'] = `

pinMode(MOTOR_FL1, OUTPUT);
pinMode(MOTOR_FL2, OUTPUT);
pinMode(MOTOR_FR1, OUTPUT);
pinMode(MOTOR_FR2, OUTPUT);
pinMode(MOTOR_BL1, OUTPUT);
pinMode(MOTOR_BL2, OUTPUT);
pinMode(MOTOR_BR1, OUTPUT);
pinMode(MOTOR_BR2, OUTPUT);

// PWM Setup
ledcSetup(CH_FL1, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_FL2, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_FR1, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_FR2, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_BL1, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_BL2, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_BR1, PWM_FREQ, PWM_RESOLUTION);
ledcSetup(CH_BR2, PWM_FREQ, PWM_RESOLUTION);

// Attach Pins
ledcAttachPin(MOTOR_FL1, CH_FL1);
ledcAttachPin(MOTOR_FL2, CH_FL2);
ledcAttachPin(MOTOR_FR1, CH_FR1);
ledcAttachPin(MOTOR_FR2, CH_FR2);
ledcAttachPin(MOTOR_BL1, CH_BL1);
ledcAttachPin(MOTOR_BL2, CH_BL2);
ledcAttachPin(MOTOR_BR1, CH_BR1);
ledcAttachPin(MOTOR_BR2, CH_BR2);

Serial.begin(9600);

SerialBT.begin(${name});

Serial.println("Bluetooth Device Ready");

`;


// ===== LOOP =====

Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {

command = SerialBT.read();

lastCommandTime = millis();

if (command >= '1' && command <= '5') {
setSpeed(command);
}
else {
handleCommand(command);
}

}


`;

return '';

};

Blockly.Arduino.ble_robot_full_1 = function(block){

const name =
Blockly.Arduino.valueToCode(block,'NAME',
Blockly.Arduino.ORDER_ATOMIC) || '"DOZZRE"';


// ===== INCLUDE =====

Blockly.Arduino.includes_['ble_robot'] = `
#include "BluetoothSerial.h"
#include <ESP32Servo.h>
`;


// ===== MOTOR PINS =====

Blockly.Arduino.definitions_['motor_pins'] = `
#define MOTOR_FL1 13
#define MOTOR_FL2 2
#define MOTOR_FR1 18
#define MOTOR_FR2 12
#define MOTOR_BL1 15
#define MOTOR_BL2 23
#define MOTOR_BR1 19
#define MOTOR_BR2 27

#define SERVO_PIN 14
`;


// ===== VARIABLES =====

Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

Servo myServo;

int servoPosition = 0;

char command;
`;


// ===== FUNCTIONS =====

Blockly.Arduino.definitions_['robot_functions'] = `

// ---------- MOVEMENT ----------

void moveForward() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveBackward() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void moveLeft() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveRight() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void rotateClockwise() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void rotateAnticlockwise() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void stopMotors() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, LOW);

}


// ---------- SERVO ----------

void setServoPosition(int position){

servoPosition = position;

myServo.detach();

delay(10);

myServo.attach(SERVO_PIN);

myServo.write(servoPosition);

}

`;


// ===== SETUP =====

Blockly.Arduino.setups_['robot_setup'] = `

pinMode(MOTOR_FL1, OUTPUT);
pinMode(MOTOR_FL2, OUTPUT);
pinMode(MOTOR_FR1, OUTPUT);
pinMode(MOTOR_FR2, OUTPUT);
pinMode(MOTOR_BL1, OUTPUT);
pinMode(MOTOR_BL2, OUTPUT);
pinMode(MOTOR_BR1, OUTPUT);
pinMode(MOTOR_BR2, OUTPUT);

myServo.attach(SERVO_PIN);
myServo.write(servoPosition);

SerialBT.begin(${name});

Serial.println("Bluetooth Robot Ready");

`;


// ===== LOOP =====

Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {

command = SerialBT.read();

switch(command){

case 'u': moveForward(); break;
case 'd': moveBackward(); break;
case 'l': moveLeft(); break;
case 'r': moveRight(); break;
case 'C': rotateClockwise(); break;
case 'G': rotateAnticlockwise(); break;
case 'n': stopMotors(); break;
case 'f': setServoPosition(70); break;
case 'b': setServoPosition(0); break;

break;
}

}

`;

return '';

};


Blockly.Arduino.ble_robot_full_2 = function(block){

const name =
Blockly.Arduino.valueToCode(block,'NAME',
Blockly.Arduino.ORDER_ATOMIC) || '"Pen"';


// ===== INCLUDE =====

Blockly.Arduino.includes_['ble_robot'] = `
#include "BluetoothSerial.h"
#include <ESP32Servo.h>
`;


// ===== MOTOR PINS =====

Blockly.Arduino.definitions_['motor_pins'] = `
#define MOTOR_FL1 13
#define MOTOR_FL2 2
#define MOTOR_FR1 18
#define MOTOR_FR2 12
#define MOTOR_BL1 15
#define MOTOR_BL2 23
#define MOTOR_BR1 19
#define MOTOR_BR2 27

#define SERVO_PIN 14
`;


// ===== VARIABLES =====

Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

Servo myServo;

int servoPosition = 0;

char command;
`;


// ===== FUNCTIONS =====

Blockly.Arduino.definitions_['robot_functions'] = `

// ---------- MOVEMENT ----------

void moveForward() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveBackward() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void moveLeft() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveRight() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void rotateClockwise() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void rotateAnticlockwise() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void stopMotors() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, LOW);

}


// ---------- SERVO ----------

void setServoPosition(int position){

servoPosition = position;

myServo.detach();

delay(10);

myServo.attach(SERVO_PIN);

myServo.write(servoPosition);

}

`;


// ===== SETUP =====

Blockly.Arduino.setups_['robot_setup'] = `

pinMode(MOTOR_FL1, OUTPUT);
pinMode(MOTOR_FL2, OUTPUT);
pinMode(MOTOR_FR1, OUTPUT);
pinMode(MOTOR_FR2, OUTPUT);
pinMode(MOTOR_BL1, OUTPUT);
pinMode(MOTOR_BL2, OUTPUT);
pinMode(MOTOR_BR1, OUTPUT);
pinMode(MOTOR_BR2, OUTPUT);

myServo.attach(SERVO_PIN);
myServo.write(servoPosition);

SerialBT.begin(${name});

Serial.println("Bluetooth Robot Ready");

`;


// ===== LOOP =====

Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {

command = SerialBT.read();

switch(command){

case 'u': moveForward(); break;
case 'd': moveBackward(); break;
case 'l': moveLeft(); break;
case 'r': moveRight(); break;
case 'C': rotateClockwise(); break;
case 'G': rotateAnticlockwise(); break;
case 'n': stopMotors(); break;
case 'f': setServoPosition(70); break;
case 'b': setServoPosition(0); break;

break;
}

}

`;

return '';

};



Blockly.Arduino.ble_robot_full_3 = function(block){

const name =
Blockly.Arduino.valueToCode(block,'NAME',
Blockly.Arduino.ORDER_ATOMIC) || '"Soccer"';


// ===== INCLUDE =====

Blockly.Arduino.includes_['ble_robot'] = `
#include "BluetoothSerial.h"
#include <ESP32Servo.h>
`;


// ===== MOTOR PINS =====

Blockly.Arduino.definitions_['motor_pins'] = `
#define MOTOR_FL1 13
#define MOTOR_FL2 2
#define MOTOR_FR1 18
#define MOTOR_FR2 12
#define MOTOR_BL1 15
#define MOTOR_BL2 23
#define MOTOR_BR1 19
#define MOTOR_BR2 27

#define SERVO_PIN 14
`;


// ===== VARIABLES =====

Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

Servo myServo;

int servoPosition = 0;

char command;
`;


// ===== FUNCTIONS =====

Blockly.Arduino.definitions_['robot_functions'] = `

// ---------- MOVEMENT ----------

void moveForward() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveBackward() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void moveLeft() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveRight() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void rotateClockwise() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void rotateAnticlockwise() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void stopMotors() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, LOW);

}


// ---------- SERVO ----------

void setServoPosition(int position){

servoPosition = position;

myServo.detach();

delay(10);

myServo.attach(SERVO_PIN);

myServo.write(servoPosition);

}

`;


// ===== SETUP =====

Blockly.Arduino.setups_['robot_setup'] = `

pinMode(MOTOR_FL1, OUTPUT);
pinMode(MOTOR_FL2, OUTPUT);
pinMode(MOTOR_FR1, OUTPUT);
pinMode(MOTOR_FR2, OUTPUT);
pinMode(MOTOR_BL1, OUTPUT);
pinMode(MOTOR_BL2, OUTPUT);
pinMode(MOTOR_BR1, OUTPUT);
pinMode(MOTOR_BR2, OUTPUT);

myServo.attach(SERVO_PIN);
myServo.write(servoPosition);

SerialBT.begin(${name});

Serial.println("Bluetooth Robot Ready");

`;


// ===== LOOP =====

Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {

command = SerialBT.read();

switch(command){

case 'u': moveForward(); break;
case 'd': moveBackward(); break;
case 'l': moveLeft(); break;
case 'r': moveRight(); break;
case 'C': rotateClockwise(); break;
case 'G': rotateAnticlockwise(); break;
case 'n': stopMotors(); break;
case 'f': setServoPosition(70); break;
case 'b': setServoPosition(0); break;

break;
}

}

`;

return '';

};



Blockly.Arduino.ble_robot_full_4 = function(block){

const name =
Blockly.Arduino.valueToCode(block,'NAME',
Blockly.Arduino.ORDER_ATOMIC) || '"Gripper"';


// ===== INCLUDE =====

Blockly.Arduino.includes_['ble_robot'] = `
#include "BluetoothSerial.h"
#include <ESP32Servo.h>
`;


// ===== MOTOR PINS =====

Blockly.Arduino.definitions_['motor_pins'] = `
#define MOTOR_FL1 13
#define MOTOR_FL2 2
#define MOTOR_FR1 18
#define MOTOR_FR2 12
#define MOTOR_BL1 15
#define MOTOR_BL2 23
#define MOTOR_BR1 19
#define MOTOR_BR2 27

#define SERVO_PIN 14
`;


// ===== VARIABLES =====

Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

Servo myServo;

int servoPosition = 0;

char command;
`;


// ===== FUNCTIONS =====

Blockly.Arduino.definitions_['robot_functions'] = `

// ---------- MOVEMENT ----------

void moveForward() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveBackward() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void moveLeft() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void moveRight() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void rotateClockwise() {

digitalWrite(MOTOR_FL1, HIGH);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, HIGH);

digitalWrite(MOTOR_BL1, HIGH);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, HIGH);

}


void rotateAnticlockwise() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, HIGH);

digitalWrite(MOTOR_FR1, HIGH);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, HIGH);

digitalWrite(MOTOR_BR1, HIGH);
digitalWrite(MOTOR_BR2, LOW);

}


void stopMotors() {

digitalWrite(MOTOR_FL1, LOW);
digitalWrite(MOTOR_FL2, LOW);

digitalWrite(MOTOR_FR1, LOW);
digitalWrite(MOTOR_FR2, LOW);

digitalWrite(MOTOR_BL1, LOW);
digitalWrite(MOTOR_BL2, LOW);

digitalWrite(MOTOR_BR1, LOW);
digitalWrite(MOTOR_BR2, LOW);

}


// ---------- SERVO ----------

void setServoPosition(int position){

servoPosition = position;

myServo.detach();

delay(10);

myServo.attach(SERVO_PIN);

myServo.write(servoPosition);

}

`;


// ===== SETUP =====

Blockly.Arduino.setups_['robot_setup'] = `

pinMode(MOTOR_FL1, OUTPUT);
pinMode(MOTOR_FL2, OUTPUT);
pinMode(MOTOR_FR1, OUTPUT);
pinMode(MOTOR_FR2, OUTPUT);
pinMode(MOTOR_BL1, OUTPUT);
pinMode(MOTOR_BL2, OUTPUT);
pinMode(MOTOR_BR1, OUTPUT);
pinMode(MOTOR_BR2, OUTPUT);

myServo.attach(SERVO_PIN);
myServo.write(servoPosition);

SerialBT.begin(${name});

Serial.println("Bluetooth Robot Ready");

`;


// ===== LOOP =====

Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {

command = SerialBT.read();

switch(command){

case 'u': moveForward(); break;
case 'd': moveBackward(); break;
case 'l': moveLeft(); break;
case 'r': moveRight(); break;
case 'C': rotateClockwise(); break;
case 'G': rotateAnticlockwise(); break;
case 'n': stopMotors(); break;
case 'f': setServoPosition(60); break;
case 'b': setServoPosition(0); break;

break;
}

}

`;

return '';

};

return Blockly;

}

exports = addGenerator;