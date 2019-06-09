<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='outgoing_records' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.client_region}}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create    
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("outgoing");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "table-outgoing",
  props: {
    search: ""
  },
  created() {
    if (this.outgoing_records.length === 0) {
      this.getOutgoingData();
    }
  },
  computed: {
    ...mapGetters({
      outgoing_records: "outgoing/get_outgoing_data"
    })
  },
  data() {
    return {
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Количество", value: "quantity" },
        { text: "Регион", value: "client_region" },
        { text: "Кому", value: "client_name" },
        { text: "Дата", value: "record_datetime" },
        { text: "", value: "edit_button" }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_outgoing_data: "outgoing/load_outgoing_data"
    }),
    async getOutgoingData() {
      const { data } = await repository.get();
      this.load_outgoing_data(data);
    }
  }
};
</script>
<style scoped>
.product-table {
  border: 1px solid #bdbdbd;
  padding: 3px;
  margin: 7px;
  box-shadow: #157c5d 10px;
}
</style>
