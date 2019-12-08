<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='users' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.first_name }}
      td {{ props.item.last_name }}
      td {{ props.item.email }}
      td {{ props.item.user_phone }}
      td {{ props.item.company_ID.name }}
      td {{ props.item.role_ID.role_name }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create 
  edit-user-form(v-if="edit" :edit_object="edit_object" :appear="edit" @edit-form-closed="edit=false")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("users");
import { mapGetters, mapMutations } from "vuex";
import EditUserForm from "./EditUserForm";

export default {
  name: "table-users",
  props: {
    search: String
  },
  components: {
    EditUserForm
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.users.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      users: "users/get_users",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      enabled: true,
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Имя", value: "first_name", sortable: false },
        {
          text: "Фамилия",
          sortable: false,
          value: "last_name"
        },
        {
          text: "Email",
          sortable: false,
          value: "email"
        },
        {
          text: "Телефон",
          sortable: false,
          value: "user_phone"
        },
        {
          text: "Компания",
          sortable: false,
          value: "company_name"
        },
        {
          text: "Должность",
          sortable: false,
          value: "role"
        }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "users/load_users"
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
