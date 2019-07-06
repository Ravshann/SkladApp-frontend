<template lang="pug">
v-menu(
  ref='menu' 
  v-model='menu' 
  :close-on-content-click='false' 
  :nudge-right='40' 
  lazy 
  transition='scale-transition' 
  offset-y 
  full-width 
  min-width='290px')
  template(v-slot:activator='{ on }')
    v-text-field(
      v-model='date' 
      label='Дата' 
      prepend-icon='event' 
      readonly 
      v-on='on')
  v-date-picker(
    v-model='date' 
    no-title 
    scrollable
    :min='minimum_date!==undefined ? maximum_date : ""'
    :max='maximum_date!==undefined ? maximum_date: ""')
    v-spacer
    v-btn(flat color='primary' @click='okButtonClicked') OK
</template>

<script>
export default {
  name: "data-pick-menu",
  created() {
    this.date = this.getDate();
    this.$emit("date-selected-event", this.date);
  },
  props: {
    custom_date: String,
    minimum_date: String,
    maximum_date: String
  },
  watch: {
    custom_date: function() {
      this.date = this.custom_date;
    },
    date() {
      this.menu = false;
      this.$emit("date-selected-event", this.date);
    }
  },
  data() {
    return {
      menu: false,
      date: Date
    };
  },
  methods: {
    getDate() {
      var cur_date_vue = new Date();
      var month = ("0" + (cur_date_vue.getMonth() + 1)).slice(-2);
      var date = ("0" + cur_date_vue.getDate()).slice(-2);
      var year = cur_date_vue.getFullYear();
      var date_formatted_vue = year + "-" + month + "-" + date;
      return date_formatted_vue;
    },
    okButtonClicked() {
      this.menu = false;
      this.$emit("date-selected-event", this.date);
    }
  }
};
</script>

<style scoped>
</style>
