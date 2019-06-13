<template lang="pug">
v-content
  attributes-dialog(:show="show_product", :product="product" @close-attributes-dialog="show_product = false")
  v-data-table.elevation-0.product-table(:headers='headers' :items='products' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.category.category_name }}
      td.text-xs-left
        span
          v-icon(@click="fun(props.item)") create  
      td.text-xs-left
        span
          v-icon(@click="show(props.item)") visibility        
</template>
<script>
import AttributesDialog from "./AttributesDialog"
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("products");
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "table-products",
  props: {
    search: ""
  },
  components:{
    AttributesDialog
  },
  created() {
    if (this.products.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      products: "products/get_products"
    })
  },
  data() {
    return {
      product: Object(),
      show_product: false,
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Kатегория", value: "category", sortable: false },
        { text: "", sortable: false },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "products/load_products"
    }),
    async getData() {
      const { data } = await repository.get();
      this.load_data(data);
    },
    show(object) {
      this.show_product = true;
      this.product = object;
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
