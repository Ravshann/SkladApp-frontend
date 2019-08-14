<template lang="pug">
download-excel(
  :data='formatted'
  :before-finish = 'clean_up' 
  worksheet='возвраты'
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
      today: "date/get_dashed_date",
      returned_records: "returned/get_returned_data",
      data_is_sorted: "returned/get_sorted_flag",
      sorted_data: "returned/get_sorted_data"
    })
  },

  data: function() {
    return {
      formatted: [],
      filename: "возвраты"
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
            Клиент: item.client_name,
            "Регион(клиент)": item.client_region,
            Дата: item.record_datetime
          };
          this.formatted.push(row);
        });
      } else {
        this.returned_records.forEach(item => {
          let row = {
            "Наименование товара": item.product_name,
            Kатегория: item.category_name,
            Количество: item.quantity,
            Склад: item.storage_name,
            Клиент: item.client_name,
            "Регион(клиент)": item.client_region,
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
