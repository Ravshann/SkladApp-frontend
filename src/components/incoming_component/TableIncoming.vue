<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
  v-if="!isLoading" 
  :headers='headers' 
  :items='incoming_records' 
  :rows-per-page-items='[25,50]' 
  :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.supplier_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create   
  incoming-record-edit-form(:appear="edit" @edit-form-closed="edit=false")                    
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
    if (this.incoming_records.length === 0) {
      this.getIncomingData();
    }
  },
  props: {
    search: ""
  },
  computed: {
    //this is computed value 'incoming_records' which is bound to store
    ...mapGetters({
      incoming_records: "incoming/get_incoming_data",
      edited_record: "incoming/get_edited_record"
    })
  },
  methods: {
    //this is for loading data to store
    ...mapMutations({
      load_incoming_data: "incoming/load_incoming_data",
      send_record_to_edit: "incoming/save_edited_record"
    }),
    async getIncomingData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_incoming_data(data);
    },
    editRow(row) {
      this.edit = true;
      this.send_record_to_edit(row);
      console.log(this.edited_record)
    }
  },
  data: function() {
    return {
      isLoading: false,
      edit: false,
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Количество", value: "quantity" },
        { text: "Склад", value: "storage_name" },
        { text: "От кого", value: "supplier_name" },
        { text: "Дата", value: "record_datetime" },
        { text: "", value: "edit_button" }
      ]
    };
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
