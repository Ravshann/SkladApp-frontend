<template lang="pug">
div
</template>
<script>
import RepositoryFactory from "../services/RepositoryFactory";
const productsRepository = RepositoryFactory.get("products");
const storagesRepository = RepositoryFactory.get("storages");
const suppliersRepository = RepositoryFactory.get("suppliers");
const clientsRepository = RepositoryFactory.get("clients");
import { mapMutations } from "vuex";
export default {
  name: "loader-component",
  created() {
    this.getSuppliers();
    this.getClients();
    this.getProducts();
    this.getStorages();
  },
  methods: {
    ...mapMutations({
      load_suppliers: "suppliers/load_suppliers",
      load_clients: "clients/load_clients",
      load_products: "products/load_products",
      load_storages: "storages/load_storages"
    }),
    async getSuppliers() {
      const { data } = await suppliersRepository.get();
      this.load_suppliers(data);
    },
    async getClients() {
      const { data } = await clientsRepository.get();
      this.load_clients(data);
    },
    async getProducts() {
      const { data } = await productsRepository.get();
      this.load_products(data);
    },
    async getStorages() {
      const { data } = await storagesRepository.get();
      this.load_storages(data);
    }
  }
};
</script>
