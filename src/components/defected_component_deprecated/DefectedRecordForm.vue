<template lang="pug">
div
  // button for opening dialog
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog = false' title='свернуть')
          v-icon close
        v-toolbar-title Дефектный
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-layout(row wrap)     
          v-layout(column wrap id="first_column")
            // data pick menu
            data-pick-menu(@date-selected-event='dateSelected')
              // autocomplete fields
            v-autocomplete(
              v-model='supplier_storage'
              :items='storages' 
              label='Склад отправитель' 
              prepend-icon='home' 
              persistent-hint 
              item-text='storage_name'
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
              :items='defected_storages' 
              label='Склад получатель' 
              prepend-icon='home' 
              persistent-hint 
              item-text='storage_name'
              return-object)
            v-layout(column wrap)
              v-text-field(v-model.number='quantity' type='number' label='Количество' prepend-icon='edit' placeholder='0')
              p Есть в наличии: {{available_quantity}}
            v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
              v-icon(dark) add
          v-layout.pl-4(column wrap)   
            v-data-table(:headers='headers' :items='list')
              template(v-slot:items='props')
                td.text-xs-left {{ props.item.product_name }}
                td.text-xs-left {{ props.item.quantity }}
                td.text-xs-left {{ props.item.storage_name }}
                td.text-xs-left {{ props.item.supplier_storage_name }}
                td.text-xs-left {{ props.item.date }}
                td.text-xs-left
                  span
                    v-icon(@click="deleteRecord(props.item)" color='red') clear
                td.text-xs-left
                  span
                    v-icon(@click="editRecord(props.item)" color='blue') create
        defected-record-edit-form(
          v-if="edit" 
          :appear="edit" 
          @edit-form-closed="editFinished" 
          :edit_object = "edit_object")   
</template>
<script>
import DefectedRecordEditForm from "./DefectedRecordEditForm";

import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("defected");

import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "defected-record-form",
  components: {
    DefectedRecordEditForm
  },
  computed: {
    ...mapGetters({
      products: "products/get_products",
      storages: "storages/get_storages",
      defected_storages: "storages/get_defected_storages",
      defected_data: "defected/get_data",
      remainder_data: "remainders/get_remainder_data",
      user_role: "logged_user/get_user_role"
    }),
    available_quantity: function() {
      if (this.remainder_data !== undefined && this.product !== undefined) {
        let record = this.remainder_data.find(item => {
          return item.productName === this.product.product_name;
        });
        if (record !== undefined && this.supplier_storage !== undefined) {
          let str_qu = record.storageQuantities.find(item => {
            return item.storageName === this.supplier_storage.storage_name;
          });
          return str_qu !== undefined ? str_qu.quantity : 0;
        } else return 0;
      } else return 0;
    }
  },
  data: function() {
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
      supplier_storage: Object,
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
          text: "Склад получатель",
          sortable: false
        },
        {
          text: "Склад отправитель",
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
      load_defected_data: "defected/load_data"
    }),
    dateSelected: function(date) {
      this.date = date;
    },
    clearAll: function() {
      this.list = [];
      this.detailed_list = [];
    },
    async getDefectedDataByStorage(storage_id) {
      const { data } = await repository.get_by_storage(storage_id);
      this.load_defected_data(data);
    },
    async getDefectedDataBySupplierStorage(storage_id) {
      const { data } = await repository.get_by_supplier_storage(storage_id);
      this.load_defected_data(data);
    },
    async getDefectedDataByDepartment(storage_ids) {
      const { data } = await repository.get_by_department_storages(storage_ids);
      this.load_defected_data(data);
    },
    async refresh() {
      if (this.user_role === "Завсклад") {
        if (this.storage_list[0].storage_type === "defected")
          this.getDefectedDataByStorage(this.storage_list[0].storage_ID);
        else
          this.getDefectedDataBySupplierStorage(
            this.storage_list[0].storage_ID
          );
      } else if (this.user_role === "Управляющий") {
        let storage_ids = this.storages.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getDefectedDataByDepartment(storage_ids);
      } else {
        const { data } = await repository.get();
        this.load_defected_data(data);
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
          supplier_storage_name: data.supplier_storage_name,
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
          supplier_storage_ID: data.supplier_storage_ID,
          quantity: data.quantity,
          record_datetime: data.record_datetime,
          inout_type_ID: 4,
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
        supplier_storage_name: this.supplier_storage.storage_name,
        date: this.date
      };
      var new_detailed_record = {
        product_ID: this.product.product_ID,
        storage_ID: this.storage.storage_ID,
        supplier_storage_ID: this.supplier_storage.storage_ID,
        quantity: this.quantity,
        record_datetime: this.date,
        inout_type_ID: 4,
        note: "some"
      };
      this.list.push(newRow);
      this.detailed_list.push(new_detailed_record);
      this.product = "";
      this.storage = "";
      this.quantity = "";
      this.supplier_storage = "";
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        repository.save(this.detailed_list);
        //clear data
        this.clearAll();
      } else {
        this.save_records = false;
      }
      let self = this;
      setTimeout(() => {
        self.refresh();
      }, 2000);
    }
  }
};
</script>
<style scoped>
#first_column {
  width: 15%;
}
</style>