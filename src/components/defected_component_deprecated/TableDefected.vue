<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(
    :headers='headers' 
    :items='data_is_sorted ? sorted_data : defected_records' 
    :rows-per-page-items='[25,50]' 
    :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.quantity }}
      td.text-xs-left {{ props.item.storage_name}}
      td.text-xs-left {{ props.item.supplier_storage_name }}
      td.text-xs-left {{ props.item.record_datetime }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create
  defected-record-edit-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("defected");
const storagesRepository = RepositoryFactory.get("storages");
import { mapGetters, mapMutations } from "vuex";
import DefectedRecordEditForm from "./DefectedRecordEditForm";
export default {
  name: "table-defected",
  components: {
    DefectedRecordEditForm
  },
  props: {
    search: String()
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    this.getDefectedStorages();
    var storage = 0;
    if (this.storage_list !== undefined) storage = this.storage_list;
    if (this.user_role === "Завсклад" && this.defected_records.length === 0) {
      if (storage.length !== 0)
        this.getDefectedDataByStorage(storage[0].storage_ID);
      else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              storage = mutation.payload;
              this.getDefectedDataByStorage(storage[0].storage_ID);
              break;
          }
        });
    } else if (
      this.user_role === "Управляющий" &&
      this.defected_records.length === 0
    ) {
      if (storage.length !== 0) {
        this.storage_ids = storage.map(function(storage) {
          return { storage_ID: storage.storage_ID };
        });
        this.getDefectedDataByDepartment(this.storage_ids);
      } else
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "storages/load_storages":
              this.storage_ids = mutation.payload.map(function(storage) {
                return { storage_ID: storage.storage_ID };
              });
              this.getDefectedDataByDepartment(this.storage_ids);
              break;
          }
        });
    } else if (this.defected_records.length === 0) this.getData();
  },
  computed: {
    ...mapGetters({
      defected_records: "defected/get_data",
      data_is_sorted: "defected/get_sorted_flag",
      sorted_data: "defected/get_sorted_data",
      user_role: "logged_user/get_user_role",
      storage_list: "storages/get_storages"
    })
  },
  data() {
    return {
      enabled: true,
      isLoading: false,
      edit: false,
      edit_object: Object,
      storage_ids: [],

      headers: [
        {
          text: "Наименование товара",
          sortable: false,
          value: "product_name"
        },
        { text: "Количество", value: "quantity", sortable: false },
        { text: "Склад получатель", value: "storage_name", sortable: false },
        {
          text: "Склад отправитель",
          value: "supplier_storage_name",
          sortable: false
        },
        { text: "Дата", value: "record_datetime", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "defected/load_data",
      load_defected_storages: "storages/load_defected_storages"
    }),
    async getDefectedStorages() {
      const { data } = await storagesRepository.get_defected_storage();
      this.load_defected_storages(data);
    },
    async getDefectedDataByStorage(storage_id) {
      if (this.storage_list[0].storage_type === "defected") {
        this.isLoading = true;
        const { data } = await repository.get_by_storage(storage_id);
        this.isLoading = false;
        this.load_data(data);
      } else {
        this.isLoading = true;
        const { data } = await repository.get_by_supplier_storage(storage_id);
        this.isLoading = false;
        this.load_data(data);
      }
    },
    async getDefectedDataByDepartment(storage_ids) {
      this.isLoading = true;
      const { data } = await repository.get_by_department_storages(storage_ids);
      this.isLoading = false;
      this.load_data(data);
    },
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
