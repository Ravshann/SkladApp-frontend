<template lang="pug">
div
  v-content
    h2.view-title Расходы по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      advanced-sort
      excel-generator
  table-outgoing(:search='search')    
</template>
<script>
import TableOutgoing from "./TableOutgoing";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import { mapGetters } from "vuex";

export default {
  name: "Outgoing",
  components: {
    TableOutgoing,
    AdvancedSort,
    ExcelGenerator
  },
  data() {
    return {
      search: String()
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
