<template>
  <download-excel :data="json_data" worksheet="My Worksheet" name="filename.xls">
    <v-btn color="#00897B" dark @click="excel_dialog = true">Скачать</v-btn>
  </download-excel>
</template>
<script>
export default {
  name: "excel-generator",
  props: {
    json_data: Array
  },
  data: function() {
    return {
      excel_dialog: false
    };
  }
};
</script>
<style scoped>
</style>
