<template lang="pug">
div
  // dialog for 'outgoing' button
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        // dialog for confirmation
        v-dialog(v-model='save_records' max-width='290')
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
      v-card-text
        v-text-field(v-model='supplier_name' label='Имя поставщика' prepend-icon='local_shipping' placeholder='Имя')
       
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("suppliers");

import { mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "edit-supplier-form",
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object != undefined) {
      this.supplier_name = this.edit_object.supplier_name;
      this.supplier_ID = this.edit_object.supplier_ID;
    }
  },
  data() {
    return {
      dialog: false,
      show: true,
      save_records: false,
      inform_dialog_done: false,
      supplier_ID: Number,
      supplier_name: ""
    };
  },
  methods: {
    ...mapMutations({
      load_suppliers: "suppliers/load_suppliers"
    }),
    clearAll() {
      this.$emit("edit-form-closed", false);
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_suppliers(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let object = {
          supplier_name: this.supplier_name
        };
        repository.update(this.supplier_ID, object);
        //clear data
        this.clearAll();
      } else {
        this.save_records = false;
      }
      setTimeout(() => {
        this.updateStore();
      }, 1000);
    }
  }
};
</script>