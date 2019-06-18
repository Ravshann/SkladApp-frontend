<template lang="pug">
div
  v-content
    h2.view-title Дефектные по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      defected-record-form
      advanced-sort
      excel-generator
  table-defected(:search='search')    
</template>
<script>
import TableDefected from "./TableDefected";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import DefectedRecordForm from "./DefectedRecordForm";
import { mapGetters } from "vuex";
export default {
  name: "defected",
  components: {
    TableDefected,
    AdvancedSort,
    ExcelGenerator,
    DefectedRecordForm
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
  methods: {
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
