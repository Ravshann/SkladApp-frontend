<template lang="pug">
div
  // button for opening dialog
  v-btn.elevation-3(color='#3CB371' small fab dark @click='advanced_sort_dialog = true') 
    v-icon {{"$vuetify.icons.period_icon"}}
  // dialog for 'outgoing' button
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable persistent)
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
      this.set_sorted_flag(false);
      this.advanced_sort_dialog = false;
    },
    sort_out() {
      let match = false;
      let match_formatted = false;
      let sorted_array = [];
      let sorted_formatted_array = [];
      this.outgoing_formatted_data.forEach(element => {
        if (this.check_date_range(element.record_datetime)) {
          match_formatted = Object.assign({}, element);
          sorted_formatted_array.push(match_formatted);
        }
      });
      this.outgoing_data.forEach(element => {
        if (this.check_date_range(element.record_datetime)) {
          match = Object.assign({}, element);
          sorted_array.push(match);
        }
      });
      this.set_sorted_flag(true);
      this.load_sorted_data(sorted_array);
      this.load_sorted_formatted_data(sorted_formatted_array);
      this.advanced_sort_dialog = false;
    },
    close() {
      this.advanced_sort_dialog = false;
    }
  }
};
</script>