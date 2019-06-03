<template>
  <div>
    <!-- button for opening dialog -->
    <v-btn color="#36BD9C" dark @click="outgoing_dialog = true">Расход</v-btn>
    <!-- dialog for 'outgoing' button -->
    <v-dialog
      v-model="outgoing_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card title>
        <!-- toolbar button for saving -->
        <v-toolbar card dark color="#36BD9C">
          <v-btn icon dark @click="outgoing_dialog = false" title="свернуть">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Расход</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="save_outgoing_records = true">Сохранить</v-btn>
          </v-toolbar-items>
          <!-- dialog for confirmation -->
          <v-dialog v-model="save_outgoing_records" max-width="290">
            <v-card>
              <v-card-title class="headline">make exports?</v-card-title>
              <v-card-text>all exports will be saved.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click.prevent="saveChanges(true)"
                >continue</v-btn>
                <v-btn color="green darken-1" flat="flat" @click.prevent="saveChanges(false)">cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- dialog for notifiying -->
          <v-dialog v-model="inform_dialog_done" max-width="290">
            <v-card>
              <v-card-title class="headline">exports saved</v-card-title>
              <v-card-text>all exports are saved.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="inform_dialog_done=false">ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-card-text>
          <!-- data pick menu -->
          <data-pick-menu @date-selected-event="dateSelected"/>
          <!-- autocomplete fields -->
          <v-autocomplete
            v-model="ex_client_name"
            :items="clients"
            label="Получатель"
            prepend-icon="person"
            persistent-hint
            item-text="client_name"
          ></v-autocomplete>

          <v-autocomplete
            v-model="ex_product_name"
            :items="products"
            label="Наименование товара"
            prepend-icon="sort"
            persistent-hint
            item-text="product_name"
          ></v-autocomplete>

          <v-autocomplete
            v-model="ex_store_name"
            :items="storages"
            label="Склад"
            prepend-icon="home"
            persistent-hint
            item-text="storage_name"
          ></v-autocomplete>

          <v-text-field
            v-model.number="ex_quantity"
            type="number"
            name="ex_quantity"
            id="ex_quantity"
            label="Количество"
            prepend-icon="edit"
            item-text="quantity"
            placeholder="0"
          ></v-text-field>

          <v-btn fab dark color="indigo" justify-center @click.prevent="add" title="добавить">
            <v-icon dark>add</v-icon>
          </v-btn>
          <v-btn fab dark color="red" justify-center @click.prevent="clearAll" title="очистить">
            <v-icon dark>remove</v-icon>
          </v-btn>

          <v-data-table :headers="headers_export" :items="exportdata">
            <template v-slot:items="props">
              <td sortable="true">{{ props.item.record_count }}</td>
              <td class="text-xs-left">{{ props.item.ex_product_name }}</td>
              <td class="text-xs-left">{{ props.item.ex_quantity }}</td>
              <td class="text-xs-left">{{ props.item.ex_store_name }}</td>
              <td class="text-xs-left">{{ props.item.ex_client_name }}</td>
              <td class="text-xs-left">{{ props.item.ex_date }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <!-- <div style="flex: 1 1 auto;"></div> -->
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import DataPickMenu from "./DataPickMenu";
import axios from "axios";

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
      this.ex_date = date;
    },
    getClients: function() {
      const url = this.host + ":" + this.port + "/clients";
      var self = this;
      axios
        .get(url)
        .then(function(response) {
          self.clients = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getProducts: function() {
      const url = this.host + ":" + this.port + "/products";
      var self = this;
      axios
        .get(url)
        .then(function(response) {
          self.products = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getStorages: function() {
      const url = this.host + ":" + this.port + "/storages";
      var self = this;
      axios
        .get(url)
        .then(function(response) {
          self.storages = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    add: function() {
      this.record_count++;
      var newRow = {
        record_count: this.record_count + "",
        ex_product_name: this.ex_product_name,
        ex_store_name: this.ex_store_name,
        ex_quantity: this.ex_quantity,
        ex_client_name: this.ex_client_name,
        ex_date: this.ex_date
      };
      var new_detailed_export_record = {
        product_ID: this.getProductID(),
        storage_ID: this.getStorageID(),
        client_ID: this.getClientID(),
        quantity: this.ex_quantity,
        record_datetime: this.ex_date,
        inout_type_ID: 1,
        note: "some"
      };
      this.exportdata.push(newRow);
      this.detailed_export_list.push(new_detailed_export_record);
      this.ex_product_name = "";
      this.ex_store_name = "";
      this.ex_quantity = "";
      this.ex_client_name = "";
    },
    clearAll: function() {
      this.record_count = 0;
      this.exportdata = [];
      this.detailed_export_list = [];
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_outgoing_records = false;
        // save data
        const url = this.host + ":" + this.port + "/outgoing/save";
        var self = this;
        var object = this.detailed_export_list;
        this.$emit("outgoing-record-event", object);
        //console.log(JSON.stringify(object));
        axios
          .post(url, object, {
            headers: { "Content-type": "application/json" }
          })
          .then(function(response) {
            console.log(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });
        //clear data
        this.clearAll();
      } else {
        this.save_outgoing_records = false;
      }
    },
    getProductID: function() {
      for (var index in this.products) {
        if (this.products[index].product_name === this.ex_product_name) {
          return this.products[index].product_ID;
        }
      }
    },
    getClientID: function() {
      for (var index in this.clients) {
        if (this.clients[index].client_name === this.ex_client_name)
          return this.clients[index].client_ID;
      }
    },
    getStorageID: function() {
      for (var index in this.storages) {
        if (this.storages[index].storage_name === this.ex_store_name)
          return this.storages[index].storage_ID;
      }
    }
  },
  data: function() {
    return {
      host: "http://www.sklad-app.tk",
      port: "8080",
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
      ex_product_name: String,
      ex_store_name: String,
      ex_quantity: "",
      ex_client_name: String,
      ex_date: Date,

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
