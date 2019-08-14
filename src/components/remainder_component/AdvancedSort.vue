<template lang="pug">
div
 
  v-btn(color='#967ADC' dark @click='advanced_sort_dialog = true') Сортировать
  
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable persistent)
    v-card
      v-card-title.headline Сортировать по
      v-card-text
        v-autocomplete(v-model='product_name' :items='remainder_data' label='Наименование товара' persistent-hint item-text='productName')
        v-autocomplete(v-model='category_name' :items='remainder_data' label='Kатегория' persistent-hint item-text='categoryName')
        v-autocomplete(v-model='storage_name' :items='storages' label='Склад' persistent-hint item-text='storage_name')
      v-card-actions
        v-btn(color='primary' flat @click='close') ЗАКРЫТЬ
        v-btn(color='primary' @click='sort_out') Сортировать
        v-btn(color='primary' light @click='cancel_sort') Очистить филтр
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "advanced-sort",
  computed: {
    ...mapGetters({
      remainder_data: "remainders/get_remainder_data",
      storages: "storages/get_storages"
    })
  },
  beforeDestroy() {
    this.cancel_sort();
  },
  data() {
    return {
      advanced_sort_dialog: false,
      product_name: undefined,
      category_name: undefined,
      storage_name: undefined
    };
  },
  methods: {
    ...mapMutations({
      load_sorted_data: "remainders/load_remainder_data_sorted",
      set_sorted: "remainders/set_sorted_flag"
    }),

    cancel_sort() {
      this.product_name = undefined;
      this.category_name = undefined;
      this.storage_name = undefined;
      this.set_sorted(false);
      this.advanced_sort_dialog = false;
    },
    sort_out() {
      let match = false;
      let sorted_array = [];
      this.remainder_data.forEach(element => {
        let name_match = true;
        if (this.product_name !== undefined)
          name_match = element.productName === this.product_name;
        let category_match = true;
        if (this.category_name !== undefined)
          category_match = element.categoryName === this.category_name;

        if (name_match && category_match) {
          let isChecked = false;
          if (this.storage_name !== undefined) {
            if (element.storageQuantities.length > 0) {
              element.storageQuantities.forEach((item, index) => {
                if (item.storageName === this.storage_name) {
                  match = Object.assign({}, element);
                  match.storageQuantities = [match.storageQuantities[index]];
                  sorted_array.push(match);
                }
              });
            }
            isChecked = true;
          }
          if (!isChecked) {
            match = Object.assign({}, element);
            sorted_array.push(match);
          }
        }
      });
      this.set_sorted(true);
      this.load_sorted_data(sorted_array);
      this.advanced_sort_dialog = false;
    },
    close() {
      this.advanced_sort_dialog = false;
    }
  }
};
</script>