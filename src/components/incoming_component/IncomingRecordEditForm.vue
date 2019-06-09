<template lang="pug">
div
  v-dialog(v-model='appear' max-width='800px'  transition='dialog-bottom-transition' scrollable='')
    v-card(title='')
      v-toolbar(card='' dark='' color='primary')
        v-btn(icon='' dark='' @click='close' title='отменить')
          v-icon close
        v-toolbar-title Изменить данные
        v-spacer
        v-toolbar-items
          v-btn(dark='' flat='' @click='save_edited_record = true') Сохранить
        // dialog for confirmation
        v-dialog(v-model='save_edited_record' max-width='290')
          v-card
            v-card-title.headline make imports?
            v-card-text all imports will be saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
        v-dialog(v-model='inform_dialog_done' max-width='290')
          v-card
            v-card-title.headline exports saved
            v-card-text all exports are saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected')
          // autocomplete fields
        v-autocomplete(v-model='record.supplier_name' :items="supplier_list" label='Поставщики' prepend-icon='local_shipping' persistent-hint='' item-text='supplier_name')
        v-autocomplete(v-model='record.product_name'  label='Наименование товара' prepend-icon='sort' persistent-hint='' item-text='product_name')
        v-autocomplete(v-model='record.storage_name'  label='Склад' prepend-icon='home' persistent-hint='' item-text='storage_name')
        v-autocomplete(v-model.number='record.quantity'   type='number' label='Количество' prepend-icon='edit' placeholder='0')
      //- div(style='flex: 1 1 auto;')  
</template>
<script>
import DataPickMenu from "../DataPickMenu";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "incoming-record-edit-form",
  components: { DataPickMenu },
  created() {
    // console.log(this.row);
  },
  computed: {
    ...mapGetters({
      record: "incoming/get_edited_record",
      supplier_list: "suppliers/get_suppliers"
    })
  },
  data() {
    return {
      save_edited_record: false,
      inform_dialog_done: false,
      date: ""
    };
  },
  methods: {
    dateSelected: function(date) {
      this.date = date;
    },
    ...mapMutations({
      save_changed_record: "incoming/save_edited_record"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    saveChanges: function(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_edited_record = false;
      } else {
        this.save_edited_record = false;
      }
    }
  },
  props: {
    appear: Boolean,
    row: Object
  }
};
</script>

<style scoped>
</style>
