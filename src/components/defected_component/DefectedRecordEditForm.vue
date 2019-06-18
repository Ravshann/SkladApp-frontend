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
          v-btn(dark flat @click='save_dialog = true') Сохранить
        // dialog for confirmation
        v-dialog(v-model='save_dialog' max-width='290')
          v-card
            v-card-title.headline save changes?
            v-card-text all changes will be saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
        v-dialog(v-model='inform_dialog_done' max-width='290')
          v-card
            v-card-title.headline changes saved
            v-card-text all changes are saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected' :custom_date='record_datetime')
          // autocomplete fields
        v-autocomplete(
          v-model='supplier' 
          :items="supplier_list" 
          label='Поставщик' 
          prepend-icon='local_shipping' 
          persistent-hint 
          item-text='supplier_name'
          return-object)
        v-autocomplete(
          v-model='product' 
          :items="product_list" 
          label='Наименование товара' 
          prepend-icon='sort' 
          persistent-hint 
          item-text='product_name' 
          return-object)
        v-autocomplete(
          v-model='storage' 
          :items="storage_list" 
          label='Склад' 
          prepend-icon='home' 
          persistent-hint 
          item-text='storage_name' 
          return-object)
        v-text-field(
          v-model.number='quantity' 
          type='number' 
          label='Количество' 
          prepend-icon='edit' 
          placeholder='0')
</template>
<script>
import DataPickMenu from "../DataPickMenu";
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const defectedRepository = RepositoryFactory.get("defected");
export default {
  name: "defected-record-edit-form",
  components: { DataPickMenu },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    this.supplier = {
      supplier_name: this.edit_object.supplier_name,
      supplier_ID: this.edit_object.supplier_ID
    };
    this.product = {
      product_name: this.edit_object.product_name,
      product_ID: this.edit_object.product_ID
    };
    this.storage = {
      storage_name: this.edit_object.storage_name,
      storage_ID: this.edit_object.storage_ID
    };
    this.quantity = this.edit_object.quantity;
    this.record_datetime = this.edit_object.record_datetime;
  },
  computed: {
    ...mapGetters({
      supplier_list: "suppliers/get_suppliers",
      product_list: "products/get_products",
      storage_list: "storages/get_storages",
      today: "date/get_dashed_date"
    })
  },
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      date: "",
      record_datetime: "",
      quantity: 0,
      supplier: Object,
      product: Object,
      storage: Object
    };
  },
  methods: {
    dateSelected: function(date) {
      this.date = date;
    },
    ...mapMutations({
      load_defected_data: "defected/load_data"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    async refresh() {
      const { data } = await defectedRepository.get();
      this.load_defected_data(data);
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;
        let formatted = {
          supplier_ID: this.supplier.supplier_ID,
          storage_ID: this.storage.storage_ID,
          product_ID: this.product.product_ID,
          updated_datetime: this.today,
          record_datetime: this.date,
          quantity: this.quantity,
          inout_type_ID: 4,
          record_ID: this.edit_object.record_ID
        };
        defectedRepository.update(formatted);
        this.close();
      } else {
        this.save_dialog = false;
      }
      setTimeout(() => {
        this.refresh();
      }, 1000);
    }
  }
};
</script>
