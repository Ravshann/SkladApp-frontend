<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='defected_records' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.supplier_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create    
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("defected");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "table-defected",
  props: {
    search: ""
  },
  created() {
    if (this.defected_records.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      defected_records: "defected/get_data"
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
        { text: "От кого(поставщик)", sortable: false },
        { text: "Дата", sortable: false },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "defected/load_data"
    }),
    async getData() {
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
