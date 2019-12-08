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
        v-layout(row wrap)     
          v-layout.first_column(column wrap)
            v-form(
              ref="form")
              // data pick menu
              data-pick-menu(@date-selected-event='dateSelected')
              // autocomplete fields
              v-layout(row wrap)
                v-btn(
                  fab
                  small 
                  dark 
                  color='indigo' 
                  justify-center 
                  @click.prevent='client_form=true' 
                  title='добавить клиент')
                  v-icon(dark) add
                v-autocomplete(
                  :rules="[validation_rules.required_client]"
                  v-model='client' 
                  :items='clients' 
                  label='Получатель' 
                  prepend-icon='person' 
                  persistent-hint 
                  item-text='client_name'
                  return-object
                  clearable=true)
              v-autocomplete(
                v-if="user_role === 'Завсклад'"
                v-model='product' 
                :items='remainder_data' 
                label='Наименование товара' 
                prepend-icon='sort'  
                persistent-hint 
                item-text='productName' 
                return-object
                :rules="[validation_rules.required_product]"
                clearable=true)
              v-autocomplete(
                v-else
                v-model='product' 
                :items='exportable_list' 
                label='Наименование товара' 
                prepend-icon='sort' 
                persistent-hint 
                item-text='productName' 
                return-object
                :rules="[validation_rules.required_product]"
                clearable=true)
              ul 
                li(v-for="item in storage_quantities") {{item}}
              v-autocomplete(
                v-model='storage' 
                :items='storages' 
                label='Склад' 
                prepend-icon='home' 
                persistent-hint 
                item-text='storage_name'
                return-object
                :rules="[validation_rules.required_storage]"
                clearable=true)
              v-layout(column wrap)
                v-text-field(
                  :readonly='user_role==="Завсклад" ? true : false'
                  v-model.number='price' 
                  type='number' 
                  label='Цена' 
                  prepend-icon='$vuetify.icons.money' 
                  item-text='price' 
                  :rules="[validation_rules.required_price]"
                  placeholder='0')
                v-text-field#quantity(
                  :disabled="!product_available"
                  v-model.number='quantity' 
                  type='number' 
                  name='quantity' 
                  label='Количество' 
                  prepend-icon='edit' 
                  item-text='quantity' 
                  :rules="[validation_rules.required_quantity]"
                  placeholder='0')
                p Есть в наличии: {{available_quantity}}
            v-btn(fab dark color='indigo' justify-center @click.prevent='add' title='добавить')
              v-icon(dark) add
          v-layout.pl-4.second_section(column wrap)         
            v-data-table(:headers='headers_export' :items='exportdata_formatted')
              template(v-slot:items='props')
                td.text-xs-left {{ props.item.record_datetime }}
                td.text-xs-left {{ props.item.client_name }}
                td.text-xs-left {{ props.item.total_quantity }}
                td.text-xs-left {{ props.item.total_price }}
                td.px-0
                  template(v-for='(item, index) in props.item.product_quantities')
                    td.text-xs-left.pl-4(style='min-width: 100%;') {{ item.product_name }}
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")
                td.px-0
                  template(v-for='(item,index) in props.item.product_quantities')
                    td.text-xs-left.pl-4 {{ item.quantity }}
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")
                td.px-0
                  template(v-for='(item,index) in props.item.product_quantities')
                    td.text-xs-left.pl-4 {{ item.price }}
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")    
                td.px-0
                  template(v-for='(item, index) in props.item.product_quantities')
                    td.text-xs-left(style='min-width: 100%;') {{ item.storage_name }}
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")
                td.px-0
                  template(v-for='(item, index) in props.item.product_quantities')
                    td.text-xs-left.pl-4(style='min-width: 100%;')
                      v-icon(@click="deleteRecord(props.item, index)" color='red') clear
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")
                td.px-0
                  template(v-for='(item, index) in props.item.product_quantities')
                    td.text-xs-left.pl-4(style='min-width: 100%;')
                      v-icon(@click="editRecord(props.item, index)" color='blue') create
                    v-divider(v-if="index !== (props.item.product_quantities.length-1)")
            outgoing-record-edit-form(v-if="edit" :appear="edit" @edit-form-closed="editFinished" :edit_object = "edit_object")
            client-create-form(@client-created="client_form=false" v-show="client_form" :appear="client_form")
</template>


<script>
import ClientCreateForm from "./ClientCreateForm";
import OutgoingRecordEditForm from "./OutgoingRecordEditForm";
import RepositoryFactory from "../../services/RepositoryFactory";
const remainderRepository = RepositoryFactory.get("remainder");
const outgoingRepository = RepositoryFactory.get("outgoing");
import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "outgoing-record-form",
  components: {
    OutgoingRecordEditForm,
    ClientCreateForm
  },
  created() {
    this.real_available_quantity = this.available_quantity;
    if (this.user_role !== "Завсклад") {
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case "remainders/load_remainder_data":
            this.exportable_list = this.remainder_data.filter(function(record) {
              return record.total !== 0;
            });
            break;
        }
      });
    }
  },
  watch: {
    available_quantity: {
      handler: function(val) {
        if (this.exported_product_quantities.size === 0)
          this.real_available_quantity = val;
      }
    },
    exported_product_quantities: {
      handler: function(val) {
        let inmap = this.exported_product_quantities.get(
          this.product.productName
        );
        this.real_available_quantity = this.available_quantity - inmap;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients",
      products: "products/get_products",
      storages: "storages/get_storages",
      remainder_data: "remainders/get_remainder_data",
      outgoing_data: "outgoing/get_outgoing_data",
      user_role: "logged_user/get_user_role"
    }),

    product_available: function() {
      if (this.real_available_quantity > 0) return true;
      else return false;
    },

    available_quantities: function() {
      if (this.remainder_data !== undefined && this.product !== undefined) {
        let record = this.remainder_data.find(item => {
          return item.productName === this.product.productName;
        });

        if (record !== undefined && this.storage !== undefined) {
          let array = [];
          record.storageQuantities.forEach(item => {
            array.push(item.storageName + " - " + item.quantity);
          });
          this.storage_quantities = array;
        }
      }
    },
    available_quantity: function() {
      if (this.remainder_data !== undefined && this.product !== undefined) {
        let record = this.remainder_data.find(item => {
          return item.productName === this.product.productName;
        });
        if (record !== undefined && this.storage !== undefined) {
          let str_qu = record.storageQuantities.find(item => {
            return item.storageName === this.storage.storage_name;
          });
          return str_qu !== undefined ? str_qu.quantity : 0;
        } else return 0;
      } else return 0;
    }
  },

  data() {
    return {
      client_form: false,
      edit: false,
      edit_object: Object,
      edit_object_index: Number,
      outgoing_dialog: false,
      save_outgoing_records: false,
      inform_dialog_done: false,
      exportdata: [],
      formatted_edit_obj: {},
      exportdata_formatted: [],
      exportable_list: [],
      detailed_export_list: [],
      product: Object,
      storage: Object,
      client: Object,
      quantity: Number(),
      price: Number(),
      date: Date,

      storage_quantities: [],
      exported_product_quantities: new Map(),
      real_available_quantity: -1,
      validation_rules: {
        required_client: v => {
          let valid = false;
          let message = "Зачение поля не может быть пустым.";
          if (v !== undefined) {
            valid = Object.entries(v).length !== 0;
          }
          return valid || message;
        },
        required_product: v => {
          let valid = false;
          let message = "Зачение поля не может быть пустым.";
          if (v !== undefined) {
            valid = Object.entries(v).length !== 0;
          }
          return valid || message;
        },
        required_storage: v => {
          let valid = false;
          let message = "Зачение поля не может быть пустым.";
          if (v !== undefined) {
            valid = Object.entries(v).length !== 0;
          }
          return valid || message;
        },
        required_price: v => {
          let valid = false;
          let message = "Зачение поля не может быть пустым.";
          if (v !== "") {
            valid = v >= 0;
          }
          return valid || message;
        },
        required_quantity: v => {
          let valid = false;
          let message = "Зачение поля не может быть пустым.";
          if (v !== "") {
            if (this.real_available_quantity === 0) {
              message = "В складе нет такого товара";
            } else if (v <= this.real_available_quantity) {
              valid = true;
            } else {
              message =
                "В складе всего " + this.real_available_quantity + " товаров";
            }
          }
          return valid || message;
        }
      },
      headers_export: [
        { text: "Дата", sortable: false },
        { text: "Клиент", sortable: false },
        { text: "Общ. кол-во", sortable: false },
        { text: "Сумма", value: "total_price", sortable: false },
        {
          text: "Наименование товара",
          sortable: false
        },
        { text: "Количество", sortable: false },
        { text: "Цена", sortable: false },
        { text: "Склад", sortable: false },
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
    deleteRecord(item, ind) {
      let index = 0;
      this.exportdata.forEach((el, deleted_item_ind) => {
        if (
          el.product_name === item.product_name &&
          el.storage_name === item.storage_name &&
          el.client_name === item.client_name &&
          el.date === item.record_datetime
        ) {
          index = deleted_item_ind;
        }
      });

      let confirmation = confirm("Вы уверены, что хотите удалить эту запись?");
      if (confirmation) {
        this.exportdata.splice(index, 1);
        this.detailed_export_list.splice(index, 1);
        item.total_quantity -= item.product_quantities[ind].quantity;
        item.total_price -=
          item.product_quantities[ind].quantity *
          item.product_quantities[ind].price;
        item.product_quantities.splice(ind, 1);
        if (this.exportdata_formatted.length === 1) {
          this.exportdata_formatted = [];
        }
      }
    },
    editRecord(item, ind) {
      let index = 0;
      this.exportdata.forEach((el, edit_inx) => {
        if (
          el.product_name === item.product_quantities[ind].product_name &&
          el.storage_name === item.product_quantities[ind].storage_name &&
          el.client_name === item.client_name &&
          el.date === item.record_datetime
        ) {
          index = edit_inx;
        }
      });
      this.edit_object = this.detailed_export_list[index];
      this.edit_object_index = index;
      this.edit = true;

      this.formatted_edit_obj.outer_index = this.exportdata_formatted.indexOf(
        item
      );
      this.formatted_edit_obj.item = item;
      this.formatted_edit_obj.inner_index = ind;
    },
    editFinished(data) {
      if (data !== false) {
        let temp = this.exportdata;
        temp[this.edit_object_index] = {
          product_name: data.product_name,
          storage_name: data.storage_name,
          quantity: data.quantity,
          price: data.price,
          client_name: data.client_name,
          date: data.record_datetime
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
          price: data.price,
          record_datetime: data.record_datetime,
          inout_type_ID: 1,
          note: "some"
        };
        this.apply_edition_on_formatted(temp[this.edit_object_index]);
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
    async getOutgoingDataByDepartment(storage_ids) {
      const { data } = await outgoingRepository.get_by_department_storages(
        storage_ids
      );
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
      var storage_id = this.storages[0].storage_ID;
      const { data } = await remainderRepository.get_by_storage(storage_id);
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },

    async refreshRemainderByDepartmentStorage(storage_ids) {
      const { data } = await remainderRepository.get_by_department_storages(
        storage_ids
      );
      data.sort(function(a, b) {
        return a.productName.toLowerCase().localeCompare(b.productName);
      });
      this.load_remainder_data(data);
    },

    clearAll() {
      this.exportdata = [];
      this.detailed_export_list = [];
      this.exportdata_formatted = [];
    },
    updateStore() {
      setTimeout(() => {
        if (this.user_role === "Завсклад") {
          this.getOutgoingDataByStorage(this.storages[0].storage_ID);
          this.refreshRemainderByStorage();
        } else if (this.user_role === "Управляющий") {
          let storage_ids = this.storages.map(function(storage) {
            return { storage_ID: storage.storage_ID };
          });
          this.getOutgoingDataByDepartment(storage_ids);
          this.refreshRemainderByDepartmentStorage(storage_ids);
        } else {
          this.refreshRemainder();
          this.getOutgoingData();
        }
      }, 4000);
    },

    apply_edition_on_formatted(edited_obj) {
      let outer_obj = this.formatted_edit_obj.item;
      let inner_obj =
        outer_obj.product_quantities[this.formatted_edit_obj.inner_index];
      let old_quantity = inner_obj.quantity;
      let old_price = inner_obj.price;
      let new_total_price =
        outer_obj.total_price -
        old_price * old_quantity +
        edited_obj.quantity * edited_obj.price;
      let new_total =
        outer_obj.total_quantity - old_quantity + edited_obj.quantity;
      inner_obj.storage_name = edited_obj.storage_name;
      inner_obj.quantity = edited_obj.quantity;
      inner_obj.price = edited_obj.price;
      inner_obj.product_name = edited_obj.product_name;
      outer_obj.total_quantity = new_total;
      outer_obj.total_price = new_total_price;
    },
    format_export_record(newRow) {
      let array = this.exportdata_formatted;
      if (array.length === 0) {
        this.exportdata_formatted.push({
          record_datetime: newRow.date,
          client_name: newRow.client_name,
          total_quantity: newRow.quantity,
          total_price: newRow.price * newRow.quantity,
          product_quantities: [
            {
              product_name: newRow.product_name,
              quantity: newRow.quantity,
              storage_name: newRow.storage_name,
              price: newRow.price
            }
          ]
        });
      } else {
        let matched = false;
        for (let i = 0; i < array.length; i++) {
          if (
            newRow.date === array[i].record_datetime &&
            newRow.client_name === array[i].client_name
          ) {
            let pr_qu = array[i].product_quantities;
            let changed = false;
            for (let j = 0; j < pr_qu.length; j++) {
              if (
                pr_qu[j].product_name === newRow.product_name &&
                pr_qu[j].storage_name === newRow.storage_name
              ) {
                let old_p = pr_qu[j].quantity * pr_qu[j].price;
                pr_qu[j].quantity += newRow.quantity;
                pr_qu[j].price = newRow.price;

                let updated_list = [...this.exportdata_formatted];
                updated_list[i].total_quantity += newRow.quantity;
                if (pr_qu[j].price === newRow.price)
                  updated_list[i].total_price += newRow.quantity * newRow.price;
                else
                  updated_list[i].total_price =
                    updated_list[i].total_price -
                    old_p +
                    pr_qu[j].quantity * newRow.price;

                this.exportdata_formatted = updated_list;
                changed = true;
                break;
              }
            }
            // storage_name or product_name is different
            if (!changed) {
              pr_qu.push({
                product_name: newRow.product_name,
                quantity: newRow.quantity,
                storage_name: newRow.storage_name,
                price: newRow.price
              });
              let updated_list = [...this.exportdata_formatted];
              updated_list[i].total_quantity += newRow.quantity;
              updated_list[i].total_price += newRow.quantity * newRow.price;
              this.exportdata_formatted = updated_list;
            }
            matched = true;
            break;
          }
        }
        //client_name or date is different
        if (!matched) {
          this.exportdata_formatted.push({
            record_datetime: newRow.date,
            client_name: newRow.client_name,
            total_quantity: newRow.quantity,
            total_price: newRow.price * newRow.quantity,
            product_quantities: [
              {
                product_name: newRow.product_name,
                quantity: newRow.quantity,
                storage_name: newRow.storage_name,
                price: newRow.price
              }
            ]
          });
        }
      }
    },
    // form validation methods

    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    add() {
      if (this.$refs.form.validate()) {
        // push quantities of products to map
        if (this.exported_product_quantities.has(this.product.productName))
          this.exported_product_quantities.set(
            this.product.productName,
            this.quantity +
              this.exported_product_quantities.get(this.product.productName)
          );
        else
          this.exported_product_quantities.set(
            this.product.productName,
            this.quantity
          );
        //reassign to use watcher
        this.exported_product_quantities = new Map(
          this.exported_product_quantities
        );
        // console.log(this.exported_product_quantities);
        var newRow = {
          product_name: this.product.productName,
          storage_name: this.storage.storage_name,
          quantity: this.quantity,
          client_name: this.client.client_name,
          date: this.date,
          price: this.price
        };
        var new_detailed_export_record = {
          product_ID: this.product.productID,
          storage_ID: this.storage.storage_ID,
          client_ID: this.client.client_ID,
          quantity: this.quantity,
          record_datetime: this.date,
          inout_type_ID: 1,
          price: this.price,
          note: "some"
        };
        this.exportdata.push(newRow);
        this.detailed_export_list.push(new_detailed_export_record);
        this.format_export_record(newRow);
      }
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
<style scoped>
.first_column {
  width: 25%;
}
.second_section {
  width: 75%;
}
</style>
