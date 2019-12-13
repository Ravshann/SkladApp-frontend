<template lang="pug">
div
  v-content
    h2.view-title Поставщики по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-spacer
      v-spacer
      v-layout(v-if="enabled")
        v-text-field(v-model='newSupplier' append-icon='person' label='Новый поставщик' single-line hide-details)
        v-btn(color='indigo' @click='create' fab dark  flat) 
          v-icon(dark) {{icon}}
      save-changes-dialog(:save_records="save_dialog" @save-changes-dialog-event="saveChanges")
      inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
  table-suppliers(:search='search')
  
</template>

<script>
import TableSuppliers from "./TableSuppliers";
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("suppliers");
export default {
  name: "Suppliers",
  components: {
    TableSuppliers
  },
  created() {
    this.enabled = this.user_role === "Наблюдатель" ? false : true;
  },
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      newSupplier: String(),
      icon: "add",
      search: String()
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date",
      user_role: "logged_user/get_user_role"
    })
  },
  methods: {
    ...mapMutations({
      load_suppliers: "suppliers/load_suppliers"
    }),
    create() {
      if (this.newSupplier !== "") this.save_dialog = true;
    },
    async refresh() {
      const { data } = await repository.get();
      this.load_suppliers(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;
        let formatted = {
          supplier_name: this.newSupplier
        };
        repository.save(formatted);
        this.newSupplier = "";
      } else {
        this.save_dialog = false;
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
