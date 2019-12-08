<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='departments' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.name }}
      td {{ props.item.address }}
      td {{ props.item.department_phone }}
      td {{ props.item.company.name }}
      td {{ props.item.department_manager.first_name }}
      td {{ props.item.description }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create 
  edit-department-form(v-if="edit" :edit_object="edit_object" :appear="edit" @edit-form-closed="edit=false")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("departments");
import { mapGetters, mapMutations } from "vuex";
import EditDepartmentForm from "./EditDepartmentForm";

export default {
  name: "table-departments",
  props: {
    search: String
  },
  components: {
    EditDepartmentForm
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.departments.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      departments: "departments/get_departments",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      enabled: true,
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Имя", value: "name", sortable: false },
        { text: "Адрес", sortable: false, value: "address" },
        { text: "Телефон", sortable: false, value: "department_phone" },
        {
          text: "Компания",
          sortable: false,
          value: "company_name"
        },
        {
          text: "Управляющий",
          sortable: false,
          value: "department_manager_name"
        },
        {
          text: "Описание",
          sortable: false,
          value: "description"
        }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "departments/load_departments"
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
