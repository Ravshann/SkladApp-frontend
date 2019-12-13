<template lang="pug">
v-btn(color='#00897B' dark @click='saveAsExcel') Скачать
</template>

<script>
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";
export default {
  name: "excel-generator",
  computed: {
    ...mapGetters({
      outgoing_records: "outgoing/get_formatted_data",
      sorted_data: "outgoing/get_sorted_formatted_data",
      data_is_sorted: "outgoing/get_sorted_flag",
      today: "date/get_dashed_date"
    })
  },

  data: function() {
    return {
      merge_sizes: [],
      pointer: 3,
      formatted: [],
      filename: "расход"
    };
  },
  methods: {
    make_header_cell(ws, cell_letter, cell_value) {
      ws.getCell(cell_letter).value = cell_value;
      ws.getCell(cell_letter).alignment = { horizontal: "center" };
      ws.getCell(cell_letter).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3399ff" }
      };
    },
    make_top_header_cell(ws) {
      ws.mergeCells("A1:G1");
      ws.getCell("A1").value = this.filename;
      ws.getCell("A1").style = { font: { size: 14, bold: true } };
      ws.getCell("A1").alignment = { horizontal: "center" };
    },
    createAndFillWorkbook() {
      this.formatData();
      const wb = new ExcelJS.Workbook();
      //worksheet name
      const ws = wb.addWorksheet("расход");

      //merge first row for table header
      this.make_top_header_cell(ws);

      //make table
      //make headers
      ws.getRow(2).font = {
        size: 12,
        italic: true,
        bold: true,
        color: { argb: "ffffffff" }
      };
      this.make_header_cell(ws, "A2", "Дата");
      this.make_header_cell(ws, "B2", "Клиент");
      this.make_header_cell(ws, "C2", "Наименование товара");
      this.make_header_cell(ws, "D2", "Склад");
      this.make_header_cell(ws, "E2", "Цена");
      this.make_header_cell(ws, "F2", "Кол-во");
      this.make_header_cell(ws, "G2", "Сумма");

      //give column sizes
      ws.columns = [
        { width: 10 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 10 },
        { width: 10 },
        { width: 10 }
      ];

      //populate rows
      let table_rows = [];
      this.formatted.forEach(item => {
        table_rows.push(Object.values(item));
      });
      ws.addRows(table_rows);

      // merge table cells
      this.merge_sizes.forEach(item => {
        if (item.length >= 1) {
          let a = "A" + item.start + ":A" + (item.start + item.length - 1);
          ws.mergeCells(a);
          ws.getCell("A" + item.start).alignment = {
            vertical: "middle",
            horizontal: "center"
          };

          let b = "B" + item.start + ":B" + (item.start + item.length - 1);
          ws.mergeCells(b);
          ws.getCell("B" + item.start).alignment = {
            vertical: "middle",
            horizontal: "center"
          };
        }
      });

      //give styling to cells
      let next_row = false;
      let paint_row = false;
      let last_row = ws.lastRow;
      ws.eachRow(function(row, rowNumber) {
        if (next_row && last_row.number !== rowNumber) paint_row = true;
        row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
          //give border to each cell
          if (rowNumber !== last_row.number)
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } }
            };
          if (cell.value === "Итого") {
            row.font = {
              italic: true,
              bold: true
            };
            next_row = true;
          } else if (paint_row && colNumber === 7 && cell.value === "") {
            next_row = false;
            paint_row = false;
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF99ffff" }
            };
          } else if (paint_row) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF99ffff" }
            };
          }
        });
      });
      return wb;
    },
    async saveAsExcel() {
      var workbook = this.createAndFillWorkbook();
      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), this.filename + ".xlsx");
      this.formatted = [];
    },

    populate_data_to_formatted(item) {
      this.merge_sizes.push({
        start: this.pointer,
        length: item.product_quantities.length
      });
      this.pointer += item.product_quantities.length + 2;
      item.product_quantities.forEach((inner_item, index) => {
        let row = {
          Дата: index === 0 ? item.record_datetime : "",
          Клиент: index === 0 ? item.client_name : "",
          "Наименование товара": inner_item.product_name,
          Склад: inner_item.storage_name,
          Цена: inner_item.price,
          Количество: inner_item.quantity,
          Сумма: inner_item.quantity*inner_item.price
        };
        this.formatted.push(row);
      });
      this.formatted.push({
        Дата: "",
        Клиент: "",
        "Наименование товара": "",
        Склад: "",
        Цена: "Итого",
        Количество: item.total_quantity,
        Сумма: item.total_price
      });
      this.formatted.push({
        Дата: "",
        Клиент: "",
        "Наименование товара": "",
        Склад: "",
        Количество: "",
        Цена: "",
        Сумма: ""
      });
    },
    formatData() {
      this.filename = this.filename + "--" + this.today + ".xls";
      if (this.data_is_sorted) {
        this.sorted_data.forEach(item => {
          this.populate_data_to_formatted(item);
        });
      } else {
        this.outgoing_records.forEach(item => {
          this.populate_data_to_formatted(item);
        });
      }
    }
  }
};
</script>
