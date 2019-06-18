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
        // dialog for confirmation
        v-dialog(v-model='save_outgoing_records' max-width='290')
          v-card
            v-card-title.headline make exports?
            v-card-text all exports will be saved.
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
          v-model='client' 
          :items='clients' 
          label='Получатель' 
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
        v-text-field#quantity(v-model.number='quantity' type='number' name='quantity' label='Количество' prepend-icon='edit' item-text='quantity' placeholder='0', )
        v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
          v-icon(dark) add
        v-btn(fab dark color='red' justify-center @click.prevent='clearAll' title='очистить')
          v-icon(dark) remove
        v-data-table(:headers='headers_export' :items='exportdata')
          template(v-slot:items='props')
            td(sortable='true') {{ props.item.record_count }}
            td.text-xs-left {{ props.item.product_name }}
            td.text-xs-left {{ props.item.quantity }}
            td.text-xs-left {{ props.item.storage_name }}
            td.text-xs-left {{ props.item.client_name }}
            td.text-xs-left {{ props.item.date }}
</template>



<script>
import DataPickMenu from "../DataPickMenu";
import RepositoryFactory from "../../services/RepositoryFactory";
const remainderRepository = RepositoryFactory.get("remainder");
const outgoingRepository = RepositoryFactory.get("outgoing");
import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "outgoing-record-form",
  components: {
    DataPickMenu
  },
  created() {
    this.getOutgoingData();
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients",
      products: "products/get_products",
      storages: "storages/get_storages",
      remainder_data: "remainders/get_remainder_data",
      outgoing_data: "outgoing/get_outgoing_data"
    })
  },
  data() {
    return {
      outgoing_dialog: false,
      save_outgoing_records: false,
      inform_dialog_done: false,
      exportdata: [],
      detailed_export_list: [],
      record_count: 0,
      product: Object,
      storage: Object,
      client: Object,
      quantity: "",
      date: Date,

      headers_export: [
        {
          text: "N#",
          align: "left",
          value: "number",
          sortable: false
        },
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
    async getOutgoingData() {
      const { data } = await outgoingRepository.get();
      this.load_outgoing_data(data);
    },
    async refreshRemainder() {
      const { data } = await remainderRepository.get();
      this.load_remainder_data(data);
    },
    clearAll() {
      this.record_count = 0;
      this.exportdata = [];
      this.detailed_export_list = [];
    },
    updateStore() {
      setTimeout(() => {
        this.refreshRemainder();
        this.getOutgoingData();
      }, 1000);
    },
    add() {
      this.record_count++;
      var newRow = {
        record_count: this.record_count + "",
        product_name: this.product.product_name,
        storage_name: this.storage.storage_name,
        quantity: this.quantity,
        client_name: this.client.client_name,
        date: this.date
      };
      var new_detailed_export_record = {
        product_ID: this.product.product_ID,
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

