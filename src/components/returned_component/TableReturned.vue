<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
    :headers='headers' 
    :items='data_is_sorted ? sorted_data : returned_records' 
    :rows-per-page-items='[100,200,300]'
    :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create 
  returned-record-edit-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")           
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("returned");
import { mapGetters, mapMutations } from "vuex";
import ReturnedRecordEditForm from "./ReturnedRecordEditForm";
export default {
  name: "table-returned",
  components: {
    ReturnedRecordEditForm
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
    if (this.user_role === "Завсклад" && this.returned_records.length === 0) {
      if (storage.length !== 0)
        this.getReturnedDataByStorage(storage[0].storage_ID);
      else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              storage = mutation.payload;
              this.getReturnedDataByStorage(storage[0].storage_ID);
              break;
          }
        });
    } else if (
      this.user_role === "Управляющий" &&
      this.returned_records.length === 0
    ) {
      if (storage.length !== 0) {
        this.storage_ids = storage.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getReturnedDataByDepartment(this.storage_ids);
      } else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              this.storage_ids = mutation.payload.map(function(storage) {
                return { storage_ID: storage.storage_ID };
              });
              this.getReturnedDataByDepartment(this.storage_ids);
              break;
          }
        });
    } else if (this.returned_records.length === 0) this.getReturnedData();
  },
  computed: {
    ...mapGetters({
      returned_records: "returned/get_returned_data",
      data_is_sorted: "returned/get_sorted_flag",
      sorted_data: "returned/get_sorted_data",
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
        { text: "Наименование товара", sortable: false, value: "product_name" },
        { text: "Количество", sortable: false, value: "quantity" },
        { text: "Склад", sortable: false, value: "product_name" },
        { text: "От кого(клиент)", sortable: false, value: "client_name" },
        { text: "Дата", sortable: false, value: "record_datetime" }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "returned/load_returned_data"
    }),
    async getReturnedData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_data(data);
    },
    async getReturnedDataByStorage(storage_id) {
      this.isLoading = true;
      const { data } = await repository.get_by_storage(storage_id);
      this.isLoading = false;
      this.load_data(data);
    },
    async getReturnedDataByDepartment(storage_ids) {
      this.isLoading = true;
      const { data } = await repository.get_by_department_storages(storage_ids);
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
