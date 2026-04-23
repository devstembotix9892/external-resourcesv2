// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addBlocks (Blockly) {
//     const color = '#FF8C00';
//     const secondaryColour = '#FFB733';

//     // Init block
//     Blockly.Blocks.ledmatrix_init = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_INIT,
//                 args0: [
//                     {
//                         type: 'field_dropdown',
//                         name: 'PIN',
//                         options: [['0','0'],['1','1'],['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'],['9','9']]
//                     },
//                     {
//                         type: 'input_value',
//                         name: 'NUM_LEDS'
//                     },
//                     {
//                         type: 'input_value',
//                         name: 'BRIGHTNESS'
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     // Show digit block
//     Blockly.Blocks.ledmatrix_showDigit = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_SHOWDIGIT,
//                 args0: [
//                     {
//                         type: 'input_value',
//                         name: 'DIGIT'
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     // Show letter block (A–Z)
//     Blockly.Blocks.ledmatrix_showChar = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_SHOWCHAR || 'Show Letter %1',
//                 args0: [
//                     {
//                         type: 'field_dropdown',
//                         name: 'CHAR',
//                         options: [
//                             ['A','A'],['B','B'],['C','C'],['D','D'],['E','E'],['F','F'],['G','G'],
//                             ['H','H'],['I','I'],['J','J'],['K','K'],['L','L'],['M','M'],['N','N'],
//                             ['O','O'],['P','P'],['Q','Q'],['R','R'],['S','S'],['T','T'],['U','U'],
//                             ['V','V'],['W','W'],['X','X'],['Y','Y'],['Z','Z']
//                         ]
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     return Blockly;
// }

// exports = addBlocks;

// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addBlocks (Blockly) {
//     const color = '#FF8C00';
//     const secondaryColour = '#FFB733';

//     // Init block
//     Blockly.Blocks.ledmatrix_init = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_INIT,
//                 args0: [
//                     {
//                         type: 'field_dropdown',
//                         name: 'PIN',
//                         options: [
//                             ['0','0'],['1','1'],['2','2'], ['3','3'],
//                             ['4','4'], ['5','5'], ['6','6'], ['7','7'],
//                             ['8','8'],['9','9']
//                         ]
//                     },
//                     {
//                         type: 'input_value',
//                         name: 'NUM_LEDS'
//                     },
//                     {
//                         type: 'input_value',
//                         name: 'BRIGHTNESS'
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     // Show digit block
//     Blockly.Blocks.ledmatrix_showDigit = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_SHOWDIGIT || 'Show Digit %1',
//                 args0: [
//                     {
//                         type: 'input_value',
//                         name: 'DIGIT'
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     // Show letter block (A–Z)
//     Blockly.Blocks.ledmatrix_showChar = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_SHOWCHAR || 'Show Letter %1',
//                 args0: [
//                     {
//                         type: 'field_dropdown',
//                         name: 'CHAR',
//                         options: [
//                             ['A','A'],['B','B'],['C','C'],['D','D'],['E','E'],['F','F'],['G','G'],
//                             ['H','H'],['I','I'],['J','J'],['K','K'],['L','L'],['M','M'],['N','N'],
//                             ['O','O'],['P','P'],['Q','Q'],['R','R'],['S','S'],['T','T'],['U','U'],
//                             ['V','V'],['W','W'],['X','X'],['Y','Y'],['Z','Z']
//                         ]
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     // Show symbol block (Heart, Smile)
//     Blockly.Blocks.ledmatrix_showSymbol = {
//         init: function () {
//             this.jsonInit({
//                 message0: Blockly.Msg.LEDMATRIX_SHOWSYMBOL || 'Show Symbol %1',
//                 args0: [
//                     {
//                         type: 'field_dropdown',
//                         name: 'SYMBOL',
//                         options: [
//                             ['♥ Heart', '*'],
//                             ['☺ Smile', ':']
//                         ]
//                     }
//                 ],
//                 colour: color,
//                 secondaryColour: secondaryColour,
//                 extensions: ['shape_statement']
//             });
//         }
//     };

//     return Blockly;
// }

// exports = addBlocks;

/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addBlocks (Blockly) {
    const color = '#FF8C00';
    const secondaryColour = '#FFB733';

    // Init block
    Blockly.Blocks.ledmatrix_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LEDMATRIX_INIT,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'PIN',
                        options: [
                            ['0','0'],['1','1'],['2','2'], ['3','3'],
                            ['4','4'], ['5','5'], ['6','6'], ['7','7'],
                            ['8','8'],['9','9']
                        ]
                    },
                    { type: 'input_value', name: 'NUM_LEDS' },
                    { type: 'input_value', name: 'BRIGHTNESS' }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // Show digit block
    Blockly.Blocks.ledmatrix_showDigit = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LEDMATRIX_SHOWDIGIT,
                args0: [{ type: 'input_value', name: 'DIGIT' }],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // Show A–Z
    Blockly.Blocks.ledmatrix_showChar = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LEDMATRIX_SHOWCHAR,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'CHAR',
                        options: [
                            ['A','A'],['B','B'],['C','C'],['D','D'],['E','E'],['F','F'],['G','G'],
                            ['H','H'],['I','I'],['J','J'],['K','K'],['L','L'],['M','M'],['N','N'],
                            ['O','O'],['P','P'],['Q','Q'],['R','R'],['S','S'],['T','T'],['U','U'],
                            ['V','V'],['W','W'],['X','X'],['Y','Y'],['Z','Z']
                        ]
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    // Symbol block
    Blockly.Blocks.ledmatrix_showSymbol = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LEDMATRIX_SHOWSYMBOL,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'SYMBOL',
                        options: [
                            ['♥ Heart', '*'],
                            ['☺ Smile', ':']
                        ]
                    }
                ],
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.ledmatrix_draw = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LEDMATRIX_DRAWCUSTOM,
                args0: [
                    {
                        type: "field_matrix",
                        name: "MATRIX",
                        value: "0000000000000000000000000000000000000"
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
