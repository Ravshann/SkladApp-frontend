<template lang="pug">
div
 
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать отдела
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
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("departments");

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
export default {
  name: "edit-user-form",
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
      this.department_ID = this.edit_object.department_ID;
      this.name = this.edit_object.name;
      this.address = this.edit_object.address;
      this.description = this.edit_object.description;
      this.department_phone = this.edit_object.department_phone;
      this.company = this.edit_object.company;
      this.department_manager = this.edit_object.department_manager;
    }
  },
  computed: {
    ...mapGetters({
      company_list: "companies/get_companies",
      department_manager_list: "department_managers/get_department_managers"
    })
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      department_ID: "",

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
      this.$emit("edit-form-closed", false);
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
        repository.update(this.department_ID, object);
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