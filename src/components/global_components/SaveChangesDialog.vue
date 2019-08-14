<template lang="pug">
v-dialog(v-model='save_records' max-width='290')
  v-card
    v-card-title.headline Сохранить изменения?
    v-card-text Все изменения будут сохранены
    v-card-actions
      v-spacer
      v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') продолжить
      v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') отменa
</template>
<script>
export default {
  name: "save-changes-dailog",
  data() {
    return {
    //   save_records: true
    };
  },
  props:{
      save_records: Boolean
  },
  methods: {
    saveChanges(option) {
      this.$emit("save-changes-dialog-event", option);
    }
  }
};
</script>
