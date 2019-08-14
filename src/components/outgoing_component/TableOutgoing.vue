<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
    v-if="!isLoading" 
    :headers='headers' 
    :items='data_is_sorted ? sorted_data : outgoing_records' 
    :rows-per-page-items='[25,50]' 
    :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.client_region}}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.storage_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create  
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
    } else if (this.outgoing_records.length === 0) this.getOutgoingData();
  },

  computed: {
    ...mapGetters({
      outgoing_records: "outgoing/get_outgoing_data",
      data_is_sorted: "outgoing/get_sorted_flag",
      sorted_data: "outgoing/get_sorted_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data() {
    return {
      isLoading: false,
      edit: false,
      edit_object: Object,
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Количество", value: "quantity", sortable: false },
        { text: "Регион(клиент)", value: "client_region", sortable: false },
        { text: "Кому", value: "client_name", sortable: false },
        { text: "Склад", value: "storage_name", sortable: false },
        { text: "Дата", value: "record_datetime", sortable: false },
        { text: "", value: "edit_button", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_outgoing_data: "outgoing/load_outgoing_data"
    }),
    async getOutgoingData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_outgoing_data(data);
    },
    async getOutgoingDataByStorage(storage_id) {
      this.isLoading = true;
      const { data } = await repository.get_by_storage(storage_id);
      this.isLoading = false;
      this.load_outgoing_data(data);
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
