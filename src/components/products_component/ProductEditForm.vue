<template lang="pug">
div
  v-dialog(v-model='appear' max-width='800px' persistent  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='close' title='отменить')
          v-icon close
        v-toolbar-title Изменить данные
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        div
          v-tabs(
            color="white"
            white
            slider-color="blue")
            v-tab(
              v-for="n in 2"
              :key="n"
              ripple) {{ tab_headers[n-1] }}  
            v-tab-item
              v-text-field(v-model='product_name' label='Наименование товара' prepend-icon='assignment' placeholder='Наименование товара')
              v-autocomplete(
                v-model='category' 
                :items="category_list" 
                label='Категории' 
                prepend-icon='style'  
                persistent-hint 
                item-text='category_name'
                return-object)
            v-tab-item
              v-layout
                v-autocomplete(
                  v-model='selected_attribute' 
                  :items="attribute_list" 
                  label='Параметры' 
                  prepend-icon='settings_ethernet'  
                  persistent-hint
                  item-text='attribute_name'
                  return-object)
                v-text-field(v-model='attribute_value' label='Значение' prepend-icon='straighten' placeholder='Значение')
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const productsRepository = RepositoryFactory.get("products");

import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
export default {
  name: "product-edit-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    console.log(this.edit_object);
    this.category = this.edit_object.category;
    this.product_name = this.edit_object.product_name;
    this.product_ID = this.edit_object.product_ID;
    // this.selected_attribute = this.edit_object.attribute;
    // this.attribute_value = this.edit_object.attribute.attribute_value;
  },
  computed: {
    ...mapGetters({
      category_list: "categories/get_categories",
      attribute_list: "attributes/get_attributes"
    })
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,

      tab_headers: ["Общая информация", "Параметры продукта"],
      product_name: "",
      category: Object,
      selected_attribute: Object,
      selected_attributes: [],
      attribute_value: "",
      product_ID: ""
    };
  },
  methods: {
    ...mapMutations({
      load_incoming_data: "incoming/load_incoming_data"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    async refresh() {
      const { data } = await productsRepository.get();
      this.load_incoming_data(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        let formatted = {
          // supplier_ID: this.supplier.supplier_ID,
          // storage_ID: this.storage.storage_ID,
          // product_ID: this.product.product_ID,
          // updated_datetime: this.today,
          // record_datetime: this.date,
          // quantity: this.quantity,
          // inout_type_ID: 2,
          // record_ID: this.edit_object.record_ID
        };

        // productsRepository.update(formatted);
        this.close();
      } else {
        this.save_records = false;
      }
      let self = this;
      setTimeout(function() {
        self.refresh();
      }, 1000);
    }
  }
};
</script>
