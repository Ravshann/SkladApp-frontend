<template lang="pug">
div
  v-content
    h2.view-title Дефектные по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      sort-by-date
      defected-record-form(v-if='enabled')
      advanced-sort
      excel-generator
  table-defected(:search='search')    
</template>
<script>
import TableDefected from "./TableDefected";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import DefectedRecordForm from "./DefectedRecordForm";
import SortByDate from "./SortByDate";
import { mapGetters } from "vuex";
export default {
  name: "defected",
  components: {
    TableDefected,
    AdvancedSort,
    ExcelGenerator,
    DefectedRecordForm,
    SortByDate
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
