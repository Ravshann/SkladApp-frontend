<template lang="pug">
div
 
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать пользователя
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='first_name' label='Имя' prepend-icon='assignment' placeholder='Имя')
        v-text-field(v-model='last_name' label='Фамилия' prepend-icon='assignment' placeholder='Фамилия')
        v-text-field(v-model='user_phone' label='Телефон' prepend-icon='phone' placeholder='Телефон')
        v-text-field(v-model='password' label='Пароль' prepend-icon='https' placeholder='Пароль')
        v-text-field(v-model='username' label='Логин' prepend-icon='pets' placeholder='Логин')
        v-autocomplete(
          v-model='company' 
          :items="company_list" 
          label='Компания' 
          prepend-icon='domain'  
          persistent-hint 
          item-text='name'
          return-object)
        v-autocomplete(
          v-model='role' 
          :items="role_list" 
          label='Должность' 
          prepend-icon='stars'  
          persistent-hint 
          item-text='role_name'
          return-object)
       
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("users");
const departmentManagersRepository = RepositoryFactory.get(
  "department_managers"
);

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "edit-user-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    // console.log(this.edit_object);
    if (this.edit_object != undefined) {
      this.user_ID = this.edit_object.user_ID;
      this.first_name = this.edit_object.first_name;
      this.last_name = this.edit_object.last_name;
      this.email = this.edit_object.email;
      this.user_phone = this.edit_object.user_phone;
      this.company = this.edit_object.company_ID;
      this.role = this.edit_object.role_ID;
      this.password = this.edit_object.password;
      this.username = this.edit_object.username;
    }
  },
  computed: {
    ...mapGetters({
      company_list: "companies/get_companies",
      role_list: "roles/get_roles"
    })
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,

      user_ID: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      username: "",
      user_phone: "",
      company: Object,
      role: Object,
      supervisor: ""
    };
  },
  methods: {
    ...mapMutations({
      load_users: "users/load_users",
      load_department_managers: "department_managers/load_department_managers"
    }),
    clearAll() {
      this.$emit("edit-form-closed", false);
    },
    async updateManagers() {
      const { data } = await departmentManagersRepository.get();
      this.load_department_managers(data);
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_users(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend

        let object = {
          username: this.username,
          supervisor: this.supervisor,
          password: this.password,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          user_phone: this.user_phone,
          company_ID: this.company.company_ID,
          role_ID: this.role.role_ID
        };
        // console.log(object);
        repository.update(this.user_ID, object);
        //clear data
        this.clearAll();
      } else {
        this.save_records = false;
      }
      setTimeout(() => {
        this.updateStore();
        this.updateManagers();
      }, 2000);
    }
  }
};
</script>