<template lang="pug">
download-excel(
  :data='formatted'
  :before-finish = 'clean_up' 
  worksheet='остаток'
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
      remainder_data: "remainders/get_remainder_data",
      data_is_sorted: "remainders/get_sorted_flag",
      remainder_data_sorted: "remainders/get_sorted_data",
      today: "date/get_dashed_date",
      user_role: "logged_user/get_user_role"
    })
  },

  data: function() {
    return {
      formatted: [],
      filename: "остаток"
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
        this.remainder_data_sorted.forEach(item => {
          if (this.user_role === "Завсклад") {
            let row = {
              "Наименование товара": item.productName,
              Kатегория: item.categoryName,
              "Общая количество": item.total,
              Склад: item.storageQuantities[0].storageName,
              Количество: item.storageQuantities[0].quantity
            };
            this.formatted.push(row);
          } else {
            item.storageQuantities.forEach(inner_item => {
              let row = {
                "Наименование товара": item.productName,
                Kатегория: item.categoryName,
                "Общая количество": item.total,
                Склад: inner_item.storageName,
                Количество: inner_item.quantity
              };
              this.formatted.push(row);
            });
          }
        });
      } else {
        this.remainder_data.forEach(item => {
          if (this.user_role === "Завсклад") {
            let row = {
              "Наименование товара": item.productName,
              Kатегория: item.categoryName,
              "Общая количество": item.total,
              Склад: item.storageQuantities[0].storageName,
              Количество: item.storageQuantities[0].quantity
            };
            this.formatted.push(row);
          } else {
            item.storageQuantities.forEach(inner_item => {
              let row = {
                "Наименование товара": item.productName,
                Kатегория: item.categoryName,
                "Общая количество": item.total,
                Склад: inner_item.storageName,
                Количество: inner_item.quantity
              };
              this.formatted.push(row);
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
</style>
