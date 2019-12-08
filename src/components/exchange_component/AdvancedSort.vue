<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#967ADC' dark @click='advanced_sort_dialog = true') Сортировать
  
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable persistent)
    v-card
      v-card-title.headline Сортировать по
      v-card-text
        v-autocomplete(v-model='product_name' :items='exchange_records' label='Наименование товара' persistent-hint item-text='product_name')
        v-autocomplete(v-model='category_name' :items='exchange_records' label='Kатегория' persistent-hint item-text='category_name')
        v-autocomplete(v-model='storage_name' :items='exchange_records' label='Склад' persistent-hint item-text='storage_name')
        v-autocomplete(v-model='supplier_name' :items='exchange_records' label='Поставшик' persistent-hint item-text='supplier_storage_name')
        v-layout
          data-pick-menu(@date-selected-event='fromDateSelected' :custom_date="first_day" :maximum_date="today")
          data-pick-menu(@date-selected-event='toDateSelected' :maximum_date="today")
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
      categories: "categories/get_categories",
      exchange_records: "exchange/get_data",
      today: "date/get_dashed_date",
      first_day: "date/get_first_day"
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
      storage_name: undefined,
      supplier_name: undefined,
      default_from_date: "2019-01-01",
      fromDate: Date,
      toDate: Date
    };
  },
  methods: {
    ...mapMutations({
      load_data: "exchange/load_data",
      load_sorted_data: "exchange/load_sorted_data",
      set_sorted_flag: "exchange/set_sorted_flag"
    }),
    check_date_range(record_date) {
      let date = new Date(record_date);
      let from = new Date(this.fromDate);
      let to = new Date(this.toDate);
      if (date.getTime() >= from.getTime() && date.getTime() <= to.getTime())
        return true;
      else return false;
    },
    fromDateSelected(date) {
      this.fromDate = date;
    },
    toDateSelected(date) {
      this.toDate = date;
    },
    cancel_sort() {
      this.supplier_name = undefined;
      this.product_name = undefined;
      this.category_name = undefined;
      this.storage_name = undefined;
      this.set_sorted_flag(false);
      this.advanced_sort_dialog = false;
    },
    find_matching_categories() {
      let matching_categories = this.categories.filter(obj => {
        return (
          obj.category_name === this.category_name ||
          obj.parent_category_name === this.category_name
        );
      });
      Array.prototype.get_names = function() {
        for (let i = 0; i < this.length; i++) {
          this[i] = this[i].category_name;
        }
      };
      matching_categories.get_names();
      return matching_categories;
    },
    sort_out() {
      let match = false;
      let sorted_array = [];
      this.exchange_records.forEach(element => {
        let name_match = true;
        if (this.product_name !== undefined)
          name_match = element.product_name === this.product_name;
        let category_match = true;
        if (this.category_name !== undefined) {
          let matching_categories = this.find_matching_categories();
          category_match = matching_categories.includes(element.category_name);
          //category_match = element.category_name === this.category_name;
        }
        let storage_match = true;
        if (this.storage_name !== undefined)
          storage_match = element.storage_name === this.storage_name;
        let supplier_match = true;
        if (this.supplier_name !== undefined)
          supplier_match = element.supplier_storage_name === this.supplier_name;

        if (
          name_match &&
          category_match &&
          storage_match &&
          supplier_match &&
          this.check_date_range(element.record_datetime)
        ) {
          match = Object.assign({}, element);
          sorted_array.push(match);
        }
      });
      this.set_sorted_flag(true);
      this.load_sorted_data(sorted_array);
      this.advanced_sort_dialog = false;
    },
    close() {
      this.advanced_sort_dialog = false;
    }
  }
};
</script>