<template lang="pug">
div
  v-content
    h2.view-title Расходы по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      sort-by-date
      advanced-sort
      excel-generator
  table-outgoing(:search='search')   
</template>
<script>
import TableOutgoing from "./TableOutgoing";
import AdvancedSort from "./AdvancedSort";
import SortByDate from "./SortByDate";
import ExcelGenerator from "./ExcelGenerator";
import { mapGetters } from "vuex";

export default {
  name: "Outgoing",
  components: {
    TableOutgoing,
    AdvancedSort,
    SortByDate,
    ExcelGenerator
   
  },
  created() {
    if (this.user_role === "Завсклад" || this.user_role === "Управляющий") {
      this.showTwoTabs = false;
      this.allowedTabs = 1;
    }
  },
  data() {
    return {
      search: String(),
      allowedTabs: 2,
      showTwoTabs: true,
      tab_headers: ["Расходы", "Расходы и возвраты"]
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date",
      user_role: "logged_user/get_user_role"
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
