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
        v-layout(column wrap)
          v-layout(row wrap)
            v-text-field.pr-4(v-model='storage_name' label='Имя(склад)' prepend-icon='assignment' placeholder='Имя(склад)')
            v-checkbox.pl-4(v-model="checkbox" :label="`Склад бракованных товаров`" color = "purple")
          v-layout(row wrap)
            v-text-field.pr-2(v-model='address' label='Адрес' prepend-icon='place' placeholder='Адрес')
            v-text-field.pl-2(v-model='storage_phone' label='Телефон' prepend-icon='phone' placeholder='Телефон')
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
  name: "edit-storage-form",

  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object !== undefined) {
      this.storage_ID = this.edit_object.storage_ID;
      this.storage_name = this.edit_object.storage_name;
      this.address = this.edit_object.address;
      this.storage_phone = this.edit_object.storage_phone;
      this.department = {
        department_name: this.edit_object.department_name,
        department_ID: this.edit_object.department_ID
      };
      this.storage_manager = {
        storage_manager_name: this.edit_object.storage_manager_name,
        storage_manager_ID: this.edit_object.storage_manager_ID
      };
      this.checkbox =
        this.edit_object.storage_type === "defected" ? true : false;
    }
  },
  computed: {
    ...mapGetters({
      department_list: "departments/get_departments",
      storage_manager_list: "storage_managers/get_storage_managers"
    })
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      storage_ID: "",

      checkbox: false,
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
      this.$emit("edit-form-closed", false);
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
          storage_manager_ID: this.storage_manager.user_ID,
          storage_type: this.checkbox ? "defected" : ""
        };
        // console.log(object);
        repository.update(this.storage_ID, object);
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