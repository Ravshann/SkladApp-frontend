<template lang="pug">
div
  v-content
    h2.view-title Остаток по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      outgoing-record-form
      incoming-record-form
      advanced-sort
      excel-generator
  table-remainder(:search='search')
</template>

<script>
import TableRemainder from "./TableRemainder";
import OutgoingRecordForm from "./OutgoingRecordForm";
import IncomingRecordForm from "./IncomingRecordForm";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import { mapGetters } from 'vuex';

export default {
  name: "Remainder",
  components: {
    TableRemainder,
    OutgoingRecordForm,
    IncomingRecordForm,
    AdvancedSort,
    ExcelGenerator
  },
  data() {
    return {
      isLoading: false,
      search: String()
    };
  },
  
  computed:{
    ...mapGetters({
      today: "date/get_date"
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
