<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='storages' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.storage_name }}
      td.text-xs-left {{ props.item.address}}
      td.text-xs-left {{ props.item.storage_phone}}
      td.text-xs-left {{ props.item.department_name}}
      td.text-xs-left {{ props.item.storage_manager_name}}
      td.text-xs-left {{ props.item.storage_type}}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create
  edit-storage-form(v-if="edit" :edit_object="edit_object" :appear="edit" @edit-form-closed="edit=false")   
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("storages");
import { mapGetters, mapMutations } from "vuex";
import EditStorageForm from "./EditStorageForm";
export default {
  name: "table-storages",
  props: {
    search: String()
  },
  components: {
    EditStorageForm
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.storages.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      storages: "storages/get_storages",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      enabled: true,
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Имя(склад)", sortable: false, value: "storage_name" },
        { text: "Адрес", sortable: false, value: "address" },
        { text: "Телефон", sortable: false, value: "phone" },
        { text: "Отдел", sortable: false, value: "department_name" },
        { text: "Зав.склад", sortable: false, value: "storage_manager_name" },
        { text: "Тип склада", sortable: false, value: "storage_type" }
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
