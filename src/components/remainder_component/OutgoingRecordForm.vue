<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#36BD9C' dark @click='outgoing_dialog = true') Расход
  // dialog for 'outgoing' button
  v-dialog(v-model='outgoing_dialog' fullscreen hide-overlay transition='dialog-bottom-transition' scrollable)
    v-card(title)
      // toolbar button for saving
      v-toolbar(card dark color='#36BD9C')
        v-btn(icon dark @click='outgoing_dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title Расход
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_outgoing_records = true') Сохранить
        save-changes-dialog(:save_records="save_outgoing_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected')
          // autocomplete fields
        v-autocomplete(
          v-model='client' 
          :items='clients' 
          label='Получатель' 
          prepend-icon='person' 
          persistent-hint 
          item-text='client_name'
          return-object)
        v-autocomplete(
          v-model='product' 
          :items='remainder_data' 
          label='Наименование товара' 
          prepend-icon='sort' 
          persistent-hint 
          item-text='productName' 
          return-object)
        v-autocomplete(
          v-model='storage' 
          :items='storages' 
          label='Склад' 
          prepend-icon='home' 
          persistent-hint 
          item-text='storage_name'
          return-object)
        v-text-field#quantity(
          v-model.number='quantity' 
          type='number' 
          name='quantity' 
          label='Количество' 
          prepend-icon='edit' 
          item-text='quantity' 
          placeholder='0')
        v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
          v-icon(dark) add
        v-data-table(:headers='headers_export' :items='exportdata')
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
        outgoing-record-edit-form(v-if="edit" :appear="edit" @edit-form-closed="editFinished" :edit_object = "edit_object")
</template>



<script>
import OutgoingRecordEditForm from "./OutgoingRecordEditForm";
import RepositoryFactory from "../../services/RepositoryFactory";
const remainderRepository = RepositoryFactory.get("remainder");
const outgoingRepository = RepositoryFactory.get("outgoing");
import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "outgoing-record-form",
  components: {
    OutgoingRecordEditForm
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients",
      products: "products/get_products",
      storages: "storages/get_storages",
      remainder_data: "remainders/get_remainder_data",
      outgoing_data: "outgoing/get_outgoing_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data() {
    return {
      edit: false,
      edit_object: Object,
      edit_object_index: Number,
      outgoing_dialog: false,
      save_outgoing_records: false,
      inform_dialog_done: false,
      exportdata: [],
      detailed_export_list: [],
      product: Object,
      storage: Object,
      client: Object,
      quantity: Number(),
      date: Date,

      headers_export: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        {
          text: "Количество",
          value: "quantity",
          sortable: false
        },
        {
          text: "Склад",
          value: "storage_name",
          sortable: false
        },
        {
          text: "Получатель",
          value: "client_name",
          sortable: false
        },
        {
          text: "Дата",
          value: "date",
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
      load_outgoing_data: "outgoing/load_outgoing_data",
      load_remainder_data: "remainders/load_remainder_data"
    }),
    dateSelected: function(date) {
      this.date = date;
    },
    deleteRecord(item) {
      const index = this.exportdata.indexOf(item);
      let confirmation = confirm("Вы уверены, что хотите удалить эту запись?");
      if (confirmation) {
        this.exportdata.splice(index, 1);
        this.detailed_export_list.splice(index, 1);
      }
    },
    editRecord(item) {
      const index = this.exportdata.indexOf(item);
      this.edit_object = this.detailed_export_list[index];
      this.edit_object_index = index;
      this.edit = true;
    },
    editFinished(data) {
      if (data !== false) {
        let temp = this.exportdata;
        temp[this.edit_object_index] = {
          product_name: data.product_name,
          storage_name: data.storage_name,
          quantity: data.quantity,
          client_name: data.client_name,
          record_datetime: data.record_datetime
        };

        this.exportdata.splice(
          this.edit_object_index,
          1,
          temp[this.edit_object_index]
        );
        this.detailed_export_list[this.edit_object_index] = {
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
    async getOutgoingData() {
      const { data } = await outgoingRepository.get();
      this.load_outgoing_data(data);
    },
    async getOutgoingDataByStorage(storage_id) {
      const { data } = await outgoingRepository.get_by_storage(storage_id);
      this.load_outgoing_data(data);
    },
    async refreshRemainder() {
      const { data } = await remainderRepository.get();
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },
    async refreshRemainderByStorage() {
      var storage_id = this.storage_list[0].storage_ID;
      const { data } = await remainderRepository.get_by_storage(storage_id);
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },

    clearAll() {
      this.record_count = 0;
      this.exportdata = [];
      this.detailed_export_list = [];
    },
    updateStore() {
      setTimeout(() => {
        if (this.user_role === "Завсклад") {
          this.getOutgoingDataByStorage(this.storage_list[0].storage_ID);
          this.refreshRemainderByStorage();
        } else {
          this.refreshRemainder();
          this.getOutgoingData();
        }
      }, 2000);
    },
    add() {
      var newRow = {
        product_name: this.product.productName,
        storage_name: this.storage.storage_name,
        quantity: this.quantity,
        client_name: this.client.client_name,
        date: this.date
      };
      var new_detailed_export_record = {
        product_ID: this.product.productID,
        storage_ID: this.storage.storage_ID,
        client_ID: this.client.client_ID,
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 1,
        note: "some"
      };
      this.exportdata.push(newRow);
      this.detailed_export_list.push(new_detailed_export_record);
      this.product = "";
      this.storage = "";
      this.quantity = "";
      this.client = "";
    },

    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_outgoing_records = false;
        //make axios call to save it in backend
        outgoingRepository.save(this.detailed_export_list);
        //update store
        this.updateStore();
        //clear data
        this.clearAll();
      } else {
        this.save_outgoing_records = false;
      }
    }
  }
};
</script>

