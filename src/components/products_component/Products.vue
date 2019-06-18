<template lang="pug">
div
  v-content
    h2.view-title Товары по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      
      //- outgoing-record-form
      //- incoming-record-form
      //- advanced-sort(:search='search')
      //- excel-generator
  table-products(:search='search')
  
</template>

<script>
import TableProducts from "./TableProducts";
import { mapGetters, mapMutations } from "vuex";
// import ListClients from "./ListClients";
// import OutgoingRecordForm from "./OutgoingRecordForm";
// import IncomingRecordForm from "./IncomingRecordForm";
// import AdvancedSort from "./AdvancedSort";
// import ExcelGenerator from "./ExcelGenerator";

export default {
  name: "Clients",
  components: {
    TableProducts
    // OutgoingRecordForm,
    // IncomingRecordForm,
    // AdvancedSort,
    // ExcelGenerator
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
