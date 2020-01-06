<template lang="pug">
v-content
  attributes-dialog(:show="show_product", :product="product" @close-attributes-dialog="show_product = false")
  v-data-table.elevation-0.product-table(:headers='headers' :items='products' :rows-per-page-items='[100,200,300]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.product_name }}
      td.text-xs-left(style='bold') {{ props.item.category.category_name }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create  
      td.text-xs-left
        span
          v-icon(@click="show(props.item)") visibility 
  product-edit-form(
    v-if="edit" 
    :appear="edit" 
    @edit-form-closed="edit=false" 
    :edit_object = "edit_object")               
</template>
<script>
import AttributesDialog from "./AttributesDialog";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("products");
import { mapGetters, mapMutations } from "vuex";
import ProductEditForm from "./ProductEditForm";
export default {
  name: "table-products",
  props: {
    search: String()
  },
  components: {
    ProductEditForm,
    AttributesDialog
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.products.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      products: "products/get_products",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      product: Object(),
      edit: false,
      edit_object: Object,
      isLoading: false,
      show_product: false,
      headers: [
        {
          text: "Наименование товара",
          value: "product_name",
          sortable: false
        },
        { text: "Kатегория", value: "category", sortable: false },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "products/load_products"
    }),
    async getData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      data.sort(function(a, b) {
        return a.product_name.toLowerCase().localeCompare(b.product_name);
      });
      this.load_data(data);
    },
    show(object) {
      this.show_product = true;
      this.product = object;
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
