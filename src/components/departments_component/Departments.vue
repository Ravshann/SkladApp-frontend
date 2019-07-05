<template lang="pug">
div
  v-content
    h2.view-title Отделы 
    v-layout
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-departments-form
  table-departments(:search='search')
  
</template>

<script>
import TableDepartments from "./TableDepartments";

import CreateDepartmentsForm from "./CreateDepartmentsForm";
export default {
  name: "departments",
  components: {
    TableDepartments,
    CreateDepartmentsForm
  },
  data() {
    return {
      search: ""
    };
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
