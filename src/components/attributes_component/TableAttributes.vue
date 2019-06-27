<template lang="pug">
v-content
  v-data-table.elevation-0.product-table(:headers='headers' :items='attributes' :rows-per-page-items='[25,50]' :search='search')
    template(v-slot:items='props')
      td {{ props.item.attribute_name }}
      td.text-xs-left
        span
          v-icon(@click="editRow(props.item)") create 
  edit-attribute-form(v-if="edit" :edit_object="edit_object" :appear="edit" @edit-form-closed="edit=false")            
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("attributes");
import { mapGetters, mapMutations } from "vuex";
import EditAttributeForm from "./EditAttributeForm";

export default {
  name: "table-attributes",
  props: {
    search: String
  },
  components: {
    EditAttributeForm
  },
  created() {
    if (this.attributes.length === 0) {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      attributes: "attributes/get_attributes"
    })
  },
  data() {
    return {
      edit: false,
      edit_object: Object,
      headers: [
        { text: "Параметр продуктa", value: "attribute_name", sortable: false },
        { text: "", sortable: false }
      ]
    };
  },
  methods: {
    ...mapMutations({
      load_data: "attributes/load_attributes"
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
