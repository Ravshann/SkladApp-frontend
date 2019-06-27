<template lang="pug">
v-dialog(v-model='inform_dialog_done' max-width='290')
  v-card
    v-card-title.headline changes saved
    v-card-text all changes are saved.
    v-card-actions
      v-spacer
      v-btn(color='green darken-1' flat='flat' @click='inform_dialog_done=false') ok
</template>
<script>
export default {
  name: "inform-dialog-done",
  data() {
    return {
      inform_dialog_done: false
    };
  },
  props: {
    dialog: Boolean
  },
  watch: {
    dialog() {
      this.inform_dialog_done = this.dialog;
    }
  },
  methods: {
    close() {
      this.$emit("done-dialog-closed", false);
    }
  }
};
</script>
