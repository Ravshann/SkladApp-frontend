
<template lang="pug">
v-btn(color='#00897B' dark @click='dialog=!dialog') Скачать
  v-dialog(v-model='dialog' max-width='290')
    v-card
      v-card-title.headline Пожалуйста, выберите вариант    
      v-card-actions
        v-spacer
        v-btn(color='green darken-1' flat='flat' @click.prevent='saveAsExcel(false)') нормал
        v-btn(color='green darken-1' flat='flat' @click.prevent='saveAsExcel(true)') упрощенный
</template>
<script>
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";
export default {
  name: "excel-generator",
  computed: {
    ...mapGetters({
      remainder_data: "remainders/get_remainder_data",
      data_is_sorted: "remainders/get_sorted_flag",
      remainder_data_sorted: "remainders/get_sorted_data",
      today: "date/get_dashed_date",
      user_role: "logged_user/get_user_role"
    })
  },

  data: function() {
    return {
      dialog: false,
      merge_sizes: [],
      pointer: 3,
      formatted: [],
      filename: "остаток"
    };
  },
  methods: {
    async saveAsExcel(simplified) {
      var workbook = this.createAndFillWorkbook(simplified);
      const buf = await workbook.xlsx.writeBuffer();
      if (simplified)
        saveAs(new Blob([buf]), this.filename + "--упрощенный.xlsx");
      else saveAs(new Blob([buf]), this.filename + ".xlsx");
      this.clean_up();
    },
    clean_up() {
      this.formatted = [];
      this.merge_sizes = [];
      this.dialog = false;
      this.pointer = 3;
    },
    make_header_cell(ws, cell_letter, cell_value) {
      ws.getCell(cell_letter).value = cell_value;
      ws.getCell(cell_letter).alignment = { horizontal: "center" };
      ws.getCell(cell_letter).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3399ff" }
      };
    },
    make_top_header_cell(ws, simplified) {
      simplified ? ws.mergeCells("A1:C1") : ws.mergeCells("A1:E1");
      ws.getCell("A1").value = this.filename;
      ws.getCell("A1").style = { font: { size: 14, bold: true } };
      ws.getCell("A1").alignment = { horizontal: "center" };
    },
    createAndFillWorkbook(simplified) {
      //format data into needed form
      this.formatData(simplified);
      const wb = new ExcelJS.Workbook();
      //worksheet name
      const ws = wb.addWorksheet("остаток");

      //merge first row for table header
      this.make_top_header_cell(ws, simplified);

      //make table
      //make headers
      ws.getRow(2).font = {
        size: 12,
        italic: true,
        bold: true,
        color: { argb: "ffffffff" }
      };

      this.make_header_cell(ws, "A2", "Наименование товара");
      this.make_header_cell(ws, "B2", "Kатегория");
      this.make_header_cell(ws, "C2", "Общая кол-во");
      if (simplified === false) {
        this.make_header_cell(ws, "D2", "Склад");
        this.make_header_cell(ws, "E2", "Кол-во");
      }

      //give column sizes
      let col_width = [{ width: 25 }, { width: 15 }, { width: 15 }];
      if (simplified === false) {
        col_width.push({ width: 25 });
        col_width.push({ width: 10 });
      }
      ws.columns = col_width;

      //populate rows
      let table_rows = [];
      this.formatted.forEach(item => {
        table_rows.push(Object.values(item));
      });
      ws.addRows(table_rows);

      // merge table cells
      if (simplified === false)
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

            let c = "C" + item.start + ":C" + (item.start + item.length - 1);
            ws.mergeCells(c);
            ws.getCell("C" + item.start).alignment = {
              vertical: "middle",
              horizontal: "center"
            };
          }
        });

      //give styling to cells
      ws.eachRow(function(row) {
        row.eachCell({ includeEmpty: true }, function(cell) {
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } }
          };
        });
      });
      return wb;
    },

    populate_data_to_formatted(item, simplified) {
      if (this.user_role === "Завсклад") {
        let row = {
          "Наименование товара": item.productName,
          Kатегория: item.categoryName,
          "Общая количество": item.total
        };
        if (simplified === false) {
          row.Склад = item.storageQuantities[0].storageName;
          row.Количество = item.storageQuantities[0].quantity;
        }
        if (item.total !== 0) this.formatted.push(row);
      }
      //user type is not zavsklad
      else {
        let row = {};
        if (simplified === true) {
          row = {
            "Наименование товара": item.productName,
            Kатегория: item.categoryName,
            "Общая количество": item.total
          };
          if (item.total !== 0) this.formatted.push(row);
        } else {
          this.merge_sizes.push({
            start: this.pointer,
            length: item.storageQuantities.length
          });
          this.pointer += item.storageQuantities.length;
          item.storageQuantities.forEach((inner_item, index) => {
            if (simplified === false)
              row = {
                "Наименование товара": index === 0 ? item.productName : "",
                Kатегория: item.categoryName,
                "Общая количество": index === 0 ? item.total : "",
                Склад: inner_item.storageName,
                Количество: inner_item.quantity
              };
            this.formatted.push(row);
          });
        }
      }
    },
    formatData(simplified) {
      this.filename = this.filename + "--" + this.today;
      if (this.data_is_sorted) {
        this.remainder_data_sorted.forEach(item => {
          this.populate_data_to_formatted(item, simplified);
        });
      }
      //data is not sorted
      else {
        this.remainder_data.forEach(item => {
          this.populate_data_to_formatted(item, simplified);
        });
      }
    }
  }
};
</script>
<style scoped>
</style>
