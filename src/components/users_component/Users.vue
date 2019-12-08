<template lang="pug">
div
  v-content
    h2.view-title Пользователи 
    v-layout
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-user-form(v-if="enabled")
  table-users(:search='search')
  
</template>

<script>
import TableUsers from "./TableUsers";

import CreateUserForm from "./CreateUserForm";
import { mapGetters } from "vuex";
export default {
  name: "Users",
  components: {
    TableUsers,
    CreateUserForm
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  computed: {
    ...mapGetters({
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      search: String(),
      enabled: true
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
