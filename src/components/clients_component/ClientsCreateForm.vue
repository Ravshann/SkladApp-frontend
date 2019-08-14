<template lang="pug">
div
  // button for opening dialog
  v-btn(v-if = "show" color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model='dialog' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Новый клиент
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        // dialog for confirmation
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='client_name' label='Имя' prepend-icon='person' placeholder='Имя')
        v-text-field(v-model='region' label='Регион' prepend-icon='place' placeholder='Регион')
        v-spacer(vertical)
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("clients");

import { mapMutations } from "vuex";
import { setTimeout } from "timers";
export default {
  name: "clients-create-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object !== undefined) {
      this.dialog = true;
      this.show = false;
      this.client_id = this.edit_object.client_ID;
      this.client_name = this.edit_object.client_name;
      this.region = this.edit_object.region;
    }
  },
  data() {
    return {
      dialog: false,
      show: true,
      save_records: false,
      inform_dialog_done: false,
      client_id: Number,
      client_name: "",
      region: ""
    };
  },
  methods: {
    ...mapMutations({
      load_clients: "clients/load_clients"
    }),
    clearAll() {
      this.client_name = "";
      this.region = "";
      this.dialog = false;
      if (this.show === false) {
        this.$emit("edit-form-closed", false);
      }
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_clients(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let object = {
          client_name: this.client_name,
          region: this.region
        };
        if (this.show) repository.save(object);
        else repository.update(this.client_id, object);
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