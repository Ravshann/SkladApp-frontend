<template>
  <div>
    <!-- button for opening dialog -->
    <v-btn color="#967ADC" dark @click="advanced_sort_dialog = true">Сортировать</v-btn>
    <!-- dialog for 'outgoing' button -->
    <v-dialog v-model="advanced_sort_dialog" max-width="500px" scrollable>
      <v-card>
        <v-card-title>Сортировать по</v-card-title>

        <v-card-text>
          <v-autocomplete
            v-model="product_name"
            :items="remainder_data"
            label="Наименование товара"
            persistent-hint
            item-text="productName"
          ></v-autocomplete>

          <v-autocomplete
            v-model="category"
            :items="remainder_data"
            label="Kатегория"
            persistent-hint
            item-text="categoryName"
          ></v-autocomplete>

          <v-autocomplete
            v-model="storage_name"
            :items="storages"
            label="Склад"
            persistent-hint
            item-text="storage_name"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="close">ЗАКРЫТЬ</v-btn>
          <v-btn color="primary" @click="close">СОРТИРОВАТЬ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import axios from "axios";

export default {
  name: "advanced-sort",
  created() {
    this.getStorages();
  },
  props: {
    remainder_data: Array,
    search: ""
  },
  methods: {
    getStorages: function() {
      const url = this.host + ":" + this.port + "/storages";
      var self = this;
      axios
        .get(url)
        .then(function(response) {
          self.storages = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.advanced_sort_dialog = false;
      var object = {
        product_name: this.product_name,
        category: this.category,
        storage_name: this.storage_name
      };
      
      this.$emit("sort_event", object);
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
<style scoped>
</style>
