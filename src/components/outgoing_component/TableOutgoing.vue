<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
    v-if="!isLoading" 
    :headers='headers' 
    :items='data_is_sorted ? sorted_data : formatted_outgoing_records' 
    :rows-per-page-items='[100,200,300]' 
    :search='search')
    template(v-slot:items='props')
      td {{ props.item.record_datetime }}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.total_quantity }}
      td.text-xs-left(v-if="enabled") {{ props.item.total_price }}
      td.px-0
        template(v-for='(item, index) in props.item.product_quantities')
          td.text-xs-left.pl-4(style='min-width: 100%;') {{ item.product_name }}
          v-divider(v-if="index !== (props.item.product_quantities.length-1)")
      td.px-0
        template(v-for='(item,index) in props.item.product_quantities')
          td.text-xs-left.pl-4 {{ item.quantity }}
          v-divider(v-if="index !== (props.item.product_quantities.length-1)")
      td.px-0(v-if="enabled")
        template(v-for='(item,index) in props.item.product_quantities')
          td.text-xs-left.pl-4 {{ item.price }}
          v-divider(v-if="index !== (props.item.product_quantities.length-1)")    
      td.px-0
        template(v-for='(item, index) in props.item.product_quantities')
          td.text-xs-left.pl-4(style='min-width: 100%;') {{ item.storage_name }}
          v-divider(v-if="index !== (props.item.product_quantities.length-1)")
      td.px-0(v-if="enabled || str_m_enabled")
        template(v-for='(item, index) in props.item.product_quantities')
          td.text-xs-left.pl-4(style='min-width: 100%;')
            v-icon(@click="editRow(props.item, index)") create
          v-divider(v-if="index !== (props.item.product_quantities.length-1)") 
  outgoing-record-edit-form(v-if="edit" :appear="edit" @edit-form-closed="edit=false" :edit_object = "edit_object")  
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("outgoing");
import { mapGetters, mapMutations } from "vuex";
import OutgoingRecordEditForm from "./OutgoingRecordEditForm";
export default {
  name: "table-outgoing",
  props: {
    search: String()
  },
  components: { OutgoingRecordEditForm },
  created() {
    this.enabled =
      this.user_role === "Наблюдатель" || this.user_role === "Завсклад"
        ? false
        : true;
    if (this.enabled) {
      this.headers.splice(3, 0, {
        text: "Сумма",
        value: "total_price",
        sortable: false
      });
      this.headers.splice(6, 0, {
        text: "Цена",
        value: "price",
        sortable: false
      });
      this.headers.push({ text: "", value: "edit_button", sortable: false });
    }

    if (this.user_role === "Завсклад") {
      this.str_m_enabled = true;
      this.headers.push({ text: "", value: "edit_button", sortable: false });
    }
  },
  mounted() {
    var storage = 0;
    if (this.storage_list !== undefined) storage = this.storage_list;
    if (this.user_role === "Завсклад" && this.outgoing_records.length === 0) {
      if (storage.length !== 0)
        this.getOutgoingDataByStorage(storage[0].storage_ID);
      else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              storage = mutation.payload;
              this.getOutgoingDataByStorage(storage[0].storage_ID);
              break;
          }
        });
    } else if (
      this.user_role === "Управляющий" &&
      this.outgoing_records.length === 0
    ) {
      if (storage.length !== 0) {
        this.storage_ids = storage.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getOutgoingDataByDepartment(this.storage_ids);
      } else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              this.storage_ids = mutation.payload.map(function(storage) {
                return { storage_ID: storage.storage_ID };
              });
              this.getOutgoingDataByDepartment(this.storage_ids);
              break;
          }
        });
    } else if (this.outgoing_records.length === 0) this.getOutgoingData();
  },

  computed: {
    ...mapGetters({
      outgoing_records: "outgoing/get_outgoing_data",
      formatted_outgoing_records: "outgoing/get_formatted_data",
      data_is_sorted: "outgoing/get_sorted_flag",
      sorted_data: "outgoing/get_sorted_formatted_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data() {
    return {
      enabled: false,
      str_m_enabled: false,
      isLoading: false,
      edit: false,
      edit_object: Object,
      storage_ids: [],
      headers: [
        { text: "Дата", value: "record_datetime", sortable: false },
        { text: "Кому", value: "client_name", sortable: false },
        { text: "Общ. кол-во", value: "total", sortable: false },

        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Количество", value: "quantity", sortable: false },

        { text: "Склад", value: "storage_name", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_outgoing_data: "outgoing/load_outgoing_data",
      load_formatted_data: "outgoing/load_formatted_data"
    }),
    async getOutgoingData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      let formatted_data = this.outgoing_format(data);
      this.load_formatted_data(formatted_data);
      this.load_outgoing_data(data);
    },
    async getOutgoingDataByStorage(storage_id) {
      this.isLoading = true;
      const { data } = await repository.get_by_storage(storage_id);
      this.isLoading = false;
      let formatted_data = this.outgoing_format(data);
      this.load_formatted_data(formatted_data);
      this.load_outgoing_data(data);
    },
    async getOutgoingDataByDepartment(storage_ids) {
      this.isLoading = true;
      const { data } = await repository.get_by_department_storages(storage_ids);
      this.isLoading = false;
      let formatted_data = this.outgoing_format(data);
      this.load_formatted_data(formatted_data);
      this.load_outgoing_data(data);
    },

    editRow(row, inner_index) {
      let right_outgoing_record = this.outgoing_records.find(item => {
        return item.record_ID === row.product_quantities[inner_index].record_ID;
      });
      this.edit_object = right_outgoing_record;
      this.edit = true;
    },

    outgoing_format(data) {
      let total_quantity = 0;
      let total_price = 0;
      let operated_data = data;
      let product_quantities = [];
      let general_list = [];
      data.sort(function(a, b) {
        return (
          a.record_datetime === b.record_datetime &&
          a.client_name.toLowerCase().localeCompare(b.client_name)
        );
      });

      for (let i = 0; i < operated_data.length; i++) {
        let next = operated_data[i + 1];
        if (next !== undefined) {
          if (
            operated_data[i].record_datetime ===
              operated_data[i + 1].record_datetime &&
            operated_data[i].client_name === operated_data[i + 1].client_name
          ) {
            total_quantity += operated_data[i].quantity;
            total_price += operated_data[i].quantity * operated_data[i].price;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID,
              category_name: operated_data[i].category_name
            });
          } else {
            total_price += operated_data[i].quantity * operated_data[i].price;
            total_quantity += operated_data[i].quantity;
            product_quantities.push({
              price: operated_data[i].price,
              product_name: operated_data[i].product_name,
              quantity: operated_data[i].quantity,
              storage_name: operated_data[i].storage_name,
              record_ID: operated_data[i].record_ID,
              category_name: operated_data[i].category_name
            });
            general_list.push({
              record_datetime: operated_data[i].record_datetime,
              client_name: operated_data[i].client_name,
              total_quantity: total_quantity,
              total_price: total_price,
              client_region: operated_data[i].client_region,
              product_quantities: product_quantities
            });
            // if (i !== operated_data.length - 2) {
            product_quantities = [];
            total_quantity = 0;
            total_price = 0;
            // }
          }
        } else {
          total_quantity += operated_data[i].quantity;
          total_price += operated_data[i].quantity * operated_data[i].price;
          product_quantities.push({
            price: operated_data[i].price,
            product_name: operated_data[i].product_name,
            quantity: operated_data[i].quantity,
            storage_name: operated_data[i].storage_name,
            record_ID: operated_data[i].record_ID,
            category_name: operated_data[i].category_name
          });
          general_list.push({
            record_datetime: operated_data[i].record_datetime,
            client_name: operated_data[i].client_name,
            total_quantity: total_quantity,
            total_price: total_price,
            client_region: operated_data[i].client_region,
            product_quantities: product_quantities
          });
        }
      }
      return general_list;
    }
  }
};
</script>
<style scoped>
.product-table {
  border: 1px solid #bdbdbd;
  padding: 3px;
  margin: 7px;
  box-shadow: #157c5d 10px;
}
</style>
