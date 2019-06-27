<template lang="pug">
div
  v-content
    h2.view-title Поставщики по  {{today}}
    v-layout(row)
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line hide-details)
      v-spacer
      v-text-field(v-model='newSupplier' append-icon='person' label='Новый поставщик' single-line hide-details)
      v-btn(color='indigo' @click='create' fab dark  flat) 
        v-icon(dark) {{icon}}
      //- advanced-sort(:search='search')
      //- excel-generator

      v-dialog(v-model='save_dialog' max-width='290')
        v-card
          v-card-title.headline save changes?
          v-card-text all changes will be saved.
          v-card-actions
            v-spacer
            v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
            v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
      v-dialog(v-model='inform_dialog_done' max-width='290')
        v-card
          v-card-title.headline changes saved
          v-card-text all changes are saved.
          v-card-actions
            v-spacer
            v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
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
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      newSupplier: "",
      icon: "add",
      search: ""
    };
  },
  computed: {
    ...mapGetters({
      today: "date/get_date",
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
