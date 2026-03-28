/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
function addToolbox() {
    return `
<category name="%{BKY_MOTOR_CATEGORY}" id="MOTOR_CATEGORY" colour="#FF8C00" secondaryColour="#FFA94D">
    <block type="motor_init">
        <field name="PIN1">8</field>
        <field name="PIN2">12</field>
    </block>
    <block type="motor_rotate">
        <field name="DIRECTION">CW</field>
    </block>
</category>
`;
}

exports = addToolbox;
