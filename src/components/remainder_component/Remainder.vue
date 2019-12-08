<template lang="pug">
v-content(v-if="!isUserManager")
  v-tabs(
    color="#FAFAFA"
    slider-color="blue")
    v-tab(
      v-for="n in 2"
      :key="n"
      ripple) {{ tab_headers[n-1] }}
    v-tab-item
      h2.view-title Остаток по  {{today}}
      v-layout(row)
        v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
        v-spacer
        v-spacer
        v-spacer
        outgoing-record-form(v-if='enabled')
        incoming-record-form(v-if='enabled')
        advanced-sort
        excel-generator  
      table-remainder.pt-4(:search='search')       
    v-tab-item
      h2.view-title Остаток бракованных по  {{today}}
      v-layout(row)
        v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
        v-spacer
        v-spacer
        v-spacer
        advanced-sort-defected
        excel-generator-defected
      table-defected-remainder.pt-4(:search='search')
v-content(v-else)
  h2.view-title Остаток по  {{today}}
  v-layout(row)
    v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
    v-spacer
    v-spacer
    v-spacer
    outgoing-record-form(v-if='enabled')
    incoming-record-form(v-if='enabled')
    advanced-sort
    excel-generator  
  table-remainder.pt-5(:search='search') 
</template>

<script>
import TableRemainder from "./TableRemainder";
import TableDefectedRemainder from "./TableDefectedRemainder";
import OutgoingRecordForm from "./OutgoingRecordForm";
import IncomingRecordForm from "./IncomingRecordForm";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import AdvancedSortDefected from "./AdvancedSortDefected";
import ExcelGeneratorDefected from "./ExcelGeneratorDefected";
import { mapGetters } from "vuex";

export default {
  name: "Remainder",
  created() {
    this.isUserManager =
      this.user_role === "Завсклад" || this.user_role === "Управляющий";
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  components: {
    TableRemainder,
    TableDefectedRemainder,
    OutgoingRecordForm,
    IncomingRecordForm,
    AdvancedSort,
    ExcelGenerator,
    AdvancedSortDefected,
    ExcelGeneratorDefected
  },
  data() {
    return {
      isLoading: false,
      search: String(),
      enabled: true,
      isUserOffice: false,
      tab_headers: ["Остаток", "Остаток бракованных"]
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
