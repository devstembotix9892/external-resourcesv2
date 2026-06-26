/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

function normalizeLcdPin (pinVal) {
    const s = String(pinVal == null ? '' : pinVal).trim();
    if (/^A\d+$/i.test(s)) {
        return s.toUpperCase();
    }
    const m = s.match(/(\d+)/);
    return m ? m[1] : s;
}

function addGenerator (Blockly) {
    Blockly.Arduino.lcd_init = function (block) {
        const addr = block.getFieldValue('ADDR');
        const sda = normalizeLcdPin(block.getFieldValue('SDA'));
        const scl = normalizeLcdPin(block.getFieldValue('SCL'));

        Blockly.Arduino.includes_.lcd_init = `#include <Wire.h>\n#include <LiquidCrystal_I2C.h>`;
        Blockly.Arduino.definitions_.lcd_init = `LiquidCrystal_I2C lcd(${addr}, 16, 2);`;

        Blockly.Arduino.setups_.lcd_wire = `
#if defined(ARDUINO_ARCH_ESP32)
Wire.begin(${sda}, ${scl});
#else
Wire.begin();
#endif
lcd.begin(16, 2);
`;

        return '';
    };

    Blockly.Arduino.lcd_setCursorPosition = function (block) {
        const x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC);
        const y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC);

        return `lcd.setCursor(${x}, ${y});\n`;
    };

    Blockly.Arduino.lcd_print = function (block) {
        const data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_ATOMIC);

        return `lcd.print(${data});\n`;
    };

    Blockly.Arduino.lcd_clear = function () {
        return `lcd.clear();\n`;
    };

    Blockly.Arduino.lcd_setBackLight = function (block) {
        const state = block.getFieldValue('STATE');

        if (state === 'on') {
            return `lcd.backlight();\n`;
        }
        return `lcd.noBacklight();\n`;
    };

    Blockly.Arduino.lcd_setCursorStyle = function (block) {
        const state = block.getFieldValue('STATE');
        const style = block.getFieldValue('STYLE');

        let code = '';

        if (state === 'display') {
            code += `lcd.cursor();\n`;
        } else {
            code += `lcd.noCursor();\n`;
        }

        if (style === 'blink') {
            code += `lcd.blink();\n`;
        } else {
            code += `lcd.noBlink();\n`;
        }

        return code;
    };

    Blockly.Arduino.lcd_scrollDisplay = function (block) {
        const dir = block.getFieldValue('DIR');
        if (dir === 'left') {
            return `lcd.scrollDisplayLeft();\n`;
        }
        return `lcd.scrollDisplayRight();\n`;
    };

    return Blockly;
}

exports = addGenerator;
