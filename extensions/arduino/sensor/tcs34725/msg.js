// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addMsg (Blockly) {
//     Object.assign(Blockly.ScratchMsgs.locales.en, {
//         COLOR_SENSOR_CATEGORY: 'Color Sensor',
//         COLOR_SENSOR_INIT: 'init TCS34725 color sensor',
//         COLOR_SENSOR_READ: 'read TCS34725 values (R,G,B,C,Temp,Lux)'
//     });
//     Object.assign(Blockly.ScratchMsgs.locales['zh-cn'], {
//         COLOR_SENSOR_CATEGORY: '颜色传感器',
//         COLOR_SENSOR_INIT: '初始化 TCS34725 颜色传感器',
//         COLOR_SENSOR_READ: '读取 TCS34725 值 (R,G,B,C,Temp,Lux)'
//     });
//     return Blockly;
// }

// exports = addMsg;



/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addMsg (Blockly) {

    // ================= ENGLISH =================
    Object.assign(Blockly.ScratchMsgs.locales.en, {
        COLOR_SENSOR_CATEGORY: 'Color Sensor',

        COLOR_SENSOR_INIT: 'init TCS34725 color sensor',
        COLOR_SENSOR_READ: 'read TCS34725 values (R, G, B, C, Temp, Lux)',

        // 🆕 NEW BLOCK MESSAGES
        COLOR_SENSOR_DETECT_COLOR: 'TCS34725 detected color',
        COLOR_SENSOR_IS_COLOR: 'is TCS34725 color %1 ?'
    });

    // ================= CHINESE =================
    Object.assign(Blockly.ScratchMsgs.locales['zh-cn'], {
        COLOR_SENSOR_CATEGORY: '颜色传感器',

        COLOR_SENSOR_INIT: '初始化 TCS34725 颜色传感器',
        COLOR_SENSOR_READ: '读取 TCS34725 值 (R, G, B, C, 温度, 光照)',

        // 🆕 NEW BLOCK MESSAGES
        COLOR_SENSOR_DETECT_COLOR: 'TCS34725 检测到的颜色',
        COLOR_SENSOR_IS_COLOR: 'TCS34725 的颜色是 %1 吗？'
    });

    return Blockly;
}

exports = addMsg;
