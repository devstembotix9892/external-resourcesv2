function addBlocks(Blockly) {

    const color = '#3F51B5';
    const secondaryColour = '#303F9F';

    // ===== BLE ROBOT BLOCK =====

    Blockly.Blocks.ble_robot_full = {
        init: function () {
            this.jsonInit({

                message0: "RC Car %1",

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


    Blockly.Blocks.ble_robot_full_1 = {
        init: function () {

            this.jsonInit({

                message0: "RC Car Dozzer %1",

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

    Blockly.Blocks.ble_robot_full_2 = {
        init: function () {

            this.jsonInit({

                message0: "RC Car Pen %1",

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

     Blockly.Blocks.ble_robot_full_3 = {
        init: function () {

            this.jsonInit({

                message0: "RC Car Soccer %1",

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
     Blockly.Blocks.ble_robot_full_4 = {
        init: function () {

            this.jsonInit({

                message0: "RC Car Gripper %1",

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
    return Blockly;
}

exports = addBlocks;
