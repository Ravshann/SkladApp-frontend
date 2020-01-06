<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#967ADC' dark @click='advanced_sort_dialog = true') Сортировать
  // dialog for 'outgoing' button
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable persistent)
    v-card
      v-card-title.headline Сортировать по
      v-card-text
        v-autocomplete(v-model='product_name' :items='outgoing_data' label='Наименование товара' persistent-hint item-text='product_name' clearable=true)
        v-autocomplete(v-model='category_name' :items='outgoing_data' label='Kатегория' persistent-hint item-text='category_name' clearable=true)
        v-autocomplete(v-model='storage_name' :items='outgoing_data' label='Склад' persistent-hint item-text='storage_name' clearable=true)
        v-autocomplete(v-model='client_name' :items='outgoing_data' label='Клиент' persistent-hint item-text='client_name' clearable=true)
        v-autocomplete(v-model='client_region' :items='outgoing_data' label='Регион клиента' persistent-hint item-text='client_region' clearable=true)
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
      outgoing_data: "outgoing/get_outgoing_data",
      outgoing_formatted_data: "outgoing/get_formatted_data",
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
      client_name: undefined,
      client_region: undefined,
      fromDate: Date,
      toDate: Date
    };
  },
  methods: {
    ...mapMutations({
      load_sorted_data: "outgoing/load_sorted_data",
      load_sorted_formatted_data: "outgoing/load_sorted_formatted_data",
      set_sorted_flag: "outgoing/set_sorted_flag"
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
      this.client_name = undefined;
      this.client_region = undefined;
      this.product_name = undefined;
      this.category_name = undefined;
      this.storage_name = undefined;
      this.set_sorted_flag(false);
      this.advanced_sort_dialog = false;
    },
    outgoing_format(data) {
      let total_quantity = 0;
      let total_price = 0;
      let operated_data = data;
      let product_quantities = [];
      let general_list = [];
      data.sort(function(a, b) {
        return (
          a.record_datetime === b.record_datetime &&
          a.client_name.toLowerCase().localeCompare(b.client_name)
        );
      });

      for (let i = 0; i < operated_data.length; i++) {
        let next = operated_data[i + 1];
        if (next !== undefined) {
          //if sorted arrays two consequent items match
          if (
            operated_data[i].record_datetime === next.record_datetime &&
            operated_data[i].client_name === next.client_name
          ) {
            total_quantity += operated_data[i].quantity;
            total_price += operated_data[i].quantity * operated_data[i].price;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID,
              category_name: operated_data[i].category_name
            });
          } else {
            total_price += operated_data[i].quantity * operated_data[i].price;
            total_quantity += operated_data[i].quantity;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID,
              category_name: operated_data[i].category_name
            });
            general_list.push({
              record_datetime: operated_data[i].record_datetime,
              client_name: operated_data[i].client_name,
              total_quantity: total_quantity,
              total_price: total_price,
              client_region: operated_data[i].client_region,
              product_quantities: product_quantities
            });
            product_quantities = [];
            total_quantity = 0;
            total_price = 0;
          }
        }
        //here it works if two consequents do not match
        else {
          total_quantity += operated_data[i].quantity;
          total_price += operated_data[i].quantity * operated_data[i].price;
          product_quantities.push({
            price: operated_data[i].price,
            product_name: operated_data[i].product_name,
            quantity: operated_data[i].quantity,
            storage_name: operated_data[i].storage_name,
            record_ID: operated_data[i].record_ID,
            category_name: operated_data[i].category_name
          });
          general_list.push({
            record_datetime: operated_data[i].record_datetime,
            client_name: operated_data[i].client_name,
            total_quantity: total_quantity,
            total_price: total_price,
            client_region: operated_data[i].client_region,
            product_quantities: product_quantities
          });
        }
      }
      return general_list;
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
      this.load_sorted_data([]);
      this.load_sorted_formatted_data([]);
      this.set_sorted_flag(false);
      let sorted_array = [];
      this.outgoing_data.forEach(element => {
        let name_match = true;
        if (this.product_name !== undefined)
          name_match = element.product_name === this.product_name;
        let category_match = true;
        if (this.category_name !== undefined) {
          let matching_categories = this.find_matching_categories();
          category_match = matching_categories.includes(element.category_name);
          // console.log(
          //   element.product_name +
          //     "    " +
          //     category_match +
          //     "    " +
          //     element.category_name
          // );          // category_match = element.category_name === this.category_name;
        }
        let storage_match = true;
        if (this.storage_name !== undefined)
          storage_match = element.storage_name === this.storage_name;
        let client_match = true;
        if (this.client_name !== undefined)
          client_match = element.client_name === this.client_name;
        let region_match = true;
        if (this.client_region !== undefined)
          client_match = element.client_region === this.client_region;
        if (
          name_match &&
          category_match &&
          storage_match &&
          client_match &&
          region_match &&
          this.check_date_range(element.record_datetime)
        ) {
          let match = Object.assign({}, element);
          sorted_array.push(match);
        }
      });
      this.set_sorted_flag(true);
      this.load_sorted_data(sorted_array);
      let formatted_data = this.outgoing_format(sorted_array);
      this.load_sorted_formatted_data(formatted_data);
      this.advanced_sort_dialog = false;
    },
    close() {
      this.advanced_sort_dialog = false;
    }
  }
};
</script>
