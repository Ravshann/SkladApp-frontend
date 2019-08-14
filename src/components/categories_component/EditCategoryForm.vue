<template lang="pug">
div
  //- v-btn(v-if = "show" color='#FF8C00' dark @click='dialog = true') Добавить
  // dialog for 'outgoing' button
  v-dialog(v-model='appear' persistent max-width='800px'  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='#FF8C00')
        v-btn(icon dark @click='clearAll' title='свернуть')
          v-icon close
        v-toolbar-title Редактировать категорию
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-text-field(v-model='category_name' label='Имя категории' prepend-icon='style' placeholder='Имя категории')
        v-text-field(v-model='category_notes' label='Примечание' prepend-icon='class' placeholder='Примечание')
        v-text-field(v-model='unit_measure' label='Измерение' prepend-icon='straighten' placeholder='Измерение')
        v-autocomplete(
          v-model='parent_category' 
          :items="category_list" 
          label='Категории' 
          prepend-icon='style'  
          persistent-hint 
          item-text='category_name'
          return-object)
       
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("categories");
import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "edit-category-form",
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    if (this.edit_object != undefined) {
      this.category_ID = this.edit_object.category_ID;
      this.category_name = this.edit_object.category_name;
      this.category_notes = this.edit_object.category_notes;
      this.unit_measure = this.edit_object.unit_measure;
      this.parent_category = {
        category_name: this.edit_object.parent_category_name,
        category_ID: this.edit_object.parent_category_ID
      };
    }
  },
  computed: {
    ...mapGetters({
      category_list: "categories/get_categories"
    })
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,
      category_ID: "",
      category_name: "",
      category_notes: "",
      unit_measure: "",
      parent_category: Object
    };
  },
  methods: {
    ...mapMutations({
      load_categories: "categories/load_categories"
    }),
    clearAll() {
      this.$emit("edit-form-closed", false);
    },
    async updateStore() {
      const { data } = await repository.get();
      this.load_categories(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        //make axios call to save it in backend
        let pcid = "";
        if (this.parent_category !== undefined)
          if (this.parent_category.category_ID !== null)
            pcid = this.parent_category.category_ID;
        let object = {
          category_name: this.category_name,
          category_notes: this.category_notes,
          unit_measure: this.unit_measure,
          parent_category_ID: pcid
        };

        repository.update(this.category_ID, object);
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