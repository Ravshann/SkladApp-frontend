<template lang="pug">
div
  v-content
    h2.view-title Возвраты/Дефектные по  {{current_date}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      sort-by-date
      returned-record-form(v-if='enabled')
      advanced-sort
      excel-generator
  table-returned(:search='search')    
</template>
<script>
import TableReturned from "./TableReturned";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import ReturnedRecordForm from "./ReturnedRecordForm";
import SortByDate from "./SortByDate";
import { mapGetters } from "vuex";
export default {
  name: "returned",
  components: {
    TableReturned,
    AdvancedSort,
    ExcelGenerator,
    ReturnedRecordForm,
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
      current_date: "date/get_date",
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
