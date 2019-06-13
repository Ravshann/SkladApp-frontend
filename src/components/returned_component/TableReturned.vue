<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='returned_records' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.client_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create    
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("returned");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "table-returned",
  props: {
    search: ""
  },
  created() {
    if (this.returned_records.length === 0) {
      this.getReturnedData();
    }
  },
  computed: {
    ...mapGetters({
      returned_records: "returned/get_returned_data"
    })
  },
  data() {
    return {
      headers: [
        {
          text: "Наименование товара",
          sortable: false
        },
        { text: "Количество", sortable: false },
        { text: "Склад", sortable: false },
        { text: "От кого(клиент)", sortable: false },
        { text: "Дата", sortable: false },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "returned/load_returned_data"
    }),
    async getReturnedData() {
      const { data } = await repository.get();
      this.load_data(data);
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
