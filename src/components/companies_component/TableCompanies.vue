<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='companies' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.name }}
      td.text-xs-left {{ props.item.address}}
      td.text-xs-left {{ props.item.company_phone}}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create 
  edit-company-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")                
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("companies");
import { mapGetters, mapMutations } from "vuex";
import EditCompanyForm from "./EditCompanyForm";
export default {
  name: "table-companies",
  components: {
    EditCompanyForm
  },
  props: {
    search: String()
  },
  created() {
    if (this.companies.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      companies: "companies/get_companies"
    })
  },
  data() {
    return {
      isLoading: false,
      edit: false,
      edit_object: Object,
      headers: [
        {
          text: "Наименование компании",
          value: "name",
          sortable: false
        },
        {
          text: "Адрес",
          value: "address",
          sortable: false
        },
        { text: "Телефон", sortable: false, value: "company_phone" },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "companies/load_companies"
    }),
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
