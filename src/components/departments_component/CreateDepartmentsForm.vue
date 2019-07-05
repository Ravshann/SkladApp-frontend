<template lang="pug">
div
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model ="dialog" persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog=false' title='свернуть')
          v-icon close
        v-toolbar-title Новый отдел
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='name' label='Имя' prepend-icon='assignment' placeholder='Имя')
        v-text-field(v-model='address' label='Адрес' prepend-icon='place' placeholder='Адрес')
        v-text-field(v-model='department_phone' label='Телефон' prepend-icon='phone' placeholder='Телефон')
        v-text-field(v-model='description' label='Описание' prepend-icon='subject' placeholder='Описание')
        v-autocomplete(
          v-model='company' 
          :items="company_list" 
          label='Компания' 
          prepend-icon='domain'  
          persistent-hint 
          item-text='name'
          return-object)
        v-autocomplete(
          v-model='department_manager' 
          :items="department_manager_list" 
          label='Зав-Склад' 
          prepend-icon='streetview'  
          persistent-hint 
          item-text='first_name'
          return-object)
</template>
<script>
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("departments");

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "create-departments-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  computed: {
    ...mapGetters({
      company_list: "companies/get_companies",
      department_manager_list: "department_managers/get_department_managers"
    })
  },
  data() {
    return {
      dialog: false,
      save_records: false,
      inform_dialog_done: false,

      name: "",
      address: "",
      description: "",
      department_phone: "",
      company: Object,
      department_manager: Object
    };
  },
  methods: {
    ...mapMutations({
      load_departments: "departments/load_departments"
    }),
    clearAll() {
      this.name = "";
      this.address = "";
      this.description = "";
      this.department_phone = "";
      this.company = "";
      this.department_manager = "";
      this.dialog = false;
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_departments(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let object = {
          description: this.description,
          name: this.name,
          address: this.address,
          department_phone: this.department_phone,
          company_ID: this.company.company_ID,
          department_manager_ID: this.department_manager.user_ID
        };
        // console.log(object);
        repository.save(object);
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