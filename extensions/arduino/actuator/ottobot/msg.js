/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addMsg(Blockly) {
    Object.assign(Blockly.ScratchMsgs.locales.en, {
        OTTO_CATEGORY: 'Otto Robot',
        OTTO_HOME: 'Otto home',
        OTTO_WALK: 'Otto walk steps %1 time %2 direction %3',
        OTTO_MOONWALKER: 'Otto moonwalker repeat %1 times with speed %2 and height %3 in direction %4',
        OTTO_JUMP: 'Otto jump steps %1 time %2',
        OTTO_TURN: 'Otto turn steps %1 time %2 direction %3',
        OTTO_SHAKE_LEG: 'Otto shake leg steps %1 time %2 direction %3',
        OTTO_MOVE_COMMAND: 'Otto send BLE command %1'
    });

    Object.assign(Blockly.ScratchMsgs.locales['zh-cn'], {
        OTTO_CATEGORY: '奥托机器人',
        OTTO_HOME: 'Otto 复位',
        OTTO_WALK: 'Otto 行走 步骤 %1 时间 %2 方向 %3',
        OTTO_MOONWALKER: 'Otto 太空步重复 %1 次 速度 %2 高度 %3 方向 %4',
        OTTO_JUMP: 'Otto 跳跃 步骤 %1 时间 %2',
        OTTO_TURN: 'Otto 转向 步骤 %1 时间 %2 方向 %3',
        OTTO_SHAKE_LEG: 'Otto 摇腿 步骤 %1 时间 %2 方向 %3',
        OTTO_MOVE_COMMAND: 'Otto 发送 BLE 指令 %1'
    });

    return Blockly;
}

exports = addMsg;
