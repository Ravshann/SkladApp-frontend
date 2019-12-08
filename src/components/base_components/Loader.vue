<template lang="pug">
div
</template>
<script>
import RepositoryFactory from "../../services/RepositoryFactory";
const productsRepository = RepositoryFactory.get("products");
const storagesRepository = RepositoryFactory.get("storages");
const categoriesRepository = RepositoryFactory.get("categories");
const suppliersRepository = RepositoryFactory.get("suppliers");
const clientsRepository = RepositoryFactory.get("clients");
const attributesRepository = RepositoryFactory.get("attributes");
const rolesRepository = RepositoryFactory.get("roles");
const companiesRepository = RepositoryFactory.get("companies");
const departmentsRepository = RepositoryFactory.get("departments");
const departmentManagersRepository = RepositoryFactory.get(
  "department_managers"
);
const storageManagersRepository = RepositoryFactory.get("storage_managers");
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "loader-component",
  computed: {
    ...mapGetters({
      user_role: "logged_user/get_user_role",
      user_ID: "logged_user/get_user_ID"
    })
  },
  created() {
    this.getDate();
    this.getProducts();

    if (this.user_role !== "Завсклад" && this.user_role !== "Управляющий")
      this.getStorages();
    this.getAllOtherStorages();
    this.getCategories();
    this.getSuppliers();
    this.getClients();
    this.getAttributes();
    this.getRoles();
    this.getCompanies();
    this.getDepartments();
    this.getDepartmentManagers();
    this.getStorageManagers();
    this.getDefectedStorages();
  },
  methods: {
    ...mapMutations({
      load_products: "products/load_products",
      load_storages: "storages/load_storages",
      load_defected_storages: "storages/load_defected_storages",
      load_categories: "categories/load_categories",
      load_suppliers: "suppliers/load_suppliers",
      load_clients: "clients/load_clients",
      load_attributes: "attributes/load_attributes",
      load_roles: "roles/load_roles",
      load_companies: "companies/load_companies",
      load_departments: "departments/load_departments",
      load_department_managers: "department_managers/load_department_managers",
      load_storage_managers: "storage_managers/load_storage_managers",
      load_date: "date/load_date",
      load_dashed_date: "date/load_dashed_date",
      load_first_day: "date/load_first_day",
      load_other_storages: "storages/load_other_storages"
    }),
    async getAttributes() {
      const { data } = await attributesRepository.get();
      this.load_attributes(data);
    },
    async getDepartments() {
      const { data } = await departmentsRepository.get();
      this.load_departments(data);
    },
    async getDepartmentManagers() {
      const { data } = await departmentManagersRepository.get();
      this.load_department_managers(data);
    },
    async getStorageManagers() {
      const { data } = await storageManagersRepository.get();
      this.load_storage_managers(data);
    },
    async getCompanies() {
      const { data } = await companiesRepository.get();
      this.load_companies(data);
    },
    async getRoles() {
      const { data } = await rolesRepository.get();
      this.load_roles(data);
    },
    async getSuppliers() {
      const { data } = await suppliersRepository.get();
      this.load_suppliers(data);
    },
    async getClients() {
      const { data } = await clientsRepository.get();
      this.load_clients(data);
    },
    async getCategories() {
      const { data } = await categoriesRepository.get();
      this.load_categories(data);
    },
    async getProducts() {
      const { data } = await productsRepository.get();
      this.load_products(data);
    },
    async getStorages() {
      const { data } = await storagesRepository.get();
      this.load_storages(data);
    },
    async getDefectedStorages() {
      const { data } = await storagesRepository.get_defected_storage();
      this.load_defected_storages(data);
    },
    async getStorage(user_ID) {
      const { data } = await storagesRepository.get_single(user_ID);
      var array = [data];
      this.load_storages(array);
    },
    async getAllOtherStorages() {
      const { data } = await storagesRepository.get();
      this.load_other_storages(data);
    },

    getDate: function() {
      var cur_date_vue = new Date();
      var month = ("0" + (cur_date_vue.getMonth() + 1)).slice(-2);
      var date = ("0" + cur_date_vue.getDate()).slice(-2);
      var year = cur_date_vue.getFullYear();
      var date_formatted = year + "/" + month + "/" + date;
      var first_day_in_month = year + "-" + month + "-" + "01";
      this.load_date(date_formatted);
      let dashed = year + "-" + month + "-" + date;
      this.load_dashed_date(dashed);
      this.load_first_day(first_day_in_month);
    }
  }
};
</script>
