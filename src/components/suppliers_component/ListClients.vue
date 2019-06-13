<template lang="pug">
v-content(v-if='!isLoading')
  v-layout(row wrap)
    v-list(v-for="item in clients" two-line).card
      v-list-tile(@click="") 
        v-list-tile-content
          v-list-tile-title {{item.client_name}}
          v-list-tile-sub-title {{item.region}}
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("clients");

import { mapGetters, mapMutations } from "vuex";

export default {
  name: "list-clients",
  props: {
    search: ""
  },
  computed: {
    ...mapGetters({
      clients: "clients/get_clients"
    })
  },
  created() {
    if (this.clients.length === 0) this.getData();
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    ...mapMutations({
      load_clients: "clients/load_clients"
    }),
    async getData() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.load_clients(data);
    }
  }
};
</script>
<style scoped>
.card {
  border: 1px solid #bdbdbd;
  padding: 0px;
  margin: 7px;
  max-width: 300px;
}
</style>
