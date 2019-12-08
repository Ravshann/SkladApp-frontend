<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='categories' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.category_name }}
      td {{ props.item.parent_category_name }}
      td {{ props.item.unit_measure }}
      td {{ props.item.category_notes }}
      td.text-xs-left(v-if="enabled")
        span
          v-icon(@click="editRow(props.item)") create 
  edit-category-form(v-if="edit" :edit_object="edit_object" :appear="edit" @edit-form-closed="edit=false")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("categories");
import { mapGetters, mapMutations } from "vuex";
import EditCategoryForm from "./EditCategoryForm";

export default {
  name: "table-categories",
  props: {
    search: String
  },
  components: {
    EditCategoryForm
  },
  mounted() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
    if (this.enabled) this.headers.push({ text: "", sortable: false });
  },
  created() {
    if (this.categories.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      categories: "categories/get_categories",
      user_role: "logged_user/get_user_role"
    })
  },
  data() {
    return {
      enabled: true,
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Kатегория", value: "category_name", sortable: false },
        {
          text: "Предкатегория",
          sortable: false,
          value: "parent_category_name"
        },
        {
          text: "Единицы измерения",
          sortable: false,
          value: "unit_measure"
        },
        {
          text: "Примечание",
          sortable: false,
          value: "category_notes"
        }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "categories/load_categories"
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
