/* eslint-disable func-style */
/* eslint-disable require-jsdoc */

function addGenerator(Blockly) {

    // ================================
    // INIT BLOCK
    // ================================
    Blockly.Arduino.ledmatrix_init = function (block) {
        const pin = block.getFieldValue('PIN');
        const numLeds = Blockly.Arduino.valueToCode(block, 'NUM_LEDS', Blockly.Arduino.ORDER_ATOMIC) || '35';
        const brightness = Blockly.Arduino.valueToCode(block, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '50';

        Blockly.Arduino.includes_.neopixel = '#include <Adafruit_NeoPixel.h>';

        Blockly.Arduino.definitions_.neopixel_matrix = `
#define PIN ${pin}
#define NUM_LEDS ${numLeds}
#define BRIGHTNESS ${brightness}
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// CHARACTER MAP Digits + Letters + Symbols
const uint8_t characters[38][5] = {

  // Digits 0–9
  {0x3E,0x51,0x49,0x45,0x3E}, // 0
  {0x00,0x42,0x7F,0x40,0x00}, // 1
  {0x62,0x51,0x49,0x49,0x46}, // 2
  {0x22,0x41,0x49,0x49,0x36}, // 3
  {0x18,0x14,0x12,0x7F,0x10}, // 4
  {0x2F,0x49,0x49,0x49,0x31}, // 5
  {0x3E,0x49,0x49,0x49,0x30}, // 6
  {0x01,0x71,0x09,0x05,0x03}, // 7
  {0x36,0x49,0x49,0x49,0x36}, // 8
  {0x06,0x49,0x49,0x49,0x3E}, // 9

  // Letters A–Z
  {0x7E,0x09,0x09,0x09,0x7E}, // A
  {0x7F,0x49,0x49,0x49,0x36}, // B
  {0x3E,0x41,0x41,0x41,0x22}, // C
  {0x7F,0x41,0x41,0x22,0x1C}, // D
  {0x7F,0x49,0x49,0x49,0x41}, // E
  {0x7F,0x09,0x09,0x09,0x01}, // F
  {0x3E,0x41,0x49,0x49,0x7A}, // G
  {0x7F,0x08,0x08,0x08,0x7F}, // H
  {0x00,0x41,0x7F,0x41,0x00}, // I
  {0x20,0x40,0x41,0x3F,0x01}, // J
  {0x7F,0x08,0x14,0x22,0x41}, // K
  {0x7F,0x40,0x40,0x40,0x40}, // L
  {0x7F,0x02,0x0C,0x02,0x7F}, // M
  {0x7F,0x04,0x08,0x10,0x7F}, // N
  {0x3E,0x41,0x41,0x41,0x3E}, // O
  {0x7F,0x09,0x09,0x09,0x06}, // P
  {0x3E,0x41,0x51,0x21,0x5E}, // Q
  {0x7F,0x09,0x19,0x29,0x46}, // R
  {0x46,0x49,0x49,0x49,0x31}, // S
  {0x01,0x01,0x7F,0x01,0x01}, // T
  {0x3F,0x40,0x40,0x40,0x3F}, // U
  {0x1F,0x20,0x40,0x20,0x1F}, // V
  {0x7F,0x20,0x18,0x20,0x7F}, // W
  {0x63,0x14,0x08,0x14,0x63}, // X
  {0x07,0x08,0x70,0x08,0x07}, // Y
  {0x61,0x51,0x49,0x45,0x43}, // Z

  // Symbols
  {0x0A,0x1F,0x1F,0x0E,0x04}, // ♥ Heart (36)
  {0x00,0x0A,0x00,0x11,0x0E}  // ☺ Smile (37)
};

int getIndex(int x, int y) {
  return y * 7 + x;
}

void displayCharacter(char ch, uint32_t color) {
  matrix.clear();
  int index = -1;

  if (ch >= '0' && ch <= '9') index = ch - '0';
  else if (ch >= 'A' && ch <= 'Z') index = 10 + (ch - 'A');
  else if (ch == '*') index = 36;
  else if (ch == ':') index = 37;
  else return;

  for (int x = 0; x < 5; x++) {
    uint8_t column = characters[index][x];
    for (int y = 0; y < 7; y++) {
      if (column & (1 << y)) {
        matrix.setPixelColor(getIndex(x, y), color);
      }
    }
  }
  matrix.show();
}
`;

        Blockly.Arduino.setups_.neopixel_matrix = `
matrix.begin();
matrix.setBrightness(BRIGHTNESS);
matrix.show();
`;

        return '';
    };

    // ================================
    // DIGIT
    // ================================
    Blockly.Arduino.ledmatrix_showDigit = function (block) {
        const digit = Blockly.Arduino.valueToCode(block, 'DIGIT', Blockly.Arduino.ORDER_ATOMIC) || '0';
        return `displayCharacter('0' + ${digit}, matrix.Color(255,255,0));\n`;
    };

    // ================================
    // LETTER
    // ================================
    Blockly.Arduino.ledmatrix_showChar = function (block) {
        const charVal = block.getFieldValue('CHAR') || 'A';
        return `displayCharacter('${charVal}', matrix.Color(0,255,0));\n`;
    };

    // ================================
    // SYMBOL (heart/smile)
    // ================================
    Blockly.Arduino.ledmatrix_showSymbol = function (block) {
        const symbol = block.getFieldValue('SYMBOL') || '*';
        return `displayCharacter('${symbol}', matrix.Color(255,0,0));\n`;
    };

    // ================================
    // ⭐ CUSTOM 5×7 DRAW BLOCK
    // ================================
    Blockly.Arduino.ledmatrix_draw = function (block) {
        const matrix = block.getFieldValue("MATRIX");

        let code = `
matrix.clear();
for(int i = 0; i < 38; i++){
    if("${matrix}"[i] == '1'){
        matrix.setPixelColor(i, matrix.Color(0,150,255));
    }
}
matrix.show();
`;
        return code;
    };

    return Blockly;
}

exports = addGenerator;
