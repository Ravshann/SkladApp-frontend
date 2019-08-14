<template lang="pug">
div
  v-content
    h2.view-title Возвраты по  {{current_date}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      returned-record-form
      advanced-sort
      excel-generator
  table-returned(:search='search')    
</template>
<script>
import TableReturned from "./TableReturned";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import ReturnedRecordForm from "./ReturnedRecordForm";
import { mapGetters } from "vuex";
export default {
  name: "returned",
  components: {
    TableReturned,
    AdvancedSort,
    ExcelGenerator,
    ReturnedRecordForm
  },
  data() {
    return {
      search: String()
    };
  },
  computed: {
    ...mapGetters({
      current_date: "date/get_date"
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
