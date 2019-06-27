<template lang="pug">
v-dialog(v-model='save_records' max-width='290')
  v-card
    v-card-title.headline save changes?
    v-card-text all changes will be saved.
    v-card-actions
      v-spacer
      v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(true)') continue
      v-btn(color='green darken-1' flat='flat' @click.prevent='saveChanges(false)') cancel
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
