<template lang="pug">
div
  v-content
    h2.view-title Товары по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-product-form(v-if="enabled") 
  table-products(:search='search')
  
</template>

<script>
import { mapGetters } from "vuex";
import TableProducts from "./TableProducts";
import CreateProductForm from "./CreateProductForm";
export default {
  name: "Products",
  components: {
    TableProducts,
    CreateProductForm
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  data() {
    return {
      search: String(),
      enabled: true
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date",
      user_role: "logged_user/get_user_role"
    })
  }
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
