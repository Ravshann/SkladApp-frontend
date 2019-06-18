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
        // dialog for confirmation
        v-dialog(v-model='save_records' max-width='290')
          v-card
            v-card-title.headline save changes?
            v-card-text all changes will be saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
        v-dialog(v-model='inform_dialog_done' max-width='290')
          v-card
            v-card-title.headline changes saved
            v-card-text all changes are saved.
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
        v-btn(fab dark color='red' justify-center @click.prevent='clearAll' title='очистить')
          v-icon(dark) remove
        v-data-table(:headers='headers' :items='list')
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
const repository = RepositoryFactory.get("returned");

import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "returned-record-form",
  components: {
    DataPickMenu
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients",
      products: "products/get_products",
      storages: "storages/get_storages",
      returned_data: "returned/get_returned_data"
    })
  },
  data() {
    return {
      dialog: false,
      save_records: false,
      inform_dialog_done: false,
      list: [],
      detailed_list: [],
      record_count: 0,
      product: Object,
      storage: Object,
      client: Object,
      quantity: "",
      date: Date,

      headers: [
        {
          text: "N#",
          align: "left",
          sortable: false
        },
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
      this.record_count = 0;
      this.list = [];
      this.detailed_list = [];
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_returned_data(data);
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
        self.updateStore();
      }, 500);
    }
  }
};
</script>

