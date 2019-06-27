<template lang="pug">
div
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model ="dialog" persistent max-width='1000px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog=false' title='свернуть')
          v-icon close
        v-toolbar-title Новый товар
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='product_name' label='Наименование товара' prepend-icon='assignment' placeholder='Наименование товара')
        v-autocomplete(
          v-model='category' 
          :items="category_list" 
          label='Категории' 
          prepend-icon='style'  
          persistent-hint 
          item-text='category_name'
          return-object)
          
</template>
<script>
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("products");

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "create-product-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  computed: {
    ...mapGetters({
      category_list: "categories/get_categories",
      attribute_list: "attributes/get_attributes"
    })
  },
  data() {
    return {
      dialog: false,
      save_records: false,
      inform_dialog_done: false,
      tab_headers: ["Общая информация", "Параметры продукта"],

      product_name: "",
      category: Object,
      selected_attribute: Object,
      selected_attributes: []
    };
  },
  methods: {
    ...mapMutations({
      load_products: "products/load_products",
    }),
    clearAll() {
      this.product_name = "";
      this.category = "";
      this.dialog = false;
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_products(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend

        let object = {
          product_name: this.product_name,
          category_ID: this.category.category_ID
        };
        console.log(object);
        repository.save(object);
        //clear data
        this.clearAll();
      } else {
        this.save_records = false;
      }
      setTimeout(() => {
        this.updateStore();
      }, 1000);
    }
  }
};
</script>