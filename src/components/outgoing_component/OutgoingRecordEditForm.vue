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
          v-model='client' 
          :items="client_list" 
          label='Получатель' 
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
          :readonly='user_role==="Завсклад" ? true : false'
          v-model.number='price' 
          type='number' 
          label='Цена' 
          prepend-icon='$vuetify.icons.money' 
          placeholder='0')
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
const outgoingRepository = RepositoryFactory.get("outgoing");
export default {
  name: "outgoing-record-edit-form",
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
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
    this.price = this.edit_object.price;
    this.quantity = this.edit_object.quantity;
    this.record_datetime = this.edit_object.record_datetime;
  },
  computed: {
    ...mapGetters({
      client_list: "clients/get_clients",
      product_list: "products/get_products",
      storage_list: "storages/get_storages",
      today_dashed: "date/get_dashed_date",
      user_role: "logged_user/get_user_role",
      formatted_outgoing_records: "outgoing/get_formatted_data"
    })
  },
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      selectedDate: "",
      record_datetime: "",
      quantity: 0,
      price: 0,
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
      load_outgoing_data: "outgoing/load_outgoing_data",
      load_formatted_data: "outgoing/load_formatted_data"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    async getOutgoingDataByStorage(storage_id) {
      const { data } = await outgoingRepository.get_by_storage(storage_id);
      let formatted_data = this.outgoing_format(data);
      this.load_formatted_data(formatted_data);
      this.load_outgoing_data(data);
    },
    async getOutgoingDataByDepartment(storage_ids) {
      const { data } = await outgoingRepository.get_by_department_storages(
        storage_ids
      );
      let formatted_data = this.outgoing_format(data);
      this.load_formatted_data(formatted_data);
      this.load_outgoing_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад")
        this.getOutgoingDataByStorage(this.storage_list[0].storage_ID);
      else if (this.user_role === "Управляющий") {
        let storage_ids = this.storage_list.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getOutgoingDataByDepartment(storage_ids);
      } else {
        const { data } = await outgoingRepository.get();

        let formatted_data = this.outgoing_format(data);
        this.load_formatted_data(formatted_data);
        this.load_outgoing_data(data);
      }
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;
        let formatted = {
          client_ID: this.client.client_ID,
          storage_ID: this.storage.storage_ID,
          product_ID: this.product.product_ID,
          updated_datetime: this.today_dashed,
          record_datetime: this.selectedDate,
          quantity: this.quantity,
          price: this.price,
          inout_type_ID: 1,
          record_ID: this.edit_object.record_ID
        };
        outgoingRepository.update(formatted);
        this.close();
      } else {
        this.save_dialog = false;
      }
      setTimeout(() => {
        this.refresh();
      }, 1000);
    },
    outgoing_format(data) {
      let total_quantity = 0;
      let total_price = 0;
      let operated_data = data;
      let product_quantities = [];
      let general_list = [];
      data.sort(function(a, b) {
        return (
          a.record_datetime === b.record_datetime &&
          a.client_name.toLowerCase().localeCompare(b.client_name)
        );
      });

      for (let i = 0; i < operated_data.length; i++) {
        let next = operated_data[i + 1];
        if (next !== undefined) {
          if (
            operated_data[i].record_datetime ===
              operated_data[i + 1].record_datetime &&
            operated_data[i].client_name === operated_data[i + 1].client_name
          ) {
            total_quantity += operated_data[i].quantity;
            total_price += operated_data[i].quantity * operated_data[i].price;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID
            });
          } else {
            total_quantity += operated_data[i].quantity;
            total_price += operated_data[i].quantity * operated_data[i].price;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID
            });
            general_list.push({
              record_datetime: operated_data[i].record_datetime,
              client_name: operated_data[i].client_name,
              total_quantity: total_quantity,
              total_price: total_price,
              product_quantities: product_quantities
            });
            // if (i !== operated_data.length - 2) {
              product_quantities = [];
              total_quantity = 0;
              total_price = 0;
            // }
          }
        } else {
          total_price += operated_data[i].quantity * operated_data[i].price;
          total_quantity += operated_data[i].quantity;
          product_quantities.push({
            price: operated_data[i].price,
            product_name: operated_data[i].product_name,
            quantity: operated_data[i].quantity,
            storage_name: operated_data[i].storage_name,
            record_ID: operated_data[i].record_ID
          });
          general_list.push({
            record_datetime: operated_data[i].record_datetime,
            client_name: operated_data[i].client_name,
            total_quantity: total_quantity,
            total_price: total_price,
            product_quantities: product_quantities
          });
        }
      }
      return general_list;
    }
  }
};
</script>
