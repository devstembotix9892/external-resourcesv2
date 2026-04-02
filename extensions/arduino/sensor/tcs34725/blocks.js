// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addBlocks (Blockly) {
//     Blockly.Blocks.color_sensor_init = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.ScratchMsgs.locales.en.COLOR_SENSOR_INIT,
//                 colour: '#0099FF',
//                 nextStatement: null,
//                 previousStatement: null
//             });
//         }
//     };

//     Blockly.Blocks.color_sensor_read = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.ScratchMsgs.locales.en.COLOR_SENSOR_READ,
//                 colour: '#0099FF',
//                 nextStatement: null,
//                 previousStatement: null
//             });
//         }
//     };

// //     Blockly.Blocks.color_sensor_value = {
// //     init: function () {
// //         this.jsonInit({
// //             message0: 'read color %1 value',
// //             args0: [
// //                 {
// //                     type: 'field_dropdown',
// //                     name: 'COLOR',
// //                     options: [
// //                         ['R', 'R'],
// //                         ['G', 'G'],
// //                         ['B', 'B']
// //                     ]
// //                 }
// //             ],
// //             outputShape: Blockly.OUTPUT_SHAPE_ROUND, // 🔵 Rounded shape
// //             output: 'Number', // Returns a number
// //             colour: '#0099FF',
// //             tooltip: 'Read selected color value (R, G, or B)',
// //             helpUrl: ''
// //         });
// //     }
// // };

// Blockly.Blocks.color_sensor_is_color = {
//     init: function () {
//         this.jsonInit({
//             message0: 'is TCS34725 color %1 ?',
//             args0: [
//                 {
//                     type: 'field_dropdown',
//                     name: 'COLOR',
//                     options: [
//                         ['Red', 'RED'],
//                         ['Green', 'GREEN'],
//                         ['Blue', 'BLUE']
//                     ]
//                 }
//             ],
//             output: 'Boolean',
//             outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL, // ✅ IF shape
//             colour: '#0099FF',
//             tooltip: 'Check detected color',
//             helpUrl: ''
//         });
//     }
// };




//     return Blockly;
// }

// exports = addBlocks;


// //     Blockly.Blocks.color_sensor_read = {
// //     init: function () {
// //         this.jsonInit({
// //             message0: 'read color %1 value',
// //             args0: [
// //                 {
// //                     type: 'field_dropdown',
// //                     name: 'COLOR',
// //                     options: [
// //                         ['R', 'R'],
// //                         ['G', 'G'],
// //                         ['B', 'B']
// //                     ]
// //                 }
// //             ],
// //             outputShape: Blockly.OUTPUT_SHAPE_ROUND, // ensures round shape in Scratch/OpenBlock
// //             output: 'Number', // 🟢 Rounded block shape
// //             colour: '#0099FF',
// //             tooltip: 'Read selected color value (R, G, or B)',
// //             helpUrl: ''
// //         });
// //     }
// // };


function addBlocks (Blockly) {
        Blockly.Blocks.color_sensor_init = {
            init: function () {
                this.jsonInit({
                    message0: 'init TCS34725 color sensor',
                    previousStatement: null,
                    nextStatement: null,
                    colour: '#0099FF'
                });
            }
        };

        Blockly.Blocks.color_sensor_read = {
            init: function () {
                this.jsonInit({
                    message0: 'read TCS34725 color',
                    previousStatement: null,
                    nextStatement: null,
                    colour: '#0099FF'
                });
            }
        };
        Blockly.Blocks.color_sensor_detect_color = {
            init: function () {
                this.jsonInit({
                    message0: 'TCS34725 detected color',
                    output: 'String',
                    outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                    colour: '#0099FF',
                    tooltip: 'Returns detected color name'
                });
            }
        };


        Blockly.Blocks.color_sensor_is_color = {
            init: function () {
                this.jsonInit({
                    message0: 'is TCS34725 color %1 ?',
                    args0: [
                        {
                            type: 'field_dropdown',
                            name: 'COLOR',
                            options: [
                                ['Red', 'RED'],
                                ['Green', 'GREEN'],
                                ['Blue', 'BLUE'],
                                ['Yellow', 'YELLOW']
                            ]
                        }
                    ],
                    output: 'Boolean',
                    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
                    colour: '#0099FF'
                });
            }
        };

return Blockly;
}

exports = addBlocks;
