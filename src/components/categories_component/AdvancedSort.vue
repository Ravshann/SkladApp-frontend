<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#967ADC' dark='' @click='advanced_sort_dialog = true') Сортировать
  // dialog for 'outgoing' button
  v-dialog(v-model='advanced_sort_dialog' max-width='500px' scrollable='')
    v-card
      v-card-title Сортировать по
      v-card-text
        v-autocomplete(v-model='product_name' :items='remainder_data' label='Наименование товара' persistent-hint='' item-text='productName')
        v-autocomplete(v-model='category' :items='remainder_data' label='Kатегория' persistent-hint='' item-text='categoryName')
        v-autocomplete(v-model='storage_name' :items='storages' label='Склад' persistent-hint='' item-text='storage_name')
      v-card-actions
        v-btn(color='primary' flat='' @click='close') ЗАКРЫТЬ
        v-btn(color='primary' @click='close') Сортировать
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "advanced-sort",
  props: {
    search: ""
  },
  computed: {
    ...mapGetters({
      remainder_data: "remainders/get_remainder_data"
    })
  },
  methods: {
    close() {
      // this.advanced_sort_dialog = false;
      // var object = {
      //   product_name: this.product_name,
      //   category: this.category,
      //   storage_name: this.storage_name
      // };
      // this.$emit("sort_event", object);
    }
  },

  data: function() {
    return {
      host: "http://www.sklad-app.tk",
      port: "8080",
      advanced_sort_dialog: false,
      product_name: "",
      category: "",
      storage_name: "",
      storages: []
    };
  }
};
</script>