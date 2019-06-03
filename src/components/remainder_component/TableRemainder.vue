<template>
  <v-content>
    <v-data-table
      :headers="headers"
      :items="remainder_data"
      :rows-per-page-items="[25,50]"
      :search="search"
      class="elevation-0 product-table"
    >
      <template v-slot:items="props">
        <td>{{ props.item.productName }}</td>
        <td class="text-xs-left" style="bold">{{ props.item.categoryName }}</td>
        <td class="text-xs-left">{{ props.item.total}}</td>

        <td class="px-0">
          <template v-for="item in props.item.storageQuantities">
            <td class="text-xs-left pl-4" style="min-width: 100%;">{{ item.storageName }}</td>
            <v-divider></v-divider>
          </template>
        </td>
        <td class="px-0">
          <template v-for="item in props.item.storageQuantities">
            <td class="text-xs-left pl-4">{{ item.quantity }}</td>
            <v-divider></v-divider>
          </template>
        </td>
      </template>
    </v-data-table>
  </v-content>
</template>
<script>
export default {
  name: "table-remainder",

  props: {
    remainder_data: Array,
    search: ""
  },
  data: function() {
    return {
      headers: [
        {
          text: "Наименование товара",
          value: "productName",
          sortable: false
        },
        { text: "Kатегория", value: "category" },
        { text: "Общ. кол-во", value: "total" },
        { text: "Склад", value: "store_name" },
        { text: "Количество", value: "quantity"}
      ]
    };
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
