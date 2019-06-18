<template lang="pug">
div
  v-content
    h2.view-title Клиенты по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      clients-create-form
      advanced-sort(:search='search')
      excel-generator
  table-clients(:search='search')
  
</template>

<script>
import TableClients from "./TableClients";
import ClientsCreateForm from "./ClientsCreateForm";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import { mapGetters } from "vuex";
export default {
  name: "Clients",
  components: {
    TableClients,
    ClientsCreateForm,
    AdvancedSort,
    ExcelGenerator
  },

  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date"
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
