<template lang="pug">
div
  v-content
    h2.view-title Клиенты по  {{getDate()}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      
      //- outgoing-record-form
      //- incoming-record-form
      //- advanced-sort(:search='search')
      //- excel-generator
  table-clients(:search='search')
  
</template>

<script>
import TableClients from "./TableClients"
// import ListClients from "./ListClients";
// import OutgoingRecordForm from "./OutgoingRecordForm";
// import IncomingRecordForm from "./IncomingRecordForm";
// import AdvancedSort from "./AdvancedSort";
// import ExcelGenerator from "./ExcelGenerator";

export default {
  name: "Clients",
  components: {
    TableClients
    // OutgoingRecordForm,
    // IncomingRecordForm,
    // AdvancedSort,
    // ExcelGenerator
  },

  data() {
    return {
      isLoading: false,
      search: ""
    };
  },
  computed: {
    search_computed: {
      get() {
        return this.search;
      },
      set(data) {
        this.search = data;
      }
    }
  },
  methods: {
    getDate: function() {
      var cur_date_vue = new Date();
      var month = ("0" + (cur_date_vue.getMonth() + 1)).slice(-2);
      var date = ("0" + cur_date_vue.getDate()).slice(-2);
      var year = cur_date_vue.getFullYear();
      var date_formatted_vue = year + "/" + month + "/" + date;
      return date_formatted_vue;
    }
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
