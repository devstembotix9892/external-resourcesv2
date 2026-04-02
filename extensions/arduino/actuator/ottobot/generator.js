// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addGenerator (Blockly) {

//     Blockly.Arduino.otto_home = function () {
//         Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
//         Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
//         return 'OttoBot.home();\n';
//     };

//     Blockly.Arduino.otto_walk = function (block) {
//         const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
//         const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
//         const direction = block.getFieldValue('DIRECTION');
    
//         Blockly.Arduino.includes_.otto = '#include <Otto.h>';
//         Blockly.Arduino.definitions_.otto = 'Otto OttoBot;';
//         Blockly.Arduino.definitions_.otto_pins = `
//     #define LeftLeg 2
//     #define RightLeg 3
//     #define LeftFoot 4
//     #define RightFoot 7 
//     #define Buzzer 10`;
    
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);\nOttoBot.home();';
//         return `OttoBot.walk(${steps}, ${time}, ${direction});\n`;
//     };

//     Blockly.Arduino.otto_moonwalker = function (block) {
//         const count = Blockly.Arduino.valueToCode(block, 'COUNT', Blockly.Arduino.ORDER_ATOMIC) || '1';
//         const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1000';
//         const height = Blockly.Arduino.valueToCode(block, 'HEIGHT', Blockly.Arduino.ORDER_ATOMIC) || '25';
//         const direction = block.getFieldValue('DIRECTION');

//         Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
//         Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';

//         return `for (int i = 0; i < ${count}; i++) {\n  OttoBot.moonwalker(1, ${steps}, ${height}, ${direction});\n}\n`;
//     };

//     Blockly.Arduino.otto_jump = function (block) {
//         const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
//         const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    
//         Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
//         Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
//         return `OttoBot.jump(${steps}, ${time});\n`;
//     };
    
    
//     Blockly.Arduino.otto_turn = function (block) {
//         const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
//         const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
//         const direction = block.getFieldValue('DIRECTION');
    
//         Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
//         Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
//         return `OttoBot.turn(${steps}, ${time}, ${direction});\n`;
//     };
    
    
//     Blockly.Arduino.otto_shake_leg = function (block) {
//         const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
//         const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
//         const direction = block.getFieldValue('DIRECTION');
    
//         Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
//         Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
//         Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
//         return `OttoBot.shakeLeg(${steps}, ${time}, ${direction});\n`;
//     };
    
    

//     return Blockly;
// }

// exports = addGenerator;


/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addGenerator (Blockly) {

    Blockly.Arduino.otto_home = function () {
        Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
        Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
        return 'OttoBot.home();\n';
    };

    Blockly.Arduino.otto_walk = function (block) {
        const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
        const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
        const direction = block.getFieldValue('DIRECTION');
    
        Blockly.Arduino.includes_.otto = '#include <Otto.h>';
        // Blockly.Arduino.definitions_.otto = 'Otto OttoBot;';
        Blockly.Arduino.definitions_.otto_pins = `
#define LeftLeg 2
#define RightLeg 3
#define LeftFoot 4
#define RightFoot 7 
#define Buzzer 10`;
    
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);\nOttoBot.home();';
        return `OttoBot.walk(${steps}, ${time}, ${direction});\n`;
    };

    Blockly.Arduino.otto_moonwalker = function (block) {
        const count = Blockly.Arduino.valueToCode(block, 'COUNT', Blockly.Arduino.ORDER_ATOMIC) || '1';
        const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1000';
        const height = Blockly.Arduino.valueToCode(block, 'HEIGHT', Blockly.Arduino.ORDER_ATOMIC) || '25';
        const direction = block.getFieldValue('DIRECTION');

        Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
        // Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';

        return `for (int i = 0; i < ${count}; i++) {\n  OttoBot.moonwalker(1, ${steps}, ${height}, ${direction});\n}\n`;
    };

    Blockly.Arduino.otto_jump = function (block) {
        const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
        const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    
        Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
        // Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
        return `OttoBot.jump(${steps}, ${time});\n`;
    };
    
    Blockly.Arduino.otto_turn = function (block) {
        const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
        const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
        const direction = block.getFieldValue('DIRECTION');
    
        Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
        // Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
        return `OttoBot.turn(${steps}, ${time}, ${direction});\n`;
    };
    
    Blockly.Arduino.otto_shake_leg = function (block) {
        const steps = Blockly.Arduino.valueToCode(block, 'STEPS', Blockly.Arduino.ORDER_ATOMIC) || '1';
        const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
        const direction = block.getFieldValue('DIRECTION');
    
        Blockly.Arduino.includes_.otto_includes = '#include <Otto.h>\n';
        // Blockly.Arduino.definitions_.otto_object = 'Otto OttoBot;\n';
        Blockly.Arduino.setups_.otto_setup = 'OttoBot.init(2, 3, 4, 7, true, 10);\n';
    
        return `OttoBot.shakeLeg(${steps}, ${time}, ${direction});\n`;
    };

    Blockly.Arduino.otto_move_command = function (block) {
        const command = block.getFieldValue('COMMAND');

        // Include necessary libraries
        Blockly.Arduino.includes_.bluetooth_libs = `#include <SoftwareSerial.h>\n#include <Servo.h>`;

        // Global object definitions
        Blockly.Arduino.definitions_.bluetooth_defs = `
SoftwareSerial BT(13, A3); // RX, TX
Servo servo_1;
Servo servo_2;
Servo servo_3;
Servo servo_4;

#define SERVO_1 2
#define SERVO_2 3
#define SERVO_3 4
#define SERVO_4 7
#define BUZZER 10`;

        // Setup code
        Blockly.Arduino.setups_.bluetooth_setup = `
Serial.begin(9600);
BT.begin(9600);
servo_1.attach(SERVO_1);
servo_2.attach(SERVO_2);
servo_3.attach(SERVO_3);
servo_4.attach(SERVO_4);
pinMode(BUZZER, OUTPUT);
digitalWrite(BUZZER, LOW);`;

        return `BT.write('${command}');\n`;
    };

    return Blockly;
}

exports = addGenerator;
