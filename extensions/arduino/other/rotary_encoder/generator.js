/* eslint-disable func-style */
/* eslint-disable require-jsdoc */

/**
 * Flyout pin dropdowns sometimes store labels like "IO36" instead of "36".
 * #define must expand to a valid Arduino pin expression (numeric or A0-style).
 * @param {string} pinVal Raw field value from CLK/DT/SW dropdown.
 * @returns {string}
 */
function normalizeArduinoPin(pinVal) {
  const s = String(pinVal == null ? '' : pinVal).trim();
  if (/^A\d+$/i.test(s)) {
    return s;
  }
  const m = s.match(/(\d+)/);
  return m ? m[1] : s;
}

function addGenerator(Blockly) {

  // ================================
  // INIT
  // ================================
  Blockly.Arduino.rotaryencoder_init = function (block) {
    const clkPin = normalizeArduinoPin(block.getFieldValue('CLK_PIN'));
    const dtPin = normalizeArduinoPin(block.getFieldValue('DT_PIN'));
    const swPin = normalizeArduinoPin(block.getFieldValue('SW_PIN'));

    Blockly.Arduino.definitions_.rotaryencoder_pins = `
#define ENC_CLK ${clkPin}
#define ENC_DT  ${dtPin}
#define ENC_SW  ${swPin}
`;

    Blockly.Arduino.definitions_.rotaryencoder_vars = `
// NOTE:
// - Avoid Arduino String inside ISR (can allocate heap / crash).
// - Keep shared data volatile and read it atomically outside ISR.
#ifndef IRAM_ATTR
#define IRAM_ATTR
#endif

#if defined(ARDUINO_ARCH_AVR)
  // Uno/Nano (ATmega328P) ma external interrupt khali D2/D3 par hoy che.
  #if (ENC_CLK == 2) || (ENC_CLK == 3)
    #define ROTARYENCODER_USE_EXTI 1
  #else
    #define ROTARYENCODER_USE_EXTI 0
  #endif
#else
  // ESP32 / other boards: attachInterrupt badha GPIO par generally work kare che.
  #define ROTARYENCODER_USE_EXTI 1
#endif

volatile long encoderCount = 0;
volatile int8_t encoderDir = 0; // -1: CCW, 0: NONE, 1: CW
volatile uint8_t encoderPrevState = 0; // 2-bit: (CLK<<1)|DT
volatile int8_t encoderAcc = 0;        // accumulate transitions; +/-4 => 1 detent step

static inline uint8_t rotaryEncoderReadState() {
  uint8_t clk = (uint8_t)digitalRead(ENC_CLK);
  uint8_t dt  = (uint8_t)digitalRead(ENC_DT);
  return (uint8_t)((clk << 1) | dt);
}

static inline void rotaryEncoderApplyDelta(int8_t delta) {
  if (delta == 0) return;
  encoderAcc += delta;
  if (encoderAcc >= 4) {
    encoderCount++;
    encoderDir = 1;
    encoderAcc = 0;
  } else if (encoderAcc <= -4) {
    encoderCount--;
    encoderDir = -1;
    encoderAcc = 0;
  }
}

static void rotaryEncoderTick() {
#if !ROTARYENCODER_USE_EXTI
  // Polling fallback: works on any digital pin, but loop fast run thavu jaruri.
  const uint8_t state = rotaryEncoderReadState();
  const uint8_t idx = (uint8_t)((encoderPrevState << 2) | state);
  // Gray-code transition table (CW positive, CCW negative)
  // Valid single-step transitions produce +/-1, others 0 (bounce/invalid).
  static const int8_t tbl[16] = {
    0, -1,  1,  0,
    1,  0,  0, -1,
   -1,  0,  0,  1,
    0,  1, -1,  0
  };
  rotaryEncoderApplyDelta(tbl[idx]);
  encoderPrevState = state;
#endif
}

static long rotaryEncoderGetCount() {
  rotaryEncoderTick();
  noInterrupts();
  long c = encoderCount;
  interrupts();
  return c;
}

static String rotaryEncoderGetDirection() {
  rotaryEncoderTick();
  noInterrupts();
  int8_t d = encoderDir;
  interrupts();
  if (d > 0) return "Clockwise";
  if (d < 0) return "Anticlockwise";
  return "NONE";
}

static void rotaryEncoderResetCount() {
  noInterrupts();
  encoderCount = 0;
  encoderDir = 0;
  encoderAcc = 0;
  interrupts();
}
`;

    Blockly.Arduino.definitions_.rotaryencoder_isr = `
void IRAM_ATTR encoderISR() {
  const uint8_t state = rotaryEncoderReadState();
  const uint8_t idx = (uint8_t)((encoderPrevState << 2) | state);
  static const int8_t tbl[16] = {
    0, -1,  1,  0,
    1,  0,  0, -1,
   -1,  0,  0,  1,
    0,  1, -1,  0
  };
  rotaryEncoderApplyDelta(tbl[idx]);
  encoderPrevState = state;
}
`;

    Blockly.Arduino.setups_.rotaryencoder_setup = `
// ESP32: GPIO 34-39 have no internal pull-up/pull-down — use INPUT (+ external 10k to 3V3 if needed).
#if defined(ARDUINO_ARCH_ESP32)
  pinMode(ENC_CLK, (ENC_CLK >= 34 && ENC_CLK <= 39) ? INPUT : INPUT_PULLUP);
  pinMode(ENC_DT, (ENC_DT >= 34 && ENC_DT <= 39) ? INPUT : INPUT_PULLUP);
  pinMode(ENC_SW, (ENC_SW >= 34 && ENC_SW <= 39) ? INPUT : INPUT_PULLUP);
#else
  pinMode(ENC_CLK, INPUT_PULLUP);
  pinMode(ENC_DT, INPUT_PULLUP);
  pinMode(ENC_SW, INPUT_PULLUP);
#endif
#if ROTARYENCODER_USE_EXTI
  // CLK par mathi interrupt: DT-only Gray transitions miss thay che → ghanu vadhu 1 detent mate 2 click jevu lage.
  // ESP32/SAMD vagere par CLK+DT banne par CHANGE: full quadrature sync rey che.
  attachInterrupt(digitalPinToInterrupt(ENC_CLK), encoderISR, CHANGE);
#if !defined(ARDUINO_ARCH_AVR)
  attachInterrupt(digitalPinToInterrupt(ENC_DT), encoderISR, CHANGE);
#endif
#endif
encoderPrevState = rotaryEncoderReadState();
`;

    return '';
  };

  // ================================
  // GET COUNT
  // ================================
  Blockly.Arduino.rotaryencoder_getCount = function (block) {
    return ['rotaryEncoderGetCount()', Blockly.Arduino.ORDER_ATOMIC];
  };

  // ================================
  // RESET COUNT
  // ================================
  Blockly.Arduino.rotaryencoder_resetCount = function (block) {
    return 'rotaryEncoderResetCount();\n';
  };

  // ================================
  // DIRECTION
  // ================================
  Blockly.Arduino.rotaryencoder_direction = function (block) {
    return ['rotaryEncoderGetDirection()', Blockly.Arduino.ORDER_ATOMIC];
  };

  return Blockly;
}

module.exports = addGenerator;
