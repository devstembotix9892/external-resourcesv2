/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addMsg(Blockly) {
    Object.assign(Blockly.ScratchMsgs.locales.en, {
        MOTOR_CATEGORY: 'DC Motor',
        MOTOR_INIT: 'init motor at pin1 %1 and pin2 %2',
        MOTOR_ROTATE: 'rotate motor %1 direction',
    });

    Object.assign(Blockly.ScratchMsgs.locales['zh-cn'], {
        MOTOR_CATEGORY: '直流电机',
        MOTOR_INIT: '初始化电机 在引脚1 %1 和 引脚2 %2',
        MOTOR_ROTATE: '旋转电机 %1 方向',
    });

    return Blockly;
}

exports = addMsg;
