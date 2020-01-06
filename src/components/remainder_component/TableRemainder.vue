<template lang="pug">
div(v-if='!isLoading')
  v-data-table.elevation-0.product-table(
    :headers='headers' 
    :items='data_is_sorted ? remainder_data_sorted : remainder_data' 
    :rows-per-page-items='[100,200,300]' 
    :search='search')
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
const storagesRepository = RepositoryFactory.get("storages");
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "table-remainder",
  props: {
    search: String()
  },
  computed: {
    ...mapGetters({
      remainder_data: "remainders/get_remainder_data",
      data_is_sorted: "remainders/get_sorted_flag",
      remainder_data_sorted: "remainders/get_sorted_data",
      user_role: "logged_user/get_user_role",
      user_ID: "logged_user/get_user_ID",
      storage_list: "storages/get_storages"
    })
  },
  created() {
    if (this.user_role === "Завсклад") {
      this.getStorage(this.user_ID);
    } else if (this.user_role === "Управляющий") {
      this.getRegionalStorages(this.user_ID);
    } else {
      this.getRemainders();
    }
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
        { text: "Kатегория", value: "category", sortable: false },
        { text: "Общ. кол-во", value: "total", sortable: false },
        { text: "Склад", value: "storage_name", sortable: false },
        { text: "Количество", value: "quantity", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_remainder_data: "remainders/load_remainder_data",
      load_storages: "storages/load_storages"
    }),
    async getStorage(user_ID) {
      const { data } = await storagesRepository.get_single(user_ID);
      var array = [data];
      this.load_storages(array);
      this.getRemainders();
    },
    async getRegionalStorages(user_ID) {
      const { data } = await storagesRepository.get_regional_storages(user_ID);
      this.load_storages(data);
      this.getRemainders();
    },
    async getRemainders() {
      //if user is zavsklad
      if (this.user_role === "Завсклад" && this.storage_list[0] !== undefined) {
        var storage_id = this.storage_list[0].storage_ID;
        this.isLoading = true;
        const { data } = await repository.get_by_storage(storage_id);
        this.isLoading = false;
        data.sort(function(a, b) {
          return a.productName.toLowerCase().localeCompare(b.productName);
        });
        this.load_remainder_data(data);
      } else if (
        this.user_role === "Управляющий" &&
        this.storage_list[0] !== undefined
      ) {
        // var storage_id = this.storage_list[0].storage_ID;
        var list = [];
        this.storage_list.forEach(element => {
          let a = { storage_ID: element.storage_ID };
          list.push(a);
        });
        this.isLoading = true;
        const { data } = await repository.get_by_department_storages(list);
        this.isLoading = false;
        data.sort(function(a, b) {
          return a.productName.toLowerCase().localeCompare(b.productName);
        });
        this.load_remainder_data(data);
      }
      //the user is not zavkslad or department manager
      else {
        this.isLoading = true;
        const { data } = await repository.get();
        // console.log(data);
        this.isLoading = false;

        data.sort(function(a, b) {
          // console.log(a);

          return a.productName.toLowerCase().localeCompare(b.productName);
        });
        this.load_remainder_data(data);
      }
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
