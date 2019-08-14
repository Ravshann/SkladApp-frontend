<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition' scrollable)
    v-card(title)
      // toolbar button for saving
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title Возврат
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected')
          // autocomplete fields
        v-autocomplete(
          v-model='client' 
          :items='clients' 
          label='От кого(клиент)' 
          prepend-icon='person' 
          persistent-hint 
          item-text='client_name'
          return-object)
        v-autocomplete(
          v-model='product' 
          :items='products' 
          label='Наименование товара' 
          prepend-icon='sort' 
          persistent-hint 
          item-text='product_name' 
          return-object)
        v-autocomplete(
          v-model='storage' 
          :items='storages' 
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
          item-text='quantity' 
          placeholder='0')
        v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
          v-icon(dark) add
        v-data-table(:headers='headers' :items='list')
          template(v-slot:items='props')
            td.text-xs-left {{ props.item.product_name }}
            td.text-xs-left {{ props.item.quantity }}
            td.text-xs-left {{ props.item.storage_name }}
            td.text-xs-left {{ props.item.client_name }}
            td.text-xs-left {{ props.item.date }}
            td.text-xs-left
              span
                v-icon(@click="deleteRecord(props.item)" color='red') clear
            td.text-xs-left
              span
                v-icon(@click="editRecord(props.item)" color='blue') create
        returned-record-edit-form(
          v-if="edit" 
          :appear="edit" 
          @edit-form-closed="editFinished" 
          :edit_object = "edit_object")         
</template>



<script>
import ReturnedRecordEditForm from "./ReturnedRecordEditForm";

import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("returned");

import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "returned-record-form",
  components: {
    ReturnedRecordEditForm
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients",
      products: "products/get_products",
      storages: "storages/get_storages",
      returned_data: "returned/get_returned_data",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      edit: false,
      edit_object: Object,
      edit_object_index: Number,
      dialog: false,
      save_records: false,
      inform_dialog_done: false,
      list: [],
      detailed_list: [],

      product: Object,
      storage: Object,
      client: Object,
      quantity: "",
      date: Date,

      headers: [
        {
          text: "Наименование товара",
          sortable: false
        },
        {
          text: "Количество",
          sortable: false
        },
        {
          text: "Склад",
          sortable: false
        },
        {
          text: "Получатель",
          sortable: false
        },
        {
          text: "Дата",
          sortable: false
        },
        {
          text: "",
          sortable: false
        },
        {
          text: "",
          sortable: false
        }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_returned_data: "returned/load_returned_data"
    }),
    dateSelected: function(date) {
      this.date = date;
    },
    clearAll() {
      this.list = [];
      this.detailed_list = [];
    },
    async getReturnedDataByStorage(storage_id) {
      const { data } = await repository.get_by_storage(storage_id);
      this.load_returned_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад")
        this.getReturnedDataByStorage(this.storages[0].storage_ID);
      else {
        const { data } = await repository.get();
        this.load_returned_data(data);
      }
    },
    deleteRecord(item) {
      const index = this.list.indexOf(item);
      let confirmation = confirm("Вы уверены, что хотите удалить эту запись?");
      if (confirmation) {
        this.list.splice(index, 1);
        this.detailed_list.splice(index, 1);
      }
    },
    editRecord(item) {
      const index = this.list.indexOf(item);
      this.edit_object = this.detailed_list[index];
      this.edit_object_index = index;
      this.edit = true;
    },
    editFinished(data) {
      if (data !== false) {
        let temp = this.list;
        temp[this.edit_object_index] = {
          product_name: data.product_name,
          storage_name: data.storage_name,
          quantity: data.quantity,
          client_name: data.client_name,
          date: data.record_datetime
        };

        this.list.splice(
          this.edit_object_index,
          1,
          temp[this.edit_object_index]
        );
        this.detailed_list[this.edit_object_index] = {
          product_ID: data.product_ID,
          storage_ID: data.storage_ID,
          client_ID: data.client_ID,
          quantity: data.quantity,
          record_datetime: data.record_datetime,
          inout_type_ID: 2,
          note: "some"
        };
      }
      this.edit = false;
    },
    add() {
      var newRow = {
        product_name: this.product.product_name,
        storage_name: this.storage.storage_name,
        quantity: this.quantity,
        client_name: this.client.client_name,
        date: this.date
      };
      var new_detailed_record = {
        product_ID: this.product.product_ID,
        storage_ID: this.storage.storage_ID,
        client_ID: this.client.client_ID,
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 3,
        note: "some return"
      };
      this.list.push(newRow);
      this.detailed_list.push(new_detailed_record);
      this.product = "";
      this.storage = "";
      this.quantity = "";
      this.client = "";
    },

    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        // save data
        var object = this.detailed_list;
        //make axios call to save it in backend
        repository.save(object);
        //clear data
        this.clearAll();
      } else {
        this.save_records = false;
      }
      let self = this;
      //update store
      setTimeout(function() {
        self.refresh();
      }, 2000);
    }
  }
};
</script>

