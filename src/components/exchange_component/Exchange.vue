<template lang="pug">
div
  v-content
    h2.view-title Перемещении по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      sort-by-date
      exchange-record-form(v-if="enabled")
      advanced-sort
      excel-generator
  table-exchange(:search='search')    
</template>
<script>
import TableExchange from "./TableExchange";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import ExchangeRecordForm from "./ExchangeRecordForm";
import SortByDate from "./SortByDate";
import { mapGetters } from "vuex";
export default {
  name: "exchange",
  components: {
    TableExchange,
    AdvancedSort,
    ExcelGenerator,
    ExchangeRecordForm,
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
