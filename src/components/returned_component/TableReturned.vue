<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='returned_records' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
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
    search: ""
  },
  created() {
    if (this.returned_records.length === 0) {
      this.getReturnedData();
    }
  },
  computed: {
    ...mapGetters({
      returned_records: "returned/get_returned_data"
    })
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
    editRow(row) {
      this.edit_object = row;
      this.edit = true;
    }
  },
  data() {
    return {
      isLoading: false,
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Наименование товара", sortable: false, value: "product_name" },
        { text: "Количество", sortable: false, value: "quantity" },
        { text: "Склад", sortable: false, value: "product_name" },
        { text: "От кого(клиент)", sortable: false, value: "client_name" },
        { text: "Дата", sortable: false, value: "record_datetime" },
        { text: "", sortable: false }
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
