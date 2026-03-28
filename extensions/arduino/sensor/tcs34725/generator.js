// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addGenerator (Blockly) {
//     Blockly.Arduino.color_sensor_init = function (block) {
//         Blockly.Arduino.includes_['include_tcs34725'] = `
// #include <Wire.h>
// #include "Adafruit_TCS34725.h"
// Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);
// `;

//         Blockly.Arduino.setups_['setup_tcs34725'] = `
// Serial.begin(9600);
// if (!tcs.begin()) {
//     Serial.println("TCS34725 not found. Check wiring or I2C address.");
//     while (1);
// }
// Serial.println("TCS34725 is ready!");
// `;

//         return '';
//     };

//     Blockly.Arduino.color_sensor_read = function (block) {
//         return `
// uint16_t r, g, b, c;
// float colorTemp, lux;

// tcs.getRawData(&r, &g, &b, &c);
// colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
// lux = tcs.calculateLux(r, g, b);

// Serial.print("R: "); Serial.print(r);
// Serial.print("\\tG: "); Serial.print(g);
// Serial.print("\\tB: "); Serial.print(b);
// Serial.print("\\tC: "); Serial.print(c);
// Serial.print("\\tColor Temp: "); Serial.print(colorTemp);
// Serial.print(" K\\tLux: "); Serial.println(lux);

// delay(500);
// `;
//     };

//   Blockly.Arduino.color_sensor_value = function (block) {
//     const color = block.getFieldValue('COLOR');
//     Blockly.Arduino.includes_['color_sensor_vars'] = 'uint16_t r, g, b, c;';
//     const variable = color === 'R' ? 'r' : color === 'G' ? 'g' : 'b';
//     const code = `(tcs.getRawData(&r, &g, &b, &c), ${variable})`;
//     return [code, Blockly.Arduino.ORDER_ATOMIC];
// };


// Blockly.Arduino.color_sensor_is_color = function (block) {
//     const color = block.getFieldValue('COLOR');

//     Blockly.Arduino.definitions_['tcs_color_vars'] = `
// uint16_t r, g, b, c;
// `;

//     const readCode = `
// tcs.getRawData(&r, &g, &b, &c);
// `;

//     let condition = 'false';

//     switch (color) {
//         case 'RED':
//             condition = '(r > g && r > b)';
//             break;
//         case 'GREEN':
//             condition = '(g > r && g > b)';
//             break;
//         case 'BLUE':
//             condition = '(b > r && b > g)';
//             break;
//     }

//     const code = `({ ${readCode} ${condition}; })`;
//     return [code, Blockly.Arduino.ORDER_ATOMIC];
// };

//     return Blockly;
// }

// exports = addGenerator;


/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addGenerator (Blockly) {

    // ================= INIT =================
    Blockly.Arduino.color_sensor_init = function () {

        Blockly.Arduino.includes_['include_tcs34725'] = `
#include <Wire.h>
#include "Adafruit_TCS34725.h"
Adafruit_TCS34725 tcs =
  Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);
`;

        Blockly.Arduino.definitions_['tcs_vars'] = `
uint16_t r, g, b, c;
float R_white = 255.0;
float G_white = 255.0;
float B_white = 255.0;

// -------- HSV COLOR DETECTION --------
String detectColor(float R, float G, float B) {

  R = (R / R_white) * 255.0;
  G = (G / G_white) * 255.0;
  B = (B / B_white) * 255.0;

  float sum = R + G + B;
  if (sum <= 0) return "";

  float rN = R / sum;
  float gN = G / sum;
  float bN = B / sum;

  float maxVal = max(rN, max(gN, bN));
  float minVal = min(rN, min(gN, bN));
  float delta = maxVal - minVal;

  float H = 0, S = 0, V = maxVal;

  if (delta != 0) {
    if (maxVal == rN) H = 60 * fmod(((gN - bN) / delta), 6);
    else if (maxVal == gN) H = 60 * (((bN - rN) / delta) + 2);
    else H = 60 * (((rN - gN) / delta) + 4);
  }

  if (H < 0) H += 360;
  if (maxVal != 0) S = delta / maxVal;

  if (V < 0.20 || S < 0.20) return "";

  if ((H >= 0 && H < 25) || (H >= 340)) return "RED";
  if (H >= 45 && H < 70) return "YELLOW";
  if (H >= 70 && H < 170) return "GREEN";
  if (H >= 210 && H < 270) return "BLUE";

  return "";
}
`;

        Blockly.Arduino.setups_['setup_tcs34725'] = `
        Serial.begin(9600);
if (!tcs.begin()) {
  while (1);
}
`;

        return '';
    };

    // ================= READ BLOCK =================
    Blockly.Arduino.color_sensor_read = function () {
        return `
tcs.getRawData(&r, &g, &b, &c);
delay(100);
`;
    };

    // ================= PROPER COLOR CHECK =================
    Blockly.Arduino.color_sensor_is_color = function (block) {

        const color = block.getFieldValue('COLOR');

        const code = `
(tcs.getRawData(&r, &g, &b, &c), detectColor(r, g, b) == "${color}")
`;

        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
    Blockly.Arduino.color_sensor_detect_color = function () {
        const code = `(tcs.getRawData(&r, &g, &b, &c), detectColor(r, g, b))`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };


    return Blockly;
}

exports = addGenerator;
