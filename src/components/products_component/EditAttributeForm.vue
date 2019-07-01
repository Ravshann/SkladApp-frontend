<template lang="pug">
div
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='saveChanges(false)' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать значение
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='attribute_value' type='number' label='Значение' prepend-icon='straighten' placeholder='Значение')       
</template>
<script>
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
export default {
  name: "edit-attribute-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object !== undefined) {
      this.attribute_value = this.edit_object.attribute_value;
    }
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      attribute_value: Number
    };
  },
  methods: {
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let changed = this.edit_object.attribute_value !== this.attribute_value;
        let object = {
          attribute: this.edit_object,
          attribute_value: this.attribute_value,
          changed: changed
        };
        this.$emit("edit-form-closed", object);
      } else {
        this.save_records = false;
        let object = {
          changed: false
        };
        this.$emit("edit-form-closed", object);
      }
    }
  }
};
</script>