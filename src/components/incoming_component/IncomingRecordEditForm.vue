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
        save-changes-dialog(:save_records="save_dialog" @save-changes-dialog-event="saveChanges")
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
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const incomingRepository = RepositoryFactory.get("incoming");
export default {
  name: "incoming-record-edit-form",
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
      today: "date/get_dashed_date",
      user_role: "logged_user/get_user_role"
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
    dateSelected(date) {
      this.date = date;
    },
    ...mapMutations({
      load_incoming_data: "incoming/load_incoming_data"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    async getIncomingDataByStorage(storage_id) {
      const { data } = await incomingRepository.get_by_storage(storage_id);
      this.load_incoming_data(data);
    },
    async getIncomingDataByDepartment(storage_ids) {
      const { data } = await incomingRepository.get_by_department_storages(
        storage_ids
      );
      this.load_incoming_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад")
        this.getIncomingDataByStorage(this.storage_list[0].storage_ID);
      else if (this.user_role === "Управляющий") {
        let storage_ids = this.storage_list.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getIncomingDataByDepartment(storage_ids);
      } else {
        const { data } = await incomingRepository.get();
        this.load_incoming_data(data);
      }
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
          inout_type_ID: 2,
          record_ID: this.edit_object.record_ID
        };
        incomingRepository.update(formatted);
        this.close();
      } else {
        this.save_dialog = false;
      }
      let self = this;
      setTimeout(function() {
        self.refresh();
      }, 1000);
    }
  }
};
</script>
