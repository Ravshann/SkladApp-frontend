<template lang="pug">
div
  v-content
    h2.view-title Приходы по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      //- advanced-sort(:incoming_records='incoming_records_computed' :search='search')
      //- excel-generator(:json_data='incoming_records_computed')
  table-incoming(:search='search')
</template>
<script>
import TableIncoming from "./TableIncoming";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import { mapGetters } from "vuex";

export default {
  name: "Incoming",
  components: {
    TableIncoming,
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
