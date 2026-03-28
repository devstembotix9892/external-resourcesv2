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
`;


// ===== VARIABLES =====
Blockly.Arduino.definitions_['robot_vars'] = `
BluetoothSerial SerialBT;

char command;

int motorSpeed = 200;
int lastSpeed = 200;
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
String msg = "Speed: " + String(motorSpeed);
Serial.println(msg);
SerialBT.println(msg);
lastSpeed = motorSpeed;
}
}


// ---------- MOVEMENT ----------
void moveForward() {
ledcWrite(MOTOR_FL1, motorSpeed); ledcWrite(MOTOR_FL2, 0);
ledcWrite(MOTOR_FR1, motorSpeed); ledcWrite(MOTOR_FR2, 0);
ledcWrite(MOTOR_BL1, 0); ledcWrite(MOTOR_BL2, motorSpeed);
ledcWrite(MOTOR_BR1, 0); ledcWrite(MOTOR_BR2, motorSpeed);
}

void moveBackward() {
ledcWrite(MOTOR_FL1, 0); ledcWrite(MOTOR_FL2, motorSpeed);
ledcWrite(MOTOR_FR1, 0); ledcWrite(MOTOR_FR2, motorSpeed);
ledcWrite(MOTOR_BL1, motorSpeed); ledcWrite(MOTOR_BL2, 0);
ledcWrite(MOTOR_BR1, motorSpeed); ledcWrite(MOTOR_BR2, 0);
}

void moveLeft() {
ledcWrite(MOTOR_FL1, 0); ledcWrite(MOTOR_FL2, motorSpeed);
ledcWrite(MOTOR_FR1, motorSpeed); ledcWrite(MOTOR_FR2, 0);
ledcWrite(MOTOR_BL1, motorSpeed); ledcWrite(MOTOR_BL2, 0);
ledcWrite(MOTOR_BR1, 0); ledcWrite(MOTOR_BR2, motorSpeed);
}

void moveRight() {
ledcWrite(MOTOR_FL1, motorSpeed); ledcWrite(MOTOR_FL2, 0);
ledcWrite(MOTOR_FR1, 0); ledcWrite(MOTOR_FR2, motorSpeed);
ledcWrite(MOTOR_BL1, 0); ledcWrite(MOTOR_BL2, motorSpeed);
ledcWrite(MOTOR_BR1, motorSpeed); ledcWrite(MOTOR_BR2, 0);
}

void stopMotors() {
ledcWrite(MOTOR_FL1, 0); ledcWrite(MOTOR_FL2, 0);
ledcWrite(MOTOR_FR1, 0); ledcWrite(MOTOR_FR2, 0);
ledcWrite(MOTOR_BL1, 0); ledcWrite(MOTOR_BL2, 0);
ledcWrite(MOTOR_BR1, 0); ledcWrite(MOTOR_BR2, 0);
}

void handleCommand(char cmd) {
switch (cmd) {
case 'u': moveForward(); break;
case 'd': moveBackward(); break;
case 'l': moveLeft(); break;
case 'r': moveRight(); break;
case 'n': stopMotors(); break;
}
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

// PWM Attach (NEW API)
ledcAttach(MOTOR_FL1, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_FL2, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_FR1, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_FR2, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_BL1, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_BL2, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_BR1, PWM_FREQ, PWM_RESOLUTION);
ledcAttach(MOTOR_BR2, PWM_FREQ, PWM_RESOLUTION);

Serial.begin(9600);
SerialBT.begin(${name});

Serial.println("Bluetooth Ready");
`;


// ===== LOOP =====
Blockly.Arduino.loops_['robot_loop'] = `

if (SerialBT.available()) {
command = SerialBT.read();

if (command >= '1' && command <= '5') {
setSpeed(command);
} else {
handleCommand(command);
}
}
`;

return '';

};

return Blockly;

}

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
{

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