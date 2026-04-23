class BlocklyFieldMatrix extends Blockly.Field {
    constructor(value) {
        super(value || "0000000000000000000000000000000000000"); // 35 bits
        this.Rows = 7;
        this.Columns = 5;
        this.matrix = (value || "0000000000000000000000000000000000000")
            .split("")
            .map(n => Number(n));
    }

    static fromJson(options) {
        return new BlocklyFieldMatrix(options["value"]);
    }

    showEditor_() {
        const div = document.createElement("div");

        div.style.padding = "10px";
        div.style.background = "#ff8800";
        div.style.borderRadius = "8px";

        // 🔥 REAL 5×7 GRID
        div.style.display = "grid";
        div.style.gridTemplateColumns = "repeat(5, 30px)";
        div.style.gridTemplateRows = "repeat(7, 30px)";
        div.style.gridGap = "4px";

        for (let i = 0; i < 35; i++) {
            const cell = document.createElement("div");
            cell.style.width = "30px";
            cell.style.height = "30px";
            cell.style.borderRadius = "4px";
            cell.style.cursor = "pointer";
            cell.style.background = this.matrix[i] ? "#ffffff" : "#e70808ff";

            cell.onclick = () => {
                this.matrix[i] = this.matrix[i] ? 0 : 1;
                cell.style.background = this.matrix[i] ? "#ffffff" : "#e70808ff";
                this.setValue(this.matrix.join(""));
            };

            div.appendChild(cell);
        }

        Blockly.DropDownDiv.getContentDiv().appendChild(div);
        Blockly.DropDownDiv.showPositionedByField(this, () => {
            Blockly.DropDownDiv.getContentDiv().innerHTML = "";
        });
    }
}

Blockly.fieldRegistry.register("field_matrix", BlocklyFieldMatrix);
