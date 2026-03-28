function addMsg(Blockly) {

    Object.assign(Blockly.ScratchMsgs.locales.en, {

        BLE_ROBOT_CATEGORY: 'BLE Robot',

        BLE_ROBOT_FULL: 'RC Car Servo Robot %1',
        BLE_ROBOT_FULL_1: 'RC Car Dozzer %1',
        BLE_ROBOT_FULL_2: 'RC Car Pen %1',
        BLE_ROBOT_FULL_3: 'RC Car Soccer %1',
        BLE_ROBOT_FULL_4: 'RC Car Gripper %1',

        

    });

    Object.assign(Blockly.ScratchMsgs.locales['zh-cn'], {

        BLE_ROBOT_CATEGORY: '蓝牙机器人',

        BLE_ROBOT_FULL: 'RC 伺服机器人 %1',
        BLE_ROBOT_FULL_1: 'RC 推土机 %1',
        BLE_ROBOT_FULL_2: 'RC 画笔 %1',
        BLE_ROBOT_FULL_3: 'RC 足球 %1',
        BLE_ROBOT_FULL_4: 'RC 夹爪 %1',

    });

    return Blockly;
}

exports = addMsg;