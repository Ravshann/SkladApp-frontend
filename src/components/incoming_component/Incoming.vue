<template lang="pug">
div
  v-content
    h2.view-title Приходы по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      sort-by-date
      advanced-sort
      excel-generator
  table-incoming(:search='search')
</template>
<script>
import TableIncoming from "./TableIncoming";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import SortByDate from "./SortByDate"
import { mapGetters } from "vuex";

export default {
  name: "Incoming",
  components: {
    TableIncoming,
    AdvancedSort,
    ExcelGenerator,
    SortByDate
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
