<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#36BD9C' dark='' @click='outgoing_dialog = true') &Rcy;&acy;&scy;&khcy;&ocy;&dcy;
  // dialog for 'outgoing' button
  v-dialog(v-model='outgoing_dialog' fullscreen='' hide-overlay='' transition='dialog-bottom-transition' scrollable='')
    v-card(title='')
      // toolbar button for saving
      v-toolbar(card='' dark='' color='#36BD9C')
        v-btn(icon='' dark='' @click='outgoing_dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title &Rcy;&acy;&scy;&khcy;&ocy;&dcy;
        v-spacer
        v-toolbar-items
          v-btn(dark='' flat='' @click='save_outgoing_records = true') &Scy;&ocy;&khcy;&rcy;&acy;&ncy;&icy;&tcy;&softcy;
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
          v-autocomplete(v-model='client_name' :items='clients' label='Получатель' prepend-icon='person' persistent-hint='' item-text='client_name')
          v-autocomplete(v-model='product_name' :items='products' label='Наименование товара' prepend-icon='sort' persistent-hint='' item-text='product_name')
          v-autocomplete(v-model='store_name' :items='storages' label='Склад' prepend-icon='home' persistent-hint='' item-text='storage_name')
          v-text-field#quantity(v-model.number='quantity' type='number' name='quantity' label='Количество' prepend-icon='edit' item-text='quantity' placeholder='0')
          v-btn(fab='' dark='' color='indigo' justify-center='' @click.prevent='add' title='добавить')
            v-icon(dark='') add
          v-btn(fab='' dark='' color='red' justify-center='' @click.prevent='clearAll' title='очистить')
            v-icon(dark='') remove
          v-data-table(:headers='headers_export' :items='exportdata')
            template(v-slot:items='props')
              td(sortable='true') {{ props.item.record_count }}
              td.text-xs-left {{ props.item.product_name }}
              td.text-xs-left {{ props.item.quantity }}
              td.text-xs-left {{ props.item.store_name }}
              td.text-xs-left {{ props.item.client_name }}
              td.text-xs-left {{ props.item.date }}

  //- <div>
  //-   <!-- button for opening dialog -->
  //-   <v-btn color="#36BD9C" dark @click="outgoing_dialog = true">Расход</v-btn>
  //-   <!-- dialog for 'outgoing' button -->
  //-   <v-dialog
  //-     v-model="outgoing_dialog"
  //-     fullscreen
  //-     hide-overlay
  //-     transition="dialog-bottom-transition"
  //-     scrollable
  //-   >
  //-     <v-card title>
  //-       <!-- toolbar button for saving -->
  //-       <v-toolbar card dark color="#36BD9C">
  //-         <v-btn icon dark @click="outgoing_dialog = false" title="свернуть">
  //-           <v-icon>close</v-icon>
  //-         </v-btn>
  //-         <v-toolbar-title>Расход</v-toolbar-title>
  //-         <v-spacer></v-spacer>
  //-         <v-toolbar-items>
  //-           <v-btn dark flat @click="save_outgoing_records = true">Сохранить</v-btn>
  //-         </v-toolbar-items>
  //-         <!-- dialog for confirmation -->
  //-         <v-dialog v-model="save_outgoing_records" max-width="290">
  //-           <v-card>
  //-             <v-card-title class="headline">make exports?</v-card-title>
  //-             <v-card-text>all exports will be saved.</v-card-text>
  //-             <v-card-actions>
  //-               <v-spacer></v-spacer>
  //-               <v-btn
  //-                 color="green darken-1"
  //-                 flat="flat"
  //-                 @click.prevent="saveChanges(true)"
  //-               >continue</v-btn>
  //-               <v-btn color="green darken-1" flat="flat" @click.prevent="saveChanges(false)">cancel</v-btn>
  //-             </v-card-actions>
  //-           </v-card>
  //-         </v-dialog>
  //-         <!-- dialog for notifiying -->
  //-         <v-dialog v-model="inform_dialog_done" max-width="290">
  //-           <v-card>
  //-             <v-card-title class="headline">exports saved</v-card-title>
  //-             <v-card-text>all exports are saved.</v-card-text>
  //-             <v-card-actions>
  //-               <v-spacer></v-spacer>
  //-               <v-btn color="green darken-1" flat="flat" @click="inform_dialog_done=false">ok</v-btn>
  //-             </v-card-actions>
  //-           </v-card>
  //-         </v-dialog>
  //-       </v-toolbar>
  //-       <v-card-text>
  //-         <!-- data pick menu -->
  //-         <data-pick-menu @date-selected-event="dateSelected"/>
  //-         <!-- autocomplete fields -->
  //-         <v-autocomplete
  //-           v-model="client_name"
  //-           :items="clients"
  //-           label="Получатель"
  //-           prepend-icon="person"
  //-           persistent-hint
  //-           item-text="client_name"
  //-         ></v-autocomplete>

  //-         <v-autocomplete
  //-           v-model="product_name"
  //-           :items="products"
  //-           label="Наименование товара"
  //-           prepend-icon="sort"
  //-           persistent-hint
  //-           item-text="product_name"
  //-         ></v-autocomplete>

  //-         <v-autocomplete
  //-           v-model="store_name"
  //-           :items="storages"
  //-           label="Склад"
  //-           prepend-icon="home"
  //-           persistent-hint
  //-           item-text="storage_name"
  //-         ></v-autocomplete>

  //-         <v-text-field
  //-           v-model.number="quantity"
  //-           type="number"
  //-           name="quantity"
  //-           id="quantity"
  //-           label="Количество"
  //-           prepend-icon="edit"
  //-           item-text="quantity"
  //-           placeholder="0"
  //-         ></v-text-field>

  //-         <v-btn fab dark color="indigo" justify-center @click.prevent="add" title="добавить">
  //-           <v-icon dark>add</v-icon>
  //-         </v-btn>
  //-         <v-btn fab dark color="red" justify-center @click.prevent="clearAll" title="очистить">
  //-           <v-icon dark>remove</v-icon>
  //-         </v-btn>

  //-         <v-data-table :headers="headers_export" :items="exportdata">
  //-           <template v-slot:items="props">
  //-             <td sortable="true">{{ props.item.record_count }}</td>
  //-             <td class="text-xs-left">{{ props.item.product_name }}</td>
  //-             <td class="text-xs-left">{{ props.item.quantity }}</td>
  //-             <td class="text-xs-left">{{ props.item.store_name }}</td>
  //-             <td class="text-xs-left">{{ props.item.client_name }}</td>
  //-             <td class="text-xs-left">{{ props.item.date }}</td>
  //-           </template>
  //-         </v-data-table>
  //-       </v-card-text>
  //-     </v-card>
  //-   </v-dialog>
  //- </div>
</template>



<script>
import DataPickMenu from "./DataPickMenu";
import RepositoryFactory from "../../services/RepositoryFactory";
const clientsRepository = RepositoryFactory.get("clients");
const productsRepository = RepositoryFactory.get("products");
const storagesRepository = RepositoryFactory.get("storages");
const outgoingRepository = RepositoryFactory.get("outgoing");

export default {
  name: "outgoing-record-form",
  components: {
    DataPickMenu
  },
  created() {
    this.getClients();
    this.getProducts();
    this.getStorages();
  },
  methods: {
    dateSelected: function(date) {
      this.date = date;
    },
    async getClients() {
      const { data } = await clientsRepository.get();
      this.clients = data;
    },
    async getProducts() {
      const { data } = await productsRepository.get();
      this.products = data;
    },
    async getStorages() {
      const { data } = await storagesRepository.get();
      this.storages = data;
    },
    add() {
      this.record_count++;
      var newRow = {
        record_count: this.record_count + "",
        product_name: this.product_name,
        store_name: this.store_name,
        quantity: this.quantity,
        client_name: this.client_name,
        date: this.date
      };
      var new_detailed_export_record = {
        product_ID: this.getProductID(),
        storage_ID: this.getStorageID(),
        client_ID: this.getClientID(),
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 1,
        note: "some"
      };
      this.exportdata.push(newRow);
      this.detailed_export_list.push(new_detailed_export_record);
      this.product_name = "";
      this.store_name = "";
      this.quantity = "";
      this.client_name = "";
    },
    clearAll() {
      this.record_count = 0;
      this.exportdata = [];
      this.detailed_export_list = [];
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_outgoing_records = false;
        // save data

        var object = this.detailed_export_list;
        this.$emit("outgoing-record-event", object);
        outgoingRepository.save(object);
        //clear data
        this.clearAll();
      } else {
        this.save_outgoing_records = false;
      }
    },
    getProductID() {
      for (var index in this.products) {
        if (this.products[index].product_name === this.product_name) {
          return this.products[index].product_ID;
        }
      }
    },
    getClientID() {
      for (var index in this.clients) {
        if (this.clients[index].client_name === this.client_name)
          return this.clients[index].client_ID;
      }
    },
    getStorageID() {
      for (var index in this.storages) {
        if (this.storages[index].storage_name === this.store_name)
          return this.storages[index].storage_ID;
      }
    }
  },
  data() {
    return {
      outgoing_dialog: false,
      save_outgoing_records: false,
      inform_dialog_done: false,
      clients: [],
      products: [],
      storages: [],
      exportdata: [],
      detailed_export_list: [],
      selected: [],
      record_count: 0,
      product_name: String,
      store_name: String,
      quantity: "",
      client_name: String,
      date: Date,

      headers_export: [
        {
          text: "N#",
          align: "left",
          sortable: false,
          value: "number"
        },
        {
          text: "Наименование товара",
          sortable: false,
          value: "product_name"
        },
        {
          text: "Количество",
          value: "quantity"
        },
        {
          text: "Склад",
          value: "store_name"
        },
        {
          text: "Получатель",
          value: "client_name"
        },
        {
          text: "Дата",
          value: "date"
        }
      ]
    };
  }
};
</script>
<style scoped>
</style>
