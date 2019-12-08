<template lang="pug">
div
  v-content
    h2.view-title Клиенты по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      clients-create-form(v-if="enabled")
  table-clients(:search='search')
  
</template>

<script>
import TableClients from "./TableClients";
import ClientsCreateForm from "./ClientsCreateForm";
import { mapGetters } from "vuex";
export default {
  name: "Clients",
  components: {
    TableClients,
    ClientsCreateForm
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
      today: "date/get_date",
      user_role: "logged_user/get_user_role"
    })
  },
  methods: {}
};
</script>

<style scoped>
.view-title {
  text-align: center;
  margin-top: 25px;
}

.v-text-field {
  margin-left: 1%;
}
</style>
