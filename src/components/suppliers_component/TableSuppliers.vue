<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='suppliers' :rows-per-page-items='[100,200,300]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.supplier_name }}
      td.text-xs-left(v-if="enabled")
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
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.suppliers.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      suppliers: "suppliers/get_suppliers",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      edit: false,
      enabled: true,
      edit_object: Object,
      headers: [
        {
          text: "Имя(поставщик)",
          sortable: false,
          value: "supplier_name"
        }
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
