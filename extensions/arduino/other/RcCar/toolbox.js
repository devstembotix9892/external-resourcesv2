function addToolbox() {
  return `

<category name="%{BKY_BLE_ROBOT_CATEGORY}" id="BLE_ROBOT_CATEGORY" colour="#3F51B5" secondaryColour="#303F9F">

<block type="ble_robot_full">
  <value name="NAME">
    <shadow type="text">
      <field name="TEXT">TEAM_BLUE</field>
    </shadow>
  </value>
</block>

<block type="ble_robot_full_1">
  <value name="NAME">
    <shadow type="text">
      <field name="TEXT">DOZZRE</field>
    </shadow>
  </value>
</block>

<block type="ble_robot_full_2">
  <value name="NAME">
    <shadow type="text">
      <field name="TEXT">pen</field>
    </shadow>
  </value>
</block>
<block type="ble_robot_full_3">
  <value name="NAME">
    <shadow type="text">
      <field name="TEXT">Soccer</field>
    </shadow>
  </value>
</block>
<block type="ble_robot_full_4">
  <value name="NAME">
    <shadow type="text">
      <field name="TEXT">Gripper</field>
    </shadow>
  </value>
</block>

</category>

`;
}

exports = addToolbox;