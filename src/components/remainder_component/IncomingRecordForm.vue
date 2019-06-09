<template lang="pug">
div
  // button for opening dialog
  v-btn(color='primary' dark='' @click='incoming_dialog = true') Приход
  // dialog for 'outgoing' button
  v-dialog(v-model='incoming_dialog' fullscreen='' hide-overlay='' transition='dialog-bottom-transition' scrollable='')
    v-card(title='')
      v-toolbar(card='' dark='' color='primary')
        v-btn(icon='' dark='' @click='incoming_dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title Приход
        v-spacer
        v-toolbar-items
          v-btn(dark='' flat='' @click='save_incoming_records = true') Добавить
        // dialog for confirmation
        v-dialog(v-model='save_incoming_records' max-width='290')
          v-card
            v-card-title.headline make imports?
            v-card-text all imports will be saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
        v-dialog(v-model='inform_dialog_done' max-width='290')
          v-card
            v-card-title.headline exports saved
            v-card-text all exports are saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected')
          // autocomplete fields
        v-autocomplete(
          v-model='supplier'
          :items='suppliers' 
          label='Поставщики' 
          prepend-icon='local_shipping' 
          persistent-hint='' 
          item-text='supplier_name'
          return-object)
        v-autocomplete(
          v-model='product' 
          :items='products' 
          label='Наименование товара' 
          prepend-icon='sort' 
          persistent-hint='' 
          item-text='product_name'
          return-object)
        v-autocomplete(
          v-model='storage' 
          :items='storages' 
          label='Склад' 
          prepend-icon='home' 
          persistent-hint='' 
          item-text='storage_name'
          return-object)
        v-text-field(v-model.number='quantity' type='number' label='Количество' prepend-icon='edit' placeholder='0')
        v-btn(fab='' dark='' color='indigo' justify-center='' @click.prevent='add' title='добавить')
          v-icon(dark='') add
        v-btn(fab='' dark='' color='red' justify-center='' @click.prevent='clearAll' title='очистить')
          v-icon(dark='') remove
        v-data-table(:headers='headers' :items='importdata')
          template(v-slot:items='props')
            td(sortable='true') {{ props.item.record_count }}
            td.text-xs-left {{ props.item.product_name }}
            td.text-xs-left {{ props.item.quantity }}
            td.text-xs-left {{ props.item.storage_name }}
            td.text-xs-left {{ props.item.supplier_name }}
            td.text-xs-left {{ props.item.date }}
</template>
<script>
import DataPickMenu from "../DataPickMenu";
import RepositoryFactory from "../../services/RepositoryFactory";
const incomingRepository = RepositoryFactory.get("incoming");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "incoming-record-form",
  components: {
    DataPickMenu
  },
  created() {
    this.getIncomingData();
  },
  computed: {
    ...mapGetters({
      suppliers: "suppliers/get_suppliers",
      products: "products/get_products",
      storages: "storages/get_storages",
      remainder_data: "remainders/get_remainder_data",
      incoming_data: "incoming/get_incoming_data"
    })
  },
  data: function() {
    return {
      incoming_dialog: false,
      save_incoming_records: false,
      inform_dialog_done: false,
      importdata: [],
      detailed_import_list: [],
      record_count: 0,
      product: Object,
      storage: Object,
      supplier: Object,
      quantity: "",
      date: Date,
      headers: [
        {
          text: "N#",
          align: "left",
          value: "number"
        },
        {
          text: "Наименование товара",
          value: "product_name"
        },
        {
          text: "Количество",
          value: "quantity"
        },
        {
          text: "Склад",
          value: "storage_name"
        },
        {
          text: "Получатель",
          value: "supplier_name"
        },
        {
          text: "Дата",
          value: "date"
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
    async getIncomingData() {
      const { data } = await incomingRepository.get();
      this.load_incoming_data(data);
    },
    clearAll: function() {
      this.record_count = 0;
      this.importdata = [];
      this.detailed_import_list = [];
    },
    updateStore() {
      let new_in = [...this.incoming_data, this.detailed_import_list];
      this.load_incoming_data(new_in);
      let newArray = this.remainder_data;
      this.detailed_import_list.forEach(record => {
        this.remainder_data.forEach(data => {
          var newItem = data;
          if (newItem.productID === record.product_ID) {
            let index = this.remainder_data.indexOf(newItem);
            newItem.total += record.quantity;
            newItem.storageQuantities.forEach(pair => {
              if (pair.storageID === record.storage_ID)
                pair.quantity += record.quantity;
            });
            newArray[index] = newItem;
          }
        });
      });
      this.load_remainder_data(newArray);
    },
    add() {
      this.record_count++;
      var newRow = {
        record_count: this.record_count + "",
        product_name: this.product.product_name,
        storage_name: this.storage.storage_name,
        quantity: this.quantity,
        supplier_name: this.supplier.supplier_name,
        date: this.date
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
        // save data
        var object = this.detailed_import_list;
        //update store
        this.updateStore();
        //make axios call to save it in backend
        incomingRepository.save(object);
        //clear data
        this.clearAll();
      } else {
        this.save_incoming_records = false;
      }
    }
  }
};
</script>