<template lang="pug">
div
  // button for opening dialog
  v-btn.elevation-3(color='#3CB371' small fab dark @click='sort_by_date_dialog = true') 
    v-icon {{"$vuetify.icons.period_icon"}}
  // dialog for 'returned' button
  v-dialog(v-model='sort_by_date_dialog' max-width='500px' scrollable persistent)
    v-card
      v-card-title.headline Сортировать по дате
      v-card-text
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
  name: "sort-by-date",

  computed: {
    ...mapGetters({
      returned_data: "returned/get_returned_data",
      today: "date/get_dashed_date",
      first_day: "date/get_first_day"
    })
  },
  beforeDestroy() {
    this.cancel_sort();
  },
  data() {
    return {
      sort_by_date_dialog: false,
      fromDate: Date,
      toDate: Date
    };
  },
  methods: {
    ...mapMutations({
      load_sorted_data: "returned/load_sorted_data",
      set_sorted_flag: "returned/set_sorted_flag"
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
      this.set_sorted_flag(false);
      this.sort_by_date_dialog = false;
    },
    sort_out() {
      let match = false;
      let sorted_array = [];
      this.returned_data.forEach(element => {
        if (this.check_date_range(element.record_datetime)) {
          match = Object.assign({}, element);
          sorted_array.push(match);
        }
      });
      this.set_sorted_flag(true);
      this.load_sorted_data(sorted_array);
      this.sort_by_date_dialog = false;
    },
    close() {
      this.sort_by_date_dialog = false;
    }
  }
};
</script>