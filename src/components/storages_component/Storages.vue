<template lang="pug">
div
  v-content
    h2.view-title Склады
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details)
      v-spacer
      v-spacer
      v-spacer
      create-storage-form(v-if="enabled")
  table-storages(:search='search')
  
</template>

<script>
import TableStorages from "./TableStorages";
import CreateStorageForm from "./CreateStorageForm";
import { mapGetters } from "vuex";
export default {
  name: "Storages",
  components: {
    TableStorages,
    CreateStorageForm
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
