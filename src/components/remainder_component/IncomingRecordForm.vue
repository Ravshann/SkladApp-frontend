<template lang="pug">
div
  // button for opening dialog
  v-btn(color='primary' dark @click='incoming_dialog = true') Приход
  // dialog for 'outgoing' button
  v-dialog(v-model='incoming_dialog' fullscreen hide-overlay transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='incoming_dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title Приход
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_incoming_records = true') Добавить
        save-changes-dialog(:save_records="save_incoming_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected')
          // autocomplete fields
        v-autocomplete(
          v-model='supplier'
          :items='suppliers' 
          label='Поставщики' 
          prepend-icon='local_shipping' 
          persistent-hint 
          item-text='supplier_name'
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
        v-text-field(v-model.number='quantity' type='number' label='Количество' prepend-icon='edit' placeholder='0')
        v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
          v-icon(dark) add
        v-data-table(:headers='headers' :items='importdata')
          template(v-slot:items='props')
            td.text-xs-left {{ props.item.product_name }}
            td.text-xs-left {{ props.item.quantity }}
            td.text-xs-left {{ props.item.storage_name }}
            td.text-xs-left {{ props.item.supplier_name }}
            td.text-xs-left {{ props.item.record_datetime }}
            td.text-xs-left
              span
                v-icon(@click="deleteRecord(props.item)" color='red') clear
            td.text-xs-left
              span
                v-icon(@click="editRecord(props.item)" color='blue') create
        incoming-record-edit-form(v-if="edit" :appear="edit" @edit-form-closed="editFinished" :edit_object = "edit_object") 
</template>
<script>
import IncomingRecordEditForm from "./IncomingRecordEditForm";
import RepositoryFactory from "../../services/RepositoryFactory";
const remainderRepository = RepositoryFactory.get("remainder");
const incomingRepository = RepositoryFactory.get("incoming");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "incoming-record-form",
  components: {
    IncomingRecordEditForm
  },

  computed: {
    ...mapGetters({
      suppliers: "suppliers/get_suppliers",
      products: "products/get_products",
      storages: "storages/get_storages",
      remainder_data: "remainders/get_remainder_data",
      incoming_data: "incoming/get_incoming_data",
      user_role: "logged_user/get_user_role",
    })
  },
  data() {
    return {
      edit: false,
      edit_object: Object,
      edit_object_index: Number,
      incoming_dialog: false,
      save_incoming_records: false,
      inform_dialog_done: false,
      importdata: [],
      detailed_import_list: [],
      product: Object,
      storage: Object,
      supplier: Object,
      quantity: Number(),
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
      load_incoming_data: "incoming/load_incoming_data",
      load_remainder_data: "remainders/load_remainder_data"
    }),
    dateSelected: function(date) {
      this.date = date;
    },
    deleteRecord(item) {
      const index = this.importdata.indexOf(item);
      let confirmation = confirm("Вы уверены, что хотите удалить эту запись?");
      if (confirmation) {
        this.importdata.splice(index, 1);
        this.detailed_import_list.splice(index, 1);
      }
    },
    editRecord(item) {
      const index = this.importdata.indexOf(item);
      this.edit_object = this.detailed_import_list[index];
      this.edit_object_index = index;
      this.edit = true;
    },
    editFinished(data) {
      if (data !== false) {
        this.edit = false;
        let temp = this.importdata;
        temp[this.edit_object_index] = {
          product_name: data.product_name,
          storage_name: data.storage_name,
          quantity: data.quantity,
          supplier_name: data.supplier_name,
          record_datetime: data.record_datetime
        };

        this.importdata.splice(
          this.edit_object_index,
          1,
          temp[this.edit_object_index]
        );

        this.detailed_import_list[this.edit_object_index] = {
          product_ID: data.product_ID,
          storage_ID: data.storage_ID,
          supplier_ID: data.supplier_ID,
          quantity: data.quantity,
          record_datetime: data.record_datetime,
          inout_type_ID: 2,
          note: "some"
        };
      }
      this.edit = false;
    },
    async getIncomingData() {
      const { data } = await incomingRepository.get();
      this.load_incoming_data(data);
    },
    async refreshRemainder() {
      const { data } = await remainderRepository.get();
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },
    async refreshRemainderByStorage() {
      var storage_id = this.storages[0].storage_ID;
      const { data } = await remainderRepository.get_by_storage(storage_id);
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },
    async getIncomingDataByStorage(storage_id) {
      const { data } = await incomingRepository.get_by_storage(storage_id);
      this.load_incoming_data(data);
    },
    clearAll: function() {
      this.importdata = [];
      this.detailed_import_list = [];
    },
    updateStore() {
      setTimeout(() => {
        if (this.user_role === "Завсклад") {
          this.getIncomingDataByStorage(this.storages[0].storage_ID);
          this.refreshRemainderByStorage();
        } else {
          this.refreshRemainder();
          this.getIncomingData();
        }
      }, 2000);
    },
    add() {
      var newRow = {
        product_name: this.product.product_name,
        storage_name: this.storage.storage_name,
        quantity: this.quantity,
        supplier_name: this.supplier.supplier_name,
        record_datetime: this.date
      };
      var new_detailed_record = {
        product_ID: this.product.product_ID,
        storage_ID: this.storage.storage_ID,
        supplier_ID: this.supplier.supplier_ID,
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 2,
        note: "some"
      };
      this.importdata.push(newRow);
      this.detailed_import_list.push(new_detailed_record);
      this.product = "";
      this.storage = "";
      this.quantity = "";
      this.supplier = "";
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_incoming_records = false;
        //make axios call to save it in backend
        incomingRepository.save(this.detailed_import_list);
        //update store
        this.updateStore();
        //clear data
        this.clearAll();
      } else {
        this.save_incoming_records = false;
      }
    }
  }
};
</script>