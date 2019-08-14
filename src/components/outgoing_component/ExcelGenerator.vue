<template lang="pug">
download-excel(
  :data='formatted'
  :before-finish = 'clean_up' 
  worksheet='расход'
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
      outgoing_records: "outgoing/get_outgoing_data",
      data_is_sorted: "outgoing/get_sorted_flag",
      sorted_data: "outgoing/get_sorted_data",
      today: "date/get_dashed_date"
    })
  },

  data: function() {
    return {
      formatted: [],
      filename: "расход"
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
        this.outgoing_records.forEach(item => {
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
