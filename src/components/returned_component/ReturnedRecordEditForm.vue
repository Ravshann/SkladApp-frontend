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
          v-model='client' 
          :items="client_list" 
          label='От кого(клиент)' 
          prepend-icon='person'  
          persistent-hint 
          item-text='client_name'
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
const returnedRepository = RepositoryFactory.get("returned");
export default {
  name: "returned-record-edit-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object.client_name !== undefined) {
      this.client = {
        client_name: this.edit_object.client_name,
        client_ID: this.edit_object.client_ID
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
      let client = this.client_list.filter(obj => {
        return obj.client_ID === this.edit_object.client_ID;
      });
      let product = this.product_list.filter(obj => {
        return obj.product_ID === this.edit_object.product_ID;
      });
      let storage = this.storage_list.filter(obj => {
        return obj.storage_ID === this.edit_object.storage_ID;
      });
      this.client = client[0];
      this.product = product[0];
      this.storage = storage[0];
    }
    this.quantity = this.edit_object.quantity;
    this.record_datetime = this.edit_object.record_datetime;
  },
  computed: {
    ...mapGetters({
      client_list: "clients/get_clients",
      product_list: "products/get_products",
      storage_list: "storages/get_storages",
      today_dashed: "date/get_dashed_date",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      selectedDate: "",
      record_datetime: "",
      quantity: 0,
      client: Object,
      product: Object,
      storage: Object
    };
  },
  methods: {
    dateSelected(date) {
      this.selectedDate = date;
    },
    ...mapMutations({
      load_returned_data: "returned/load_returned_data"
    }),
    closeNotSaving() {
      this.$emit("edit-form-closed", false);
    },
    close(data) {
      this.$emit("edit-form-closed", data);
      if (this.edit_object.client_name !== undefined) {
        returnedRepository.update(data);
        setTimeout(() => {
          this.refresh();
        }, 2000);
      }
    },
    async getReturnedDataByStorage(storage_id) {
      const { data } = await returnedRepository.get_by_storage(storage_id);
      this.load_returned_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад")
        this.getReturnedDataByStorage(this.storage_list[0].storage_ID);
      else {
        const { data } = await returnedRepository.get();
        this.load_returned_data(data);
      }
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;

        let formatted = {
          client_ID: this.client.client_ID,
          client_name: this.client.client_name,
          storage_ID: this.storage.storage_ID,
          storage_name: this.storage.storage_name,
          product_name: this.product.product_name,
          product_ID: this.product.product_ID,
          record_datetime: this.selectedDate,
          quantity: this.quantity,
          inout_type_ID: 3,
          note: "some"
        };
        if (this.edit_object.record_ID !== undefined) {
          formatted.updated_datetime = this.today_dashed;
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
