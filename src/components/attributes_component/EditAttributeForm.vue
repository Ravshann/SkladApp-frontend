<template lang="pug">
div
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать параметр
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='attribute_name' label='Параметр продуктa' prepend-icon='settings_ethernet' placeholder='Параметр продуктa')       
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("attributes");

import { mapMutations } from "vuex";
import { setTimeout } from "timers";
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
export default {
  name: "edit-category-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object != undefined) {
      this.attribute_ID = this.edit_object.attribute_ID;
      this.attribute_name = this.edit_object.attribute_name;
    }
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      attribute_ID: "",
      attribute_name: ""
    };
  },
  methods: {
    ...mapMutations({
      laod_attributes: "attributes/load_attributes"
    }),
    clearAll() {
      this.$emit("edit-form-closed", false);
    },
    async updateStore() {
      const { data } = await repository.get();
      this.laod_attributes(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend

        let object = {
          attribute_name: this.attribute_name
        };
        repository.update(this.attribute_ID, object);
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