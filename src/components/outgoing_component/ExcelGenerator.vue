<template lang="pug">
download-excel(:data='json_data' worksheet='My Worksheet' name='filename.xls')
  //- v-btn(color='#00897B' dark='' @click='excel_dialog = true') &Scy;&kcy;&acy;&chcy;&acy;&tcy;&softcy;
  v-btn(fab dark flat color='#00897B' @click='excel_dialog = true' title="скачать excel")
    span
      v-icon {{"$vuetify.icons.excel_icon"}}
  //- <download-excel :data="json_data" worksheet="My Worksheet" name="filename.xls">
  //-   <v-btn color="#00897B" dark @click="excel_dialog = true">Скачать</v-btn>
  //- </download-excel>
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
