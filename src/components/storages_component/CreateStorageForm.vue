<template lang="pug">
div
  v-btn(color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model ="dialog" persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='dialog=false' title='свернуть')
          v-icon close
        v-toolbar-title Новый склад
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='storage_name' label='Имя(склад)' prepend-icon='assignment' placeholder='Имя(склад)')
        v-text-field(v-model='address' label='Адрес' prepend-icon='place' placeholder='Адрес')
        v-text-field(v-model='storage_phone' label='Телефон' prepend-icon='phone' placeholder='Телефон')
        v-autocomplete(
          v-model='department' 
          :items="department_list" 
          label='Отдел' 
          prepend-icon='layers'  
          persistent-hint 
          item-text='name'
          return-object)
        v-autocomplete(
          v-model='storage_manager' 
          :items="storage_manager_list" 
          label='Зав-Склад' 
          prepend-icon='streetview'  
          persistent-hint 
          item-text='first_name'
          return-object)
</template>
<script>

import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("storages");

import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "create-storage-form",
  
  computed: {
    ...mapGetters({
      department_list: "departments/get_departments",
      storage_manager_list: "storage_managers/get_storage_managers"
    })
  },
  data() {
    return {
      dialog: false,
      save_records: false,
      inform_dialog_done: false,

      storage_name: "",
      address: "",
      storage_phone: "",
      department: Object,
      storage_manager: Object
    };
  },
  methods: {
    ...mapMutations({
      load_storages: "storages/load_storages"
    }),
    clearAll() {
      this.storage_name = "";
      this.address = "";
      this.storage_phone = "";
      this.department = "";
      this.storage_manager = "";
      this.dialog = false;
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_storages(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let object = {
          storage_name: this.storage_name,
          address: this.address,
          storage_phone: this.storage_phone,
          department_ID: this.department.department_ID,
          storage_manager_ID: this.storage_manager.user_ID
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