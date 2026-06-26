/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

function normalizeArduinoPin (pinVal) {
    const s = String(pinVal == null ? '' : pinVal).trim();
    if (/^A\d+$/i.test(s)) {
        return s;
    }
    const m = s.match(/(\d+)/);
    return m ? m[1] : s;
}

function portId (port) {
    return `p${String(port).replace(/[^0-9]/g, '') || '1'}`;
}

function ensurePortPinDef (Blockly, port, pinNum) {
    Blockly.Arduino.definitions_[`rgbled_portpin_${port}`] =
        `#define RGBLED_PIN_P${port} ${pinNum}`;
}

function ensureRgbLed (Blockly, port) {
    const id = portId(port);
    const pinKey = `rgbled_portpin_${port}`;

    if (!Blockly.Arduino.definitions_[pinKey]) {
        ensurePortPinDef(Blockly, port, 5);
    }

    Blockly.Arduino.includes_.rgbled_neopixel = '#include <Adafruit_NeoPixel.h>';

    if (!Blockly.Arduino.definitions_[`rgbled_px_${id}`]) {
        Blockly.Arduino.definitions_[`rgbled_px_${id}`] =
            `Adafruit_NeoPixel rgbled_px_${id}(1, RGBLED_PIN_P${port}, NEO_GRB + NEO_KHZ800);`;
        Blockly.Arduino.definitions_[`rgbled_rgb_${id}`] =
            `uint8_t rgbled_r_${id} = 0, rgbled_g_${id} = 0, rgbled_b_${id} = 0;`;
        Blockly.Arduino.definitions_[`rgbled_apply_${id}`] = `
void rgbled_apply_${id}() {
  rgbled_px_${id}.setPixelColor(0, rgbled_px_${id}.Color(rgbled_r_${id}, rgbled_g_${id}, rgbled_b_${id}));
  rgbled_px_${id}.show();
}`;
        Blockly.Arduino.setups_[`rgbled_begin_${id}`] = `rgbled_px_${id}.begin();`;
    }
    return id;
}

function channelVar (id, channel) {
    if (channel === 'G') return `rgbled_g_${id}`;
    if (channel === 'B') return `rgbled_b_${id}`;
    return `rgbled_r_${id}`;
}

function colorCode (Blockly, block, fieldName) {
    const order = Blockly.Arduino.ORDER_ATOMIC || 0;
    const raw = Blockly.Arduino.valueToCode(block, fieldName, order) || '0xff0000';
    return String(raw).replace(/'/g, '').replace('#', '0x');
}

function syncRgbFromHex (id, hexExpr) {
    return (
        `rgbled_r_${id} = (uint8_t)((${hexExpr}) >> 16);\n` +
        `rgbled_g_${id} = (uint8_t)((${hexExpr}) >> 8);\n` +
        `rgbled_b_${id} = (uint8_t)(${hexExpr});\n`
    );
}

function setRgbCode (id, r, g, b) {
    return (
        `rgbled_r_${id} = (uint8_t)constrain((${r}), 0, 255);\n` +
        `rgbled_g_${id} = (uint8_t)constrain((${g}), 0, 255);\n` +
        `rgbled_b_${id} = (uint8_t)constrain((${b}), 0, 255);\n` +
        `rgbled_apply_${id}();\n`
    );
}

function readRgb (Blockly, block) {
    const order = Blockly.Arduino.ORDER_ATOMIC || 0;
    return {
        r: Blockly.Arduino.valueToCode(block, 'R', order) || '0',
        g: Blockly.Arduino.valueToCode(block, 'G', order) || '0',
        b: Blockly.Arduino.valueToCode(block, 'B', order) || '0'
    };
}

function addGenerator (Blockly) {
    const order = Blockly.Arduino.ORDER_ATOMIC || 0;

    Blockly.Arduino.rgbled_init = function (block) {
        const port = block.getFieldValue('PORT');
        const pin = normalizeArduinoPin(block.getFieldValue('PIN'));
        ensurePortPinDef(Blockly, port, pin);
        ensureRgbLed(Blockly, port);
        return '';
    };

    Blockly.Arduino.rgbled_lightUp = function (block) {
        const port = block.getFieldValue('PORT');
        const hex = colorCode(Blockly, block, 'COLOR');
        const id = ensureRgbLed(Blockly, port);
        return syncRgbFromHex(id, hex) + `rgbled_apply_${id}();\n`;
    };

    Blockly.Arduino.rgbled_lightUpForSecs = function (block) {
        const port = block.getFieldValue('PORT');
        const hex = colorCode(Blockly, block, 'COLOR');
        const secs = Blockly.Arduino.valueToCode(block, 'SECS', order) || '1';
        const id = ensureRgbLed(Blockly, port);
        return (
            syncRgbFromHex(id, hex) +
            `rgbled_apply_${id}();\n` +
            `delay((unsigned long)((${secs}) * 1000));\n` +
            `rgbled_r_${id} = 0;\nrgbled_g_${id} = 0;\nrgbled_b_${id} = 0;\n` +
            `rgbled_apply_${id}();\n`
        );
    };

    Blockly.Arduino.rgbled_setColor = function (block) {
        const port = block.getFieldValue('PORT');
        const { r, g, b } = readRgb(Blockly, block);
        const id = ensureRgbLed(Blockly, port);
        return setRgbCode(id, r, g, b);
    };

    Blockly.Arduino.rgbled_lightOff = function (block) {
        const port = block.getFieldValue('PORT');
        const id = ensureRgbLed(Blockly, port);
        return (
            `rgbled_r_${id} = 0;\nrgbled_g_${id} = 0;\nrgbled_b_${id} = 0;\n` +
            `rgbled_apply_${id}();\n`
        );
    };

    Blockly.Arduino.rgbled_setChannel = function (block) {
        const port = block.getFieldValue('PORT');
        const channel = block.getFieldValue('CHANNEL');
        const value = Blockly.Arduino.valueToCode(block, 'VALUE', order) || '0';
        const id = ensureRgbLed(Blockly, port);
        const ch = channelVar(id, channel);
        return `${ch} = (uint8_t)constrain((${value}), 0, 255);\nrgbled_apply_${id}();\n`;
    };

    Blockly.Arduino.rgbled_changeChannel = function (block) {
        const port = block.getFieldValue('PORT');
        const channel = block.getFieldValue('CHANNEL');
        const delta = Blockly.Arduino.valueToCode(block, 'DELTA', order) || '0';
        const id = ensureRgbLed(Blockly, port);
        const ch = channelVar(id, channel);
        return `${ch} = (uint8_t)constrain((int)${ch} + (int)(${delta}), 0, 255);\nrgbled_apply_${id}();\n`;
    };

    Blockly.Arduino.rgbled_getChannel = function (block) {
        const port = block.getFieldValue('PORT');
        const channel = block.getFieldValue('CHANNEL');
        const id = ensureRgbLed(Blockly, port);
        const code = channelVar(id, channel);
        return [code, order];
    };

    return Blockly;
}

module.exports = addGenerator;
