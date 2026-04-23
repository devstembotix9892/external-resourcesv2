/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addGenerator (Blockly) {
    // Blockly.Arduino.stembotixLCD_init = function (block) {
    //     const de = block.getFieldValue('DE');
    //     const csn = block.getFieldValue('CSN');
    //     // const id = Blockly.Arduino.valueToCode(block, 'RST', Blockly.Arduino.ORDER_ATOMIC);
    //     const rst = block.getFieldValue('RST');

    //     Blockly.Arduino.includes_.stembotixLCD_init = `#include <Adafruit_GFX.h>\n#include <Adafruit_ST7735.h>\n#include <SPI.h>`;
    //     // Blockly.Arduino.definitions_.stembotixLCD_init = `Openblock_nrf stembotixLCD;`;
    //     // Blockly.Arduino.definitions_.stembotixLCD_init = `Blockzie stembotixLCD;`;

    //     return `stembotixLCD.init(${rst}, ${de}, ${csn});\n`;
    // };

    Blockly.Arduino.sdisplay_init = function (block) {
        const csn = block.getFieldValue('CSN');   // Chip Select pin
        const rst = block.getFieldValue('RST'); // Reset pin
        const dc = block.getFieldValue('DE');   // Data/Command pin
    
        // Include necessary libraries
        Blockly.Arduino.includes_.sdisplay_init =
            `#include <Adafruit_GFX.h>\n` +
            `#include <Adafruit_ST7735.h>\n` ;
            // `#include <SPI.h>\n` +
            `#include "image_data.h"\n` ;
          

        
        // Define pinsx
        Blockly.Arduino.definitions_.sdisplay_pins =
            `#define TFT_CSN ${csn}\n` +
            `#define TFT_RST ${rst}\n` +
            `#define TFT_DC ${dc}\n`;
    
        // Declare the TFT object globally
        Blockly.Arduino.definitions_.sdisplay_object =
            `Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CSN, TFT_DC, TFT_RST);\n`;
    
        // Initialize the TFT screen in setup
        Blockly.Arduino.setups_.sdisplay_init =
        `Serial.begin(115200);\n`;
        
        
        // `tft.println("Hello STEMbotix!");\n`; 
        
    };
    
    // Blockly.Arduino.stembotixLCD_sendString = function (block) {
    //     const data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_ATOMIC);
    //     // const id = Blockly.Arduino.valueToCode(block, 'ID', Blockly.Arduino.ORDER_ATOMIC);

    //     return `stembotixLCD.sendString(${data});\n`;
    // };

    Blockly.Arduino.sdisplay_sendString = function (block) {
        var data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_ATOMIC) || '""';
    
        return `sdisplay.print(${data});\n`;
    };
    
    Blockly.Arduino.sdisplay_type = function (block) {
        var lcdType = block.getFieldValue('TYPE') || 'INITR_BLACKTAB'; // Default to INITR_BLACKTAB
    
        return `sdisplay.initR(${lcdType});\n`;
    };

    Blockly.Arduino['sdisplay_initDisplay'] = function (block) {
        var code = 'Serial.println("Initializing Display...");\n';
                  
        return code;
    };
    
    Blockly.Arduino['sdisplay_setTextColor'] = function (block) {
        var color = block.getFieldValue('COLOR');
        var code = 'sdisplay.setTextColor(' + color + ');\n';
        return code;
    };
    
    Blockly.Arduino['sdisplay_setTextSize'] = function (block) {
        var size = Blockly.Arduino.valueToCode(block, 'SIZE', Blockly.Arduino.ORDER_ATOMIC);
        var code = 'sdisplay.setTextSize(' + size + ');\n';
        return code;
    };
    
    Blockly.Arduino['sdisplay_setCursor'] = function (block) {
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC);
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC);
        var code = 'sdisplay.setCursor(' + x + ', ' + y + ');\n';
        return code;
    };

    Blockly.Arduino['sdisplay_fillScreen'] = function (block) {
        var color = block.getFieldValue('COLOR');
        // Convert the selected color into a suitable Arduino value (like a predefined color constant)
        var code = 'sdisplay.fillScreen(' + color + ');\n';
        return code;
    };

    Blockly.Arduino['sdisplay_setRotation'] = function (block) {
        var rotation = block.getFieldValue('ROTATION');
        var code = 'sdisplay.setRotation(' + rotation + ');\n';
        return code;
    };

    Blockly.Arduino['sdisplay_clearDisplay'] = function (block) {
        var code = 'sdisplay.fillScreen(ST77XX_BLACK);\n';
        return code;
    };

    Blockly.Arduino['sdisplay_showImage'] = function (block) {
        // Get the selected image from the dropdown
        var image = block.getFieldValue('IMAGE');
    
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || 0;

        // Generate the code to show the selected image on the display
        const code = `sdisplay.drawBitmap(${x}, ${y}, ${image}, 128, 128, ST77XX_BLACK);\n`;
        return code;
    };
    
    Blockly.Arduino['sdisplay_showEmoji'] = function (block) {
        var emoji = block.getFieldValue('EMOJI'); // like "emoji_smile"
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0';
        // Draw bitmap using the selected emoji data
        const code = `sdisplay.drawBitmap(${x}, ${y}, ${emoji}, 128, 128, ST77XX_BLACK);\n`;
        return code;
    };

    // Blockly.Arduino['sdisplay_showEmoji'] = function(block) {
    //     var dropdown_emoji = block.getFieldValue('EMOJI');
    //     var size = block.getFieldValue('SIZE');
    //     var value_x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0';
    //     var value_y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0';
    //     var color = block.getFieldValue('COLOR');
    //     var background = block.getFieldValue('BACKGROUND');   // <-- dropdown value direct lo

    //     var code = 'displayEmoji(' + dropdown_emoji + ', ' + value_x + ', ' + value_y + ', ' +
    //                 size + ', ' + color + ', ' + background + ');\n';
    //     return code;
    // };


    Blockly.Arduino['sdisplay_drawLine'] = function(block) {
        var x1 = Blockly.Arduino.valueToCode(block, 'X1', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y1 = Blockly.Arduino.valueToCode(block, 'Y1', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var x2 = Blockly.Arduino.valueToCode(block, 'X2', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y2 = Blockly.Arduino.valueToCode(block, 'Y2', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = `sdisplay.drawLine(${x1}, ${y1}, ${x2}, ${y2}, ${color});\n`;
        return code;
    };

        // Rectangle
    Blockly.Arduino['sdisplay_rectangle'] = function (block) {
        var mode = block.getFieldValue('MODE');
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var w = Blockly.Arduino.valueToCode(block, 'W', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var h = Blockly.Arduino.valueToCode(block, 'H', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = (mode === 'FILL')
            ? `sdisplay.fillRect(${x}, ${y}, ${w}, ${h}, ${color});\n`
            : `sdisplay.drawRect(${x}, ${y}, ${w}, ${h}, ${color});\n`;
        return code;
    };

    // Round Rectangle
    Blockly.Arduino['sdisplay_roundrect'] = function (block) {
        var mode = block.getFieldValue('MODE');
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var w = Blockly.Arduino.valueToCode(block, 'W', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var h = Blockly.Arduino.valueToCode(block, 'H', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var r = Blockly.Arduino.valueToCode(block, 'R', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = (mode === 'FILL')
            ? `sdisplay.fillRoundRect(${x}, ${y}, ${w}, ${h}, ${r}, ${color});\n`
            : `sdisplay.drawRoundRect(${x}, ${y}, ${w}, ${h}, ${r}, ${color});\n`;
        return code;
    };

    // Circle
    Blockly.Arduino['sdisplay_circle'] = function (block) {
        var mode = block.getFieldValue('MODE');
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var r = Blockly.Arduino.valueToCode(block, 'R', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = (mode === 'FILL')
            ? `sdisplay.fillCircle(${x}, ${y}, ${r}, ${color});\n`
            : `sdisplay.drawCircle(${x}, ${y}, ${r}, ${color});\n`;
        return code;
    };

    // Ellipse (Adafruit GFX ma direct ellipse nathi – tamare drawEllipse custom function hoy to use thashe)
    // If no ellipse API, either ignore or implement via circle scaling

    Blockly.Arduino['sdisplay_ellipse'] = function (block) {
        var mode = block.getFieldValue('MODE');
        var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var xl = Blockly.Arduino.valueToCode(block, 'XL', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var yl = Blockly.Arduino.valueToCode(block, 'YL', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = (mode === 'FILL')
            ? `sdisplay.fillEllipse(${x}, ${y}, ${xl}, ${yl}, ${color});\n`
            : `sdisplay.drawEllipse(${x}, ${y}, ${xl}, ${yl}, ${color});\n`;
        return code;
    };

    // Triangle
    Blockly.Arduino['sdisplay_triangle'] = function (block) {
        var mode = block.getFieldValue('MODE');
        var x1 = Blockly.Arduino.valueToCode(block, 'X1', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y1 = Blockly.Arduino.valueToCode(block, 'Y1', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var x2 = Blockly.Arduino.valueToCode(block, 'X2', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y2 = Blockly.Arduino.valueToCode(block, 'Y2', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var x3 = Blockly.Arduino.valueToCode(block, 'X3', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var y3 = Blockly.Arduino.valueToCode(block, 'Y3', Blockly.Arduino.ORDER_ATOMIC) || 0;
        var color = block.getFieldValue('COLOR');

        var code = (mode === 'FILL')
            ? `sdisplay.fillTriangle(${x1}, ${y1}, ${x2}, ${y2}, ${x3}, ${y3}, ${color});\n`
            : `sdisplay.drawTriangle(${x1}, ${y1}, ${x2}, ${y2}, ${x3}, ${y3}, ${color});\n`;
        return code;
    };

    return Blockly;
}

exports = addGenerator;
