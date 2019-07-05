<template lang="pug">
div
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model ="dialog" persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog=false' title='свернуть')
          v-icon close
        v-toolbar-title Новый пользователь
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
import SaveChangesDialog from "../global_components/SaveChangesDialog";
import InformDialogDone from "../global_components/InformDialog";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("users");

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "create-user-form",
  components: {
    SaveChangesDialog,
    InformDialogDone
  },
  computed: {
    ...mapGetters({
      company_list: "companies/get_companies",
      role_list: "roles/get_roles"
    })
  },
  data() {
    return {
      dialog: false,
      save_records: false,
      inform_dialog_done: false,

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
      load_users: "users/load_users"
    }),
    clearAll() {
      this.first_name = "";
      this.last_name = "";
      this.username = "";
      this.password = "";
      this.user_phone = "";
      this.company = "";
      this.role = "";
      this.dialog = false;
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