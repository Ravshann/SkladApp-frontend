<template lang="pug">
div
  v-content
    h2.view-title Пользователи 
    v-layout
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-user-form
  table-users(:search='search')
  
</template>

<script>
import TableUsers from "./TableUsers";

import CreateUserForm from "./CreateUserForm";
export default {
  name: "Users",
  components: {
    TableUsers,
    CreateUserForm
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
