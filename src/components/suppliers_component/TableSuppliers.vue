<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='suppliers' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.supplier_name }}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create 
  edit-supplier-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("suppliers");
import { mapGetters, mapMutations } from "vuex";
import EditSupplierForm from "./EditSupplierForm";

export default {
  name: "table-suppliers",
  props: {
    search: String()
  },
  components: {
    EditSupplierForm
  },
  created() {
    if (this.suppliers.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      suppliers: "suppliers/get_suppliers"
    })
  },
  data() {
    return {
      edit: false,
      edit_object: Object,
      headers: [
        {
          text: "Имя(поставщик)",
          sortable: false,
          value: "supplier_name"
        },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "suppliers/load_suppliers"
    }),
    async getData() {
      const { data } = await repository.get();
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
