<template lang="pug">
div
  v-content
    h2.view-title Склады
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-storage-form
  table-storages(:search='search')
  
</template>

<script>
import TableStorages from "./TableStorages";
import CreateStorageForm from "./CreateStorageForm";

export default {
  name: "Storages",
  components: {
    TableStorages,
    CreateStorageForm
  },

  data() {
    return {
      search: ""
    };
  },
 
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
