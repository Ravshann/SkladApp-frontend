<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field v-model="ex_date" label="К этой дате" prepend-icon="event" readonly v-on="on"></v-text-field>
    </template>
    <v-date-picker v-model="ex_date" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="okButtonClicked">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "data-pick-menu",
  created() {
    this.ex_date = this.getDate();
    this.$emit("date-selected-event", this.ex_date);
  },
  data: function() {
    return {
      menu: false,
      ex_date: Date
    };
  },
  methods: {
    getDate: function() {
      var cur_date_vue = new Date();
      var month = ("0" + (cur_date_vue.getMonth() + 1)).slice(-2);
      var date = ("0" + cur_date_vue.getDate()).slice(-2);
      var year = cur_date_vue.getFullYear();
      var date_formatted_vue = year + "-" + month + "-" + date;
      return date_formatted_vue;
    },
    okButtonClicked(event) {
      this.menu = false;
      this.$emit("date-selected-event", this.ex_date);
    }
  }
};
</script>

<style scoped>
</style>
