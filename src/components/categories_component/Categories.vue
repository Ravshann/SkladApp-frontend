<template lang="pug">
div
  v-content
    h2.view-title Категории по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-category-form
  table-categories(:search='search')
  
</template>

<script>
import TableCategories from "./TableCategories";
import { mapGetters } from "vuex";
import CreateCategoryForm from "./CreateCategoryForm";
export default {
  name: "Categories",
  components: {
    TableCategories,
    CreateCategoryForm
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
  margin-right: 1%;
}
</style>
