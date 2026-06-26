function addToolbox() {
  return `

<category name="%{BKY_BLE_ROBOT_CATEGORY}" id="BLE_ROBOT_CATEGORY" colour="#3F51B5" secondaryColour="#303F9F">


  <block type="bt_connect"></block>

  <block type="bt_name">
    <value name="NAME">
      <shadow type="text">
        <field name="TEXT">MyCar</field>
      </shadow>
    </value>
  </block>

  <block type="motor_setup">
  <field name="MOTOR1">M1</field>
  <field name="MOTOR2">M2</field>
</block>

<block type="set_speed">
  <value name="SPEED">
    <shadow type="math_number">
      <field name="NUM">200</field>
    </shadow>
  </value>
</block>

<block type="set_servo">
  <value name="ANGLE">
    <shadow type="math_number">
      <field name="NUM">90</field>
    </shadow>
  </value>
</block>


</category>

`;
}

exports = addToolbox;