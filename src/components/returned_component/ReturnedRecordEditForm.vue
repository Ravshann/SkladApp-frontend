<template lang="pug">
div
  v-dialog(v-model='appear' max-width='800px' persistent  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='close' title='отменить')
          v-icon close
        v-toolbar-title Изменить данные
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_dialog = true') Сохранить
        // dialog for confirmation
        v-dialog(v-model='save_dialog' max-width='290')
          v-card
            v-card-title.headline save changes?
            v-card-text all changes will be saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
              v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
        // dialog for notifiying
        v-dialog(v-model='inform_dialog_done' max-width='290')
          v-card
            v-card-title.headline changes saved
            v-card-text all changes are saved.
            v-card-actions
              v-spacer
              v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
      v-card-text
        // data pick menu
        data-pick-menu(@date-selected-event='dateSelected' :custom_date='record_datetime')
          // autocomplete fields
        v-autocomplete(
          v-model='client' 
          :items="client_list" 
          label='От кого(клиент)' 
          prepend-icon='person'  
          persistent-hint 
          item-text='client_name'
          return-object)
        v-autocomplete(
          v-model='product' 
          :items="product_list" 
          label='Наименование товара' 
          prepend-icon='sort' 
          persistent-hint 
          item-text='product_name' 
          return-object)
        v-autocomplete(
          v-model='storage' 
          :items="storage_list" 
          label='Склад' 
          prepend-icon='home' 
          persistent-hint 
          item-text='storage_name' 
          return-object)
        v-text-field(
          v-model.number='quantity' 
          type='number' 
          label='Количество' 
          prepend-icon='edit' 
          placeholder='0')
</template>
<script>
import DataPickMenu from "../DataPickMenu";
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const returnedRepository = RepositoryFactory.get("returned");
export default {
  name: "returned-record-edit-form",
  components: { DataPickMenu },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    this.client = {
      client_name: this.edit_object.client_name,
      client_ID: this.edit_object.client_ID
    };
    this.product = {
      product_name: this.edit_object.product_name,
      product_ID: this.edit_object.product_ID
    };
    this.storage = {
      storage_name: this.edit_object.storage_name,
      storage_ID: this.edit_object.storage_ID
    };
    this.quantity = this.edit_object.quantity;
    this.record_datetime = this.edit_object.record_datetime;
  },
  computed: {
    ...mapGetters({
      client_list: "clients/get_clients",
      product_list: "products/get_products",
      storage_list: "storages/get_storages",
      today_dashed: "date/get_dashed_date"
    })
  },
  data() {
    return {
      save_dialog: false,
      inform_dialog_done: false,
      selectedDate: "",
      record_datetime: "",
      quantity: 0,
      client: Object,
      product: Object,
      storage: Object
    };
  },
  methods: {
    dateSelected(date) {
      this.selectedDate = date;
    },
    ...mapMutations({
      load_returned_data: "returned/load_returned_data"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    async refresh() {
      const { data } = await returnedRepository.get();
      this.load_returned_data(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_dialog = false;
        let formatted = {
          client_ID: this.client.client_ID,
          storage_ID: this.storage.storage_ID,
          product_ID: this.product.product_ID,
          updated_datetime: this.today_dashed,
          record_datetime: this.selectedDate,
          quantity: this.quantity,
          inout_type_ID: 3,
          note: "some",
          record_ID: this.edit_object.record_ID
        };
        returnedRepository.update(formatted);
        this.close();
      } else {
        this.save_dialog = false;
      }
      setTimeout(() => {
        this.refresh();
      }, 1000);
    }
  }
};
</script>
