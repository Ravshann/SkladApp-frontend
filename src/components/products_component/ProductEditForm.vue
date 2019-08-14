<template lang="pug">
v-content
  v-dialog(v-model='appear' max-width='800px' persistent  transition='dialog-bottom-transition' scrollable)
    v-card(title)
      v-toolbar(card dark color='primary')
        v-btn(icon dark @click='close' title='отменить')
          v-icon close
        v-toolbar-title Изменить данные
        v-spacer
        v-toolbar-items
          v-btn(dark flat @click='save_records = true') Сохранить
        save-changes-dialog(:save_records="save_records" @save-changes-dialog-event="saveChanges")
        inform-dialog-done(:dialog="inform_dialog_done" @done-dialog-closed="inform_dialog_done=false")
      v-card-text
        v-tabs(
          color="white"
          white
          slider-color="blue")
          v-tab(
            v-for="n in 3"
            :key="n"
            ripple) {{ tab_headers[n-1] }}  
          v-tab-item
            v-text-field(v-model='product_name' label='Наименование товара' prepend-icon='assignment' placeholder='Наименование товара')
            v-autocomplete(
              v-model='category' 
              :items="category_list" 
              label='Категории' 
              prepend-icon='style'  
              persistent-hint 
              item-text='category_name'
              return-object)
          v-tab-item
            v-layout
              v-autocomplete(
                v-model='selected_attribute' 
                :items="attribute_list" 
                label='Параметры' 
                prepend-icon='settings_ethernet'  
                persistent-hint
                item-text='attribute_name'
                return-object)
              v-text-field(
                v-model='selected_attribute_value' 
                type="number"
                label='Значение' 
                prepend-icon='straighten' 
                placeholder='Значение')
              v-btn(
                color='indigo' 
                @click='addAttribute' 
                fab 
                dark  
                flat title='добавить') 
                v-icon(dark) add
            v-data-table.elevation-0.product-table(
              :headers='attribute_table_headers' 
              :items='current_attributes')
              template(v-slot:items='props')
                td.text-xs-left {{ props.item.attribute_name }}
                td.text-xs-left {{ props.item.attribute_value }}
                td.text-xs-left
                  span
                    v-icon(@click="deleteAttribute(props.item)" color='red') clear
                td.text-xs-left
                  span
                    v-icon(@click="updateAttribute(props.item)" color='blue') create  
                    edit-attribute-form(
                      v-if="edit" 
                      :edit_object="edit_attribute" 
                      :appear="edit" 
                      @edit-form-closed="valueUpdated")       
          v-tab-item  
            v-data-table.elevation-0.product-table(
              :headers='attribute_table_headers' 
              :items='added_attributes')
              template(v-slot:items='props')
                td.text-xs-left {{ props.item.attribute_name }}
                td.text-xs-left {{ props.item.attribute_value }}
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import RepositoryFactory from "../../services/RepositoryFactory";
const productsRepository = RepositoryFactory.get("products");
const productAttributeRepository = RepositoryFactory.get("product_attribute");
import EditAttributeForm from "./EditAttributeForm";
export default {
  name: "product-edit-form",
  components: {
    EditAttributeForm
  },
  props: {
    appear: Boolean,
    edit_object: Object
  },
  mounted() {
    this.category = this.edit_object.category;
    this.product_name = this.edit_object.product_name;
    this.product_ID = this.edit_object.product_ID;
    this.current_attributes = [...this.edit_object.attributes];
  },
  computed: {
    ...mapGetters({
      category_list: "categories/get_categories",
      attribute_list: "attributes/get_attributes"
    })
  },
  watch: {
    category() {
      if (this.edit_object.category.category_ID !== this.category.category_ID) {
        this.change_tracker.category_changed = true;
        this.change_tracker.overall_change = true;
      } else {
        this.change_tracker.category_changed = false;
      }
    },
    product_name() {
      if (this.edit_object.product_name !== this.product_name) {
        this.change_tracker.product_name_changed = true;
        this.change_tracker.overall_change = true;
      } else {
        this.change_tracker.product_name_changed = false;
      }
    }
  },
  data() {
    return {
      save_records: false,
      inform_dialog_done: false,

      attribute_table_headers: [
        {
          text: "Наименование параметра",
          sortable: false,
          value: "attribute_name"
        },
        { text: "Значение", sortable: false, value: "attribute_value" },
        { text: "", sortable: false },
        { text: "", sortable: false }
      ],
      tab_headers: [
        "Общая информация",
        "Параметры продукта",
        "Новые параметры"
      ],
      product_name: "",
      product_ID: "",

      change_tracker: {
        product_name_changed: false,
        category_changed: false,
        attribute_changed: false,
        overall_change: false
      },
      category: Object,
      current_attributes: [],
      added_attributes: [],
      updated_attributes: [],
      selected_attribute: Object,
      selected_attribute_value: "",
      deleted_attributes: [],
      edit: false,
      edit_attribute: Object
    };
  },
  methods: {
    ...mapMutations({
      load_products: "products/load_products"
    }),
    close() {
      this.$emit("edit-form-closed", false);
    },
    addAttribute() {
      if (this.attributeExists() === false) {
        let new_attr = Object.assign({}, this.selected_attribute);
        new_attr.attribute_value = this.selected_attribute_value;
        this.added_attributes.push(new_attr);
        this.change_tracker.overall_change = true;
        this.change_tracker.attribute_changed = true;
      }
      this.selected_attribute = "";
      this.selected_attribute_value = "";
    },
    attributeExists() {
      let exists = false;
      let self = this;
      this.current_attributes.forEach(function(item) {
        if (item.attribute_ID === self.selected_attribute.attribute_ID) {
          exists = true;
        }
      });
      return exists;
    },
    deleteAttribute(object) {
      this.deleted_attributes.push(object);
      let self = this;
      this.current_attributes.forEach(function(item, index) {
        if (item.attribute_ID === object.attribute_ID) {
          self.current_attributes.splice(index, 1);
        }
      });
      this.change_tracker.overall_change = true;
      this.change_tracker.attribute_changed = true;
    },
    valueUpdated(object) {
      if (object.changed) {
        this.updated_attributes.push(object);
        this.change_tracker.overall_change = true;
        this.change_tracker.attribute_changed = true;
        let self = this;
        this.current_attributes.forEach(function(item, index) {
          if (item.attribute_ID === object.attribute.attribute_ID) {
            self.current_attributes[index].attribute_value =
              object.attribute_value;
          }
        });
      }
      this.edit = false;
    },
    updateAttribute(object) {
      this.edit_attribute = object;
      this.edit = true;
    },
    async refresh() {
      const { data } = await productsRepository.get();
      this.load_products(data);
    },
    saveChanges(choice) {
      if (choice) {
        this.inform_dialog_done = true;
        this.save_records = false;
        if (this.change_tracker.overall_change) {
          if (
            this.change_tracker.product_name_changed ||
            this.change_tracker.category_changed
          ) {
            let formatted = {
              product_name: this.product_name,
              category_ID: this.category.category_ID
            };
            productsRepository.update(this.product_ID, formatted);
          }
          if (this.change_tracker.attribute_changed) {
            if (this.added_attributes.length !== 0) {
              let new_relationships = [];
              for (let i = 0; i < this.added_attributes.length; i++) {
                let formatted = {
                  product_ID: this.product_ID,
                  attribute_ID: this.added_attributes[i].attribute_ID,
                  attribute_value: this.added_attributes[i].attribute_value
                };
                new_relationships.push(formatted);
              }

              productAttributeRepository.save(new_relationships);
            }
            if (this.updated_attributes.length !== 0) {
              let updated = [];
              for (let i = 0; i < this.updated_attributes.length; i++) {
                let formatted = {
                  product_ID: this.product_ID,
                  attribute_ID: this.updated_attributes[i].attribute
                    .attribute_ID,
                  attribute_value: this.updated_attributes[i].attribute_value
                };
                updated.push(formatted);
              }
              productAttributeRepository.update(updated);
            }
            if (this.deleted_attributes.length !== 0) {
              let deleted_relationships = [];
              for (let i = 0; i < this.deleted_attributes.length; i++) {
                let formatted = {
                  product_ID: this.product_ID,
                  attribute_ID: this.deleted_attributes[i].attribute_ID
                };
                deleted_relationships.push(formatted);
              }
              productAttributeRepository.delete(deleted_relationships);
            }
          }
        }

        this.close();
      } else {
        this.save_records = false;
      }
      let self = this;
      setTimeout(function() {
        self.refresh();
      }, 1000);
    }
  }
};
</script>
<style scoped>
.product-table {
  border: 1px solid #bdbdbd;
  padding: 3px;
  margin: 7px;
  box-shadow: #157c5d 10px;
}
</style>