<template lang="pug">
div
  // button for opening dialog
  //- v-btn(color='#967ADC' dark @click='advanced_sort_dialog = true') Сортировать
  v-btn(fab dark flat color='#967ADC' @click='advanced_sort_dialog = true' title="Сортировать")
    span
      v-icon {{"$vuetify.icons.search_icon"}}
  // dialog for 'outgoing' button
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable persistent)
    v-card
      v-card-title Сортировать по
      v-card-text
        v-autocomplete(v-model='product_name' :items='outgoing_data' label='Наименование товара' persistent-hint item-text='product_name')
        v-autocomplete(v-model='category_name' :items='outgoing_data' label='Kатегория' persistent-hint item-text='category_name')
        v-autocomplete(v-model='storage_name' :items='outgoing_data' label='Склад' persistent-hint item-text='storage_name')
        v-autocomplete(v-model='client_name' :items='outgoing_data' label='Клиент' persistent-hint item-text='client_name')
        v-layout
          data-pick-menu(@date-selected-event='fromDateSelected' :maximum_date="today")
          data-pick-menu(@date-selected-event='toDateSelected' :maximum_date="today")
      v-card-actions
        v-btn(color='primary' flat @click='close') ЗАКРЫТЬ
        v-btn(color='primary' @click='sort_out') Сортировать
        v-btn(color='primary' light @click='cancel_sort') Очистить филтр
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DataPickMenu from "../DataPickMenu";
export default {
  name: "advanced-sort",
  components: {
    DataPickMenu
  },
  computed: {
    ...mapGetters({
      outgoing_data: "outgoing/get_outgoing_data",
      today: "date/get_dashed_date"
    })
  },
  beforeDestroy() {
    this.cancel_sort();
  },
  data() {
    return {
      advanced_sort_dialog: false,
      product_name: "",
      category_name: "",
      storage_name: "",
      client_name: "",
      fromDate: Date,
      toDate: Date
    };
  },
  methods: {
    ...mapMutations({
      load_sorted_data: "outgoing/load_sorted_data",
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
      this.client_name = "";
      this.product_name = "";
      this.category_name = "";
      this.storage_name = "";
      this.set_sorted_flag(false);
      this.advanced_sort_dialog = false;
    },
    sort_out() {
      let match = false;
      let sorted_array = [];
      this.outgoing_data.forEach(element => {
        if (
          element.product_name === this.product_name ||
          element.category_name === this.category_name ||
          element.storage_name === this.storage_name ||
          element.client_name === this.client_name ||
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