function addBlocks(Blockly) {

    const color = '#3F51B5';
    const secondaryColour = '#303F9F';

    // =========================
    // 1. BLUETOOTH CONNECT
    // =========================
    Blockly.Blocks.bt_connect = {
        init: function () {
            this.jsonInit({
                message0: "Bluetooth Connect",
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ["shape_statement"]
            });
        }
    };

    // =========================
    // 2. SET NAME
    // =========================
    Blockly.Blocks.bt_name = {
        init: function () {
            this.jsonInit({
                message0: "Set Name %1",
                args0: [
                    {
                        type: "input_value",
                        name: "NAME"
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ["shape_statement"]
            });
        }
    };

    // =========================
    // 3. MOTOR SETUP (4 MOTOR)
    // =========================
Blockly.Blocks.motor_setup = {
    init: function () {
        this.jsonInit({
            message0: "Motor Setup %1 %2",
            args0: [
                {
                    type: "field_dropdown",
                    name: "MOTOR1",
                    options: [
                        ["M1", "M1"],
                        ["M2", "M2"],
                        ["M3", "M3"],
                        ["M4", "M4"]
                    ]
                },
                {
                    type: "field_dropdown",
                    name: "MOTOR2",
                    options: [
                        ["M1", "M1"],
                        ["M2", "M2"],
                        ["M3", "M3"],
                        ["M4", "M4"]
                    ]
                }
            ],
            colour: color,
            secondaryColour: secondaryColour,
            extensions: ["shape_statement"]
        });
    }
};

    // =========================
    // 4. SPEED CONTROL
    // =========================
Blockly.Blocks.set_speed = {
    init: function () {

        this.jsonInit({
            message0: "Set Speed %1",
            args0: [
                {
                    type: "input_value",
                    name: "SPEED"
                }
            ],
            colour: color,
            secondaryColour: secondaryColour,
            extensions: ["shape_statement"]
        });

    }
};

Blockly.Blocks.set_servo = {
    init: function () {
        this.jsonInit({
            message0: "Set Servo Pin %1 Angle %2",
            args0: [
                {
                    type: "field_dropdown",
                    name: "PIN",
                    options: [
                        ["5", "5"],
                        ["14", "14"],
                        ["32", "32"],
                        ["33", "33"]
                    ]
                },
                {
                    type: "input_value",
                    name: "ANGLE"
                }
            ],
            colour: color,
            secondaryColour: secondaryColour,
            extensions: ["shape_statement"]
        });
    }
};
    // Blockly.Blocks.ble_robot_full_1 = {
    //     init: function () {

    //         this.jsonInit({

    //             message0: "RC Car Dozzer %1",

    //             args0: [
    //                 {
    //                     type: "input_value",
    //                     name: "NAME"
    //                 }
    //             ],

    //             colour: color,
    //             secondaryColour: secondaryColour,
    //             extensions: ["shape_statement"]

    //         });

    //     }
    // };

    // Blockly.Blocks.ble_robot_full_2 = {
    //     init: function () {

    //         this.jsonInit({

    //             message0: "RC Car Pen %1",

    //             args0: [
    //                 {
    //                     type: "input_value",
    //                     name: "NAME"
    //                 }
    //             ],

    //             colour: color,
    //             secondaryColour: secondaryColour,
    //             extensions: ["shape_statement"]

    //         });

    //     }
    // };

    //  Blockly.Blocks.ble_robot_full_3 = {
    //     init: function () {

    //         this.jsonInit({

    //             message0: "RC Car Soccer %1",

    //             args0: [
    //                 {
    //                     type: "input_value",
    //                     name: "NAME"
    //                 }
    //             ],

    //             colour: color,
    //             secondaryColour: secondaryColour,
    //             extensions: ["shape_statement"]

    //         });

    //     }
    // };
    //  Blockly.Blocks.ble_robot_full_4 = {
    //     init: function () {

    //         this.jsonInit({

    //             message0: "RC Car Gripper %1",

    //             args0: [
    //                 {
    //                     type: "input_value",
    //                     name: "NAME"
    //                 }
    //             ],

    //             colour: color,
    //             secondaryColour: secondaryColour,
    //             extensions: ["shape_statement"]

    //         });

    //     }
    // };
    return Blockly;
}

exports = addBlocks;
