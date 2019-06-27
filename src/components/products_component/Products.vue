<template lang="pug">
div
  v-content
    h2.view-title Товары по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-product-form 
  table-products(:search='search')
  
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TableProducts from "./TableProducts";
import CreateProductForm from "./CreateProductForm"
export default {
  name: "Products",
  components: {
    TableProducts,
    CreateProductForm
  },

  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date"
    })
  },
  methods: {}
};
</script>

<style scoped>
.view-title {
  text-align: center;
  margin-top: 25px;
}

.v-text-field {
  margin-left: 1%;
}
</style>
