// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
// function addToolbox () {
//     return `
// <category name="%{BKY_COLOR_SENSOR_CATEGORY}" id="COLOR_SENSOR_CATEGORY" colour="#0099FF" secondaryColour="#33CCFF">
//     <block type="color_sensor_init"></block>
   
//     <block type="color_sensor_read"></block>
//     <block type="color_sensor_is_color"></block>

// </category>
// `;
// }

// exports = addToolbox;
// //  <block type="color_sensor_value"></block>


/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addToolbox () {
    return `
<category
    name="%{BKY_COLOR_SENSOR_CATEGORY}"
    id="COLOR_SENSOR_CATEGORY"
    colour="#0099FF"
    secondaryColour="#33CCFF">

    <!-- INIT -->
    <block type="color_sensor_init"></block>

    <!-- READ RAW SENSOR -->
    <block type="color_sensor_read"></block>

    <!-- DETECTED COLOR (REPORTER STRING) -->
    <block type="color_sensor_detect_color"></block>

    <!-- IS COLOR ? (BOOLEAN / IF BLOCK) -->
    <block type="color_sensor_is_color"></block>
    

</category>
`;
}

exports = addToolbox;
