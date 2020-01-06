<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
  v-if="!isLoading" 
  :headers='headers' 
  :items='data_is_sorted ? sorted_data : incoming_records' 
  :rows-per-page-items='[100,200,300]' 
  :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.supplier_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create   
  incoming-record-edit-form(v-if="edit" :appear="edit" @edit-form-closed="edit=false" :edit_object = "edit_object")                    
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("incoming");
import IncomingRecordEditForm from "./IncomingRecordEditForm";
export default {
  name: "table-incoming",
  components: {
    IncomingRecordEditForm
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  mounted() {
    var storage = 0;
    if (this.storage_list !== undefined) storage = this.storage_list;
    if (this.user_role === "Завсклад" && this.incoming_records.length === 0) {
      if (storage.length !== 0)
        this.getIncomingDataByStorage(storage[0].storage_ID);
      else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              storage = mutation.payload;
              this.getIncomingDataByStorage(storage[0].storage_ID);
              break;
          }
        });
    } else if (
      this.user_role === "Управляющий" &&
      this.incoming_records.length === 0
    ) {
      if (storage.length !== 0) {
        this.storage_ids = storage.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getIncomingDataByDepartment(this.storage_ids);
      } else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              this.storage_ids = mutation.payload.map(function(storage) {
                return { storage_ID: storage.storage_ID };
              });
              this.getIncomingDataByDepartment(this.storage_ids);
              break;
          }
        });
    } else if (this.incoming_records.length === 0) this.getIncomingData();
  },
  props: {
    search: String()
  },
  computed: {
    //this is computed value 'incoming_records' which is bound to store
    ...mapGetters({
      incoming_records: "incoming/get_incoming_data",
      data_is_sorted: "incoming/get_sorted_flag",
      sorted_data: "incoming/get_sorted_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data: function() {
    return {
      enabled: true,
      isLoading: false,
      edit: false,
      edit_object: Object,
      storage_ids: [],
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Количество", value: "quantity", sortable: false },
        { text: "Склад", value: "storage_name", sortable: false },
        { text: "От кого", value: "supplier_name", sortable: false },
        { text: "Дата", value: "record_datetime", sortable: false }
      ]
    };
  },
  methods: {
    //this is for loading data to store
    ...mapMutations({
      load_incoming_data: "incoming/load_incoming_data"
    }),
    async getIncomingData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_incoming_data(data);
    },
    async getIncomingDataByStorage(storage_id) {
      this.isLoading = true;
      const { data } = await repository.get_by_storage(storage_id);
      this.isLoading = false;
      this.load_incoming_data(data);
    },
    async getIncomingDataByDepartment(storage_ids) {
      this.isLoading = true;
      const { data } = await repository.get_by_department_storages(storage_ids);
      this.isLoading = false;
      this.load_incoming_data(data);
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
