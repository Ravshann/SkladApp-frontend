<template lang="pug">
download-excel(
  :data='formatted'
  :before-finish = 'clean_up' 
  worksheet='дефектные'
  :title='filename' 
  :name='filename')
  v-btn(color='#00897B' dark @click='formatData') Скачать
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "excel-generator",
  computed: {
    ...mapGetters({
      defected_records: "defected/get_data",
      data_is_sorted: "defected/get_sorted_flag",
      sorted_data: "defected/get_sorted_data",
      today: "date/get_dashed_date"
    })
  },

  data: function() {
    return {
      formatted: [],
      filename: "дефектные"
    };
  },
  methods: {
    clean_up() {
      this.formatted = [];
    },
    formatData() {
      let dated = this.filename + "--" + this.today + ".xls";
      this.filename = dated;
      if (this.data_is_sorted) {
        this.sorted_data.forEach(item => {
          let row = {
            "Наименование товара": item.product_name,
            Kатегория: item.category_name,
            Количество: item.quantity,
            Склад: item.storage_name,
            Поставщик: item.supplier_name,
            Дата: item.record_datetime
          };
          this.formatted.push(row);
        });
      } else {
        this.defected_records.forEach(item => {
          let row = {
            "Наименование товара": item.product_name,
            Kатегория: item.category_name,
            Количество: item.quantity,
            Склад: item.storage_name,
            Поставщик: item.supplier_name,
            Дата: item.record_datetime
          };
          this.formatted.push(row);
        });
      }
    }
  }
};
</script>
<style scoped>
</style>
