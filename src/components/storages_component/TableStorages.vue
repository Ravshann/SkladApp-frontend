<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='storages' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.storage_name }}
      td.text-xs-left {{ props.item.address}}
      td.text-xs-left {{ props.item.storage_phone}}
      td.text-xs-left {{ props.item.department_ID}}
      td.text-xs-left {{ props.item.storage_manager_ID}}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create    
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("storages");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "table-storages",
  props: {
    search: ""
  },
  created() {
    if (this.storages.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      storages: "storages/get_storages"
    })
  },
  data() {
    return {
      headers: [
        { text: "Имя(склад)", sortable: false, value: "storage_name" },
        { text: "Адрес", sortable: false, value: "address" },
        { text: "Телефон", sortable: false, value: "phone" },
        { text: "Отдел", sortable: false, value: "department_ID" },
        { text: "Зав.склад", sortable: false, value: "storage_manager_ID" },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "storages/load_storages"
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
