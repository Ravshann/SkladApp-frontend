<template lang="pug">
div
  v-dialog(v-model='show' max-width='500px' scrollable persistent)
    v-card
      v-card-title.title(font-weight-bold) {{product.product_name}}
      v-card-text
        v-layout(fill-height justify-space-between column)
          template(v-for="item in product.attributes")
            span.text-xs-left {{item.attribute_name}}: {{item.attribute_value}} 
      v-card-actions
        v-btn(color='primary' flat @click='close') ЗАКРЫТЬ
</template>
<script>
export default {
  name: "attributes-dialog",
  props: {
    product: Object,
    show: Boolean 
  },
  methods: {
    close() {
      this.$emit("close-attributes-dialog");
    }
  },
};
</script>