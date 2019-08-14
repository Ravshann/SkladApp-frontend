<template lang="pug">
div
  v-dialog(v-model='appear' max-width='800px' persistent  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='close(false)' title='отменить')
          v-icon close
        v-toolbar-title Изменить данные
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        // dialog for confirmation
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
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
import { mapGetters } from "vuex";

export default {
  name: "incoming-record-edit-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    let supplier = this.supplier_list.filter(obj => {
      return obj.supplier_ID === this.edit_object.supplier_ID;
    });
    let product = this.product_list.filter(obj => {
      return obj.product_ID === this.edit_object.product_ID;
    });
    let storage = this.storage_list.filter(obj => {
      return obj.storage_ID === this.edit_object.storage_ID;
    });
    this.supplier = supplier[0];
    this.product = product[0];
    this.storage = storage[0];
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
      save_records: false,
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
    dateSelected(date) {
      this.date = date;
    },
    close(data) {
      this.$emit("edit-form-closed", data);
    },

    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        let formatted = {
          supplier_ID: this.supplier.supplier_ID,
          supplier_name: this.supplier.supplier_name,
          storage_ID: this.storage.storage_ID,
          product_name: this.product.product_name,
          product_ID: this.product.product_ID,
          storage_name: this.storage.storage_name,
          record_datetime: this.date,
          quantity: this.quantity,
          inout_type_ID: 2
        };

        this.close(formatted);
      } else {
        this.save_records = false;
      }
    }
  }
};
</script>
