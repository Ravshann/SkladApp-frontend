<template lang="pug">
div
  // dialog for 'outgoing' button
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать компанию
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='name' label='Наименование компании' prepend-icon='domain' placeholder='Наименование компании')
        v-text-field(v-model='address' label='Адрес' prepend-icon='place' placeholder='Адрес')
        v-text-field(v-model='company_phone' label='Телефон' prepend-icon='phone' placeholder='Телефон')       
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("companies");

import { mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "edit-company-form",
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object != undefined) {
      this.company_ID = this.edit_object.company_ID;
      this.name = this.edit_object.name;
      this.address = this.edit_object.address;
      this.company_phone = this.edit_object.company_phone;
    }
  },

  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      company_ID: "",
      name: "",
      address: "",
      company_phone: ""
    };
  },
  methods: {
    ...mapMutations({
      load_companies: "companies/load_companies"
    }),
    clearAll() {
      this.$emit("edit-form-closed", false);
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_companies(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend

        let object = {
          name: this.name,
          address: this.address,
          company_phone: this.company_phone
        };
        // console.log(object);
        repository.update(this.company_ID, object);
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