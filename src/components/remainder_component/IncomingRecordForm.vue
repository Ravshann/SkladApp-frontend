<template>
  <div>
    <!-- button for opening dialog -->
    <v-btn color="primary" dark @click="incoming_dialog = true">Приход</v-btn>
    <!-- dialog for 'outgoing' button -->
    <v-dialog
      v-model="incoming_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card title>
        <v-toolbar card dark color="primary">
          <v-btn icon dark @click="incoming_dialog = false" title="свернуть">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Приход</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="save_incoming_records = true">Добавить</v-btn>
          </v-toolbar-items>
          <!-- dialog for confirmation -->
          <v-dialog v-model="save_incoming_records" max-width="290">
            <v-card>
              <v-card-title class="headline">make imports?</v-card-title>
              <v-card-text>all imports will be saved.</v-card-text>
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
            v-model="supplier_name"
            :items="suppliers"
            label="Поставщики"
            prepend-icon="local_shipping"
            persistent-hint
            item-text="supplier_name"
          ></v-autocomplete>

          <v-autocomplete
            v-model="product_name"
            :items="products"
            label="Наименование товара"
            prepend-icon="sort"
            persistent-hint
            item-text="product_name"
          ></v-autocomplete>

          <v-autocomplete
            v-model="storage_name"
            :items="storages"
            label="Склад"
            prepend-icon="home"
            persistent-hint
            item-text="storage_name"
          ></v-autocomplete>

          <v-text-field
            v-model.number="quantity"
            type="number"
            label="Количество"
            prepend-icon="edit"
            placeholder="0"
          ></v-text-field>

          <v-btn fab dark color="indigo" justify-center @click.prevent="add" title="добавить">
            <v-icon dark>add</v-icon>
          </v-btn>
          <v-btn fab dark color="red" justify-center @click.prevent="clearAll" title="очистить">
            <v-icon dark>remove</v-icon>
          </v-btn>

          <v-data-table :headers="headers" :items="importdata">
            <template v-slot:items="props">
              <td sortable="true">{{ props.item.record_count }}</td>
              <td class="text-xs-left">{{ props.item.product_name }}</td>
              <td class="text-xs-left">{{ props.item.quantity }}</td>
              <td class="text-xs-left">{{ props.item.storage_name }}</td>
              <td class="text-xs-left">{{ props.item.supplier_name }}</td>
              <td class="text-xs-left">{{ props.item.date }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import DataPickMenu from "./DataPickMenu";
import RepositoryFactory from "../../services/RepositoryFactory";
const suppliersRepository = RepositoryFactory.get("suppliers");
const productsRepository = RepositoryFactory.get("products");
const storagesRepository = RepositoryFactory.get("storages");
const incomingRepository = RepositoryFactory.get("incoming");
export default {
  name: "incoming-record-form",
  components: {
    DataPickMenu
  },
  created() {
    this.getSuppliers();
    this.getProducts();
    this.getStorages();
  },
  methods: {
    dateSelected: function(date) {
      this.date = date;
    },

    async getSuppliers() {
      const { data } = await suppliersRepository.get();
      this.suppliers = data;
    },
    async getProducts() {
      const { data } = await productsRepository.get();
      this.products = data;
    },
    async getStorages() {
      const { data } = await storagesRepository.get();
      this.storages = data;
    },
    add: function() {
      this.record_count++;
      var newRow = {
        record_count: this.record_count + "",
        product_name: this.product_name,
        storage_name: this.storage_name,
        quantity: this.quantity,
        supplier_name: this.supplier_name,
        date: this.date
      };
      var new_detailed_record = {
        product_ID: this.getProductID(),
        storage_ID: this.getStorageID(),
        supplier_ID: this.getSupplierID(),
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 2,
        note: "some"
      };
      this.importdata.push(newRow);
      this.detailed_import_list.push(new_detailed_record);
      this.product_name = "";
      this.storage_name = "";
      this.quantity = "";
      this.supplier_name = "";
    },
    clearAll: function() {
      this.record_count = 0;
      this.importdata = [];
      this.detailed_import_list = [];
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_incoming_records = false;
        // save data
        var object = this.detailed_import_list;
        this.$emit("incoming-record-event", object);
        incomingRepository.save(object);
        //clear data
        this.clearAll();
      } else {
        this.save_incoming_records = false;
      }
    },
    getProductID: function() {
      for (var index in this.products) {
        if (this.products[index].product_name === this.product_name) {
          return this.products[index].product_ID;
        }
      }
    },
    getSupplierID: function() {
      for (var index in this.suppliers) {
        if (this.suppliers[index].supplier_name === this.supplier_name)
          return this.suppliers[index].supplier_ID;
      }
    },
    getStorageID: function() {
      for (var index in this.storages) {
        if (this.storages[index].storage_name === this.storage_name)
          return this.storages[index].storage_ID;
      }
    }
  },
  data: function() {
    return {
      incoming_dialog: false,
      save_incoming_records: false,
      inform_dialog_done: false,
      suppliers: [],
      products: [],
      storages: [],
      importdata: [],
      detailed_import_list: [],
      selected: [],
      record_count: 0,
      product_name: String,
      storage_name: String,
      quantity: "",
      supplier_name: String,
      date: Date,

      headers: [
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
  }
};
</script>
<style scoped>
</style>
