<template lang="pug">
v-content(v-if='!isLoading')
  v-data-table.elevation-0.product-table(:headers='headers' :items='remainder_data' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.productName }}
      td.text-xs-left(style='bold') {{ props.item.categoryName }}
      td.text-xs-left {{ props.item.total}}
      td.px-0
        template(v-for='(item, index) in props.item.storageQuantities')
          td.text-xs-left.pl-4(style='min-width: 100%;') {{ item.storageName }}
          v-divider(v-if="index !== (props.item.storageQuantities.length-1)")
      td.px-0
        template(v-for='(item,index) in props.item.storageQuantities')
          td.text-xs-left.pl-4 {{ item.quantity }}
          v-divider(v-if="index !== (props.item.storageQuantities.length-1)")
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("remainder");

import { mapGetters, mapMutations } from "vuex";

export default {
  name: "table-remainder",
  props: {
    search: ""
  },
  computed: {
    ...mapGetters({
      remainder_data: "remainders/get_remainder_data"
    })
  },
  created() {
    this.getRemainders();
  },
  data() {
    return {
      isLoading: false,
      headers: [
        {
          text: "Наименование товара",
          value: "productName",
          sortable: false
        },
        { text: "Kатегория", value: "category" },
        { text: "Общ. кол-во", value: "total" },
        { text: "Склад", value: "storage_name", sortable: false },
        { text: "Количество", value: "quantity", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_remainder_data: "remainders/load_remainder_data"
    }),
    async getRemainders() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_remainder_data(data);
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
