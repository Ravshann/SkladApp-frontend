<template lang="pug">
div
  v-dialog(v-model='appear' max-width='800px' persistent  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='closeNotSaving' title='отменить')
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
          v-model='supplier_storage' 
          :items="storage_list" 
          label='Склад отправитель' 
          prepend-icon='home' 
          persistent-hint 
          item-text='storage_name'
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
          label='Склад получатель' 
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
const exchangeRepository = RepositoryFactory.get("exchanges");
export default {
  name: "exchange-record-edit-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object.supplier_storage_name !== undefined) {
      this.supplier_storage = {
        storage_name: this.edit_object.supplier_storage_name,
        storage_ID: this.edit_object.supplier_storage_ID
      };

      this.product = {
        product_name: this.edit_object.product_name,
        product_ID: this.edit_object.product_ID
      };
      this.storage = {
        storage_name: this.edit_object.storage_name,
        storage_ID: this.edit_object.storage_ID
      };
    } else {
      let supplier_storage = this.storage_list.filter(obj => {
        return obj.storage_ID === this.edit_object.supplier_storage_ID;
      });
      let product = this.product_list.filter(obj => {
        return obj.product_ID === this.edit_object.product_ID;
      });
      let storage = this.storage_list.filter(obj => {
        return obj.storage_ID === this.edit_object.storage_ID;
      });
      this.supplier_storage = supplier_storage[0];
      this.product = product[0];
      this.storage = storage[0];
    }
    this.quantity = this.edit_object.quantity;
    this.record_datetime = this.edit_object.record_datetime;
  },
  computed: {
    ...mapGetters({
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
      supplier_storage: Object,
      product: Object,
      storage: Object
    };
  },
  methods: {
    dateSelected: function(date) {
      this.date = date;
    },
    ...mapMutations({
      load_exchange_data: "exchange/load_data"
    }),
    closeNotSaving() {
      this.$emit("edit-form-closed", false);
    },
    close(data) {
      this.$emit("edit-form-closed", data);
      if (this.edit_object.supplier_storage_name !== undefined) {
        exchangeRepository.update(data);
        setTimeout(() => {
          this.refresh();
        }, 2000);
      }
    },
    async getExchangeDataByStorage(storage_id) {
      const { data } = await exchangeRepository.get_by_storage(storage_id);
      this.load_exchange_data(data);
    },
    async getExchangeDataBySupplierStorage(storage_id) {
      const { data } = await exchangeRepository.get_by_supplier_storage(
        storage_id
      );
      this.load_exchange_data(data);
    },
    async getExchangeDataByDepartment(storage_ids) {
      const { data } = await exchangeRepository.get_by_department_storages(
        storage_ids
      );
      this.load_exchange_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад") {
        if (this.storage_list[0].storage_type === "Exchange")
          this.getExchangeDataByStorage(this.storage_list[0].storage_ID);
        else
          this.getExchangeDataBySupplierStorage(
            this.storage_list[0].storage_ID
          );
      } else if (this.user_role === "Управляющий") {
        let storage_ids = this.storage_list.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getExchangeDataByDepartment(storage_ids);
      } else {
        const { data } = await exchangeRepository.get();
        this.load_exchange_data(data);
      }
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;
        let formatted = {
          supplier_storage_ID: this.supplier_storage.storage_ID,
          supplier_storage_name: this.supplier_storage.storage_name,
          storage_ID: this.storage.storage_ID,
          storage_name: this.storage.storage_name,
          product_name: this.product.product_name,
          product_ID: this.product.product_ID,
          record_datetime: this.date,
          quantity: this.quantity,
          inout_type_ID: 4
        };
        if (this.edit_object.record_ID !== undefined) {
          formatted.updated_datetime = this.today;
          formatted.record_ID = this.edit_object.record_ID;
        }
        this.close(formatted);
      } else {
        this.save_dialog = false;
      }
    }
  }
};
</script>
