<template lang="pug">
div
  v-content
    h2.view-title Параметры продуктов
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details max-width='20px')
      v-spacer
      v-spacer
      v-spacer
      v-layout(v-show="enabled")
        v-text-field(v-model='newItem' append-icon='settings_ethernet' label='Новый параметр' single-line hide-details)
        v-btn(color='indigo' @click='create' fab dark  flat title='добавить') 
          v-icon(dark) {{icon}}
      save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
      inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
  table-attributes(:search='search')
  
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import TableAttributes from "./TableAttributes";

import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("attributes");
export default {
  name: "Attributes",
  components: {
    TableAttributes
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  data() {
    return {
      search: String(),
      newItem: String(),
      icon: "add",
      save_records: false,
      inform_dialog_done: false,
      enabled: true
    };
  },
  computed: {
    ...mapGetters({ user_role: "logged_user/get_user_role" })
  },
  methods: {
    ...mapMutations({
      load_attributes: "attributes/load_attributes"
    }),
    create() {
      if (this.newItem !== "") this.save_records = true;
    },
    async refresh() {
      const { data } = await repository.get();
      this.load_attributes(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        let formatted = {
          attribute_name: this.newItem
        };
        repository.save(formatted);
        this.newItem = "";
      } else {
        this.save_records = false;
      }
      setTimeout(() => {
        this.refresh();
      }, 1000);
    }
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
