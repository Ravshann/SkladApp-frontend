<template lang="pug">
div
  v-content
    h2.view-title Отделы 
    v-layout
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-departments-form(v-if="enabled")
  table-departments(:search='search')
  
</template>

<script>
import TableDepartments from "./TableDepartments";
import { mapGetters } from "vuex";
import CreateDepartmentsForm from "./CreateDepartmentsForm";
export default {
  name: "departments",
  components: {
    TableDepartments,
    CreateDepartmentsForm
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  data() {
    return {
      search: String(),
      enabled: true
    };
  },
  computed: {
    ...mapGetters({
      user_role: "logged_user/get_user_role"
    })
  }
};
</script>

<style scoped>
.view-title {
  text-align: center;
  margin-top: 25px;
}

.v-text-field {
  margin-left: 1%;
  margin-right: 1%;
}
</style>
