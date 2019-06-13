<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='clients' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.client_name }}
      td.text-xs-left {{ props.item.region}}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create    
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("clients");
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "table-clients",
  props: {
    search: ""
  },
  created() {
    if (this.clients.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients"
    })
  },
  data() {
    return {
      headers: [
        {
          text: "Имя(клиент)",
          sortable: false,
          value: "client_name"
        },
        { text: "Регион", sortable: false, value: "region"  },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "clients/load_clients"
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
