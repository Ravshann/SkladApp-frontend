<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='clients' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.client_name }}
      td.text-xs-left {{ props.item.region}}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create 
  clients-create-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")                
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("clients");
import { mapGetters, mapMutations } from "vuex";
import ClientsCreateForm from "./ClientsCreateForm";
export default {
  name: "table-clients",
  components: {
    ClientsCreateForm
  },
  props: {
    search: String()
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
      isLoading: false,
      edit: false,
      edit_object: Object,
      headers: [
        {
          text: "Имя(клиент)",
          sortable: false,
          value: "client_name"
        },
        { text: "Регион", sortable: false, value: "region" },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "clients/load_clients"
    }),
    async getData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_data(data);
    },
    editRow(row) {
      this.edit_object = row;
      this.edit = true;
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
