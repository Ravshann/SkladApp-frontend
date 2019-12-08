<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
    :headers='headers' 
    :items='data_is_sorted ? sorted_data : exchange_records' 
    :rows-per-page-items='[25,50]' 
    :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.supplier_storage_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create
  exchange-record-edit-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("exchanges");
// const storagesRepository = RepositoryFactory.get("storages");
import { mapGetters, mapMutations } from "vuex";
import ExchangeRecordEditForm from "./ExchangeRecordEditForm";
export default {
  name: "table-exchange",
  components: {
    ExchangeRecordEditForm
  },
  props: {
    search: String()
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    var storage = 0;
    if (this.storage_list !== undefined) storage = this.storage_list;
    if (this.user_role === "Завсклад" && this.exchange_records.length === 0) {
      if (storage.length !== 0)
        this.getExchangeDataByStorage(storage[0].storage_ID);
      else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              storage = mutation.payload;
              this.getExchangeDataByStorage(storage[0].storage_ID);
              break;
          }
        });
    } else if (
      this.user_role === "Управляющий" &&
      this.exchange_records.length === 0
    ) {
      if (storage.length !== 0) {
        this.storage_ids = storage.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getExchangeDataByDepartment(this.storage_ids);
      } else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              this.storage_ids = mutation.payload.map(function(storage) {
                return { storage_ID: storage.storage_ID };
              });
              this.getExchangeDataByDepartment(this.storage_ids);
              break;
          }
        });
    } else if (this.exchange_records.length === 0) this.getData();
  },
  computed: {
    ...mapGetters({
      exchange_records: "exchange/get_data",
      data_is_sorted: "exchange/get_sorted_flag",
      sorted_data: "exchange/get_sorted_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data() {
    return {
      enabled: true,
      isLoading: false,
      edit: false,
      edit_object: Object,
      storage_ids: [],

      headers: [
        {
          text: "Наименование товара",
          sortable: false,
          value: "product_name"
        },
        { text: "Количество", value: "quantity", sortable: false },
        { text: "Склад получатель", value: "storage_name", sortable: false },
        {
          text: "Склад отправитель",
          value: "supplier_storage_name",
          sortable: false
        },
        { text: "Дата", value: "record_datetime", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "exchange/load_data"
    }),

    async getExchangeDataByStorage(storage_id) {
      this.isLoading = true;
      const { data } = await repository.get_by_supplier_storage(storage_id);
      this.isLoading = false;
      this.load_data(data);
    },
    async getExchangeDataByDepartment(storage_ids) {
      this.isLoading = true;
      const { data } = await repository.get_by_department_storages(storage_ids);
      this.isLoading = false;
      this.load_data(data);
    },
    async getData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_data(data);
    },
    editRow(row) {
      this.edit_object = row;
      this.edit = true;
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
