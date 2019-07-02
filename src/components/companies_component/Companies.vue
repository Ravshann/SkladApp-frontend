<template lang="pug">
div
  v-content
    h2.view-title Компании 
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      companies-create-form
  table-companies(:search='search')
  
</template>

<script>
import TableCompanies from "./TableCompanies";
import CompaniesCreateForm from "./CompaniesCreateForm";


export default {
  name: "Companies",
  components: {
    TableCompanies,
    CompaniesCreateForm
  },

  data() {
    return {
      search: String()
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
}
</style>
