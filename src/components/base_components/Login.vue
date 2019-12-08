<template lang="pug">
v-app#inspire
  v-content
    v-container(fluid fill-height)
      v-layout(align-center justify-center)
        v-flex(xs12 sm8 md4)
          v-card.elevation-20
            v-toolbar(dark color='primary')
              v-toolbar-title Склад
            v-card-text
              v-form
                v-text-field(
                  prepend-icon='person' 
                  name='login' 
                  label='Login' 
                  type='text'
                  v-model="login" 
                  @keyup.enter.native="loginButtonClicked"
                  :rules="nameRules"
                  required)
                v-text-field#password(
                  prepend-icon='lock' 
                  name='password' 
                  label='Password' 
                  type='password'
                  :rules="nameRules" 
                  @keyup.enter.native="loginButtonClicked"
                  v-model="password"
                  required)
            v-card-actions
              span.pl-2.error_message(v-if="error_occured") {{error_message}}
              v-spacer
              v-btn(
                color='primary' 
                :disabled="invalid_fields"
                @click="loginButtonClicked") Login                 
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";
import RepositoryFactory from "../../services/RepositoryFactory";
const storagesRepository = RepositoryFactory.get("storages");
export default {
  name: "Login",
  data() {
    return {
      login: String(),
      password: String(),
      nameRules: [v => !!v || "Name is required"],
      invalid_fields: true,
      error_occured: false,
      error_message: "error",
      token: String()
    };
  },
  watch: {
    login() {
      if (this.login !== "" && this.password !== "")
        this.invalid_fields = false;
      else this.invalid_fields = true;
    },
    password() {
      if (this.login !== "" && this.password !== "")
        this.invalid_fields = false;
      else this.invalid_fields = true;
    }
  },
  methods: {
    ...mapMutations({
      load_user_logging_status: "logged_user/load_user_status",
      load_user_token: "logged_user/load_user_token",
      load_user_role: "logged_user/load_user_role",
      load_username: "logged_user/load_username",
      load_user_ID: "logged_user/load_user_ID",
      load_storages: "storages/load_storages"
    }),
    set_error_message(message) {
      this.error_message = message;
      this.error_occured = true;
    },
    set_credentials(object) {
      this.load_user_logging_status(true);
      this.load_user_token(object.token);
      this.load_user_role(object.role);
      this.load_username(object.username);
      this.load_user_ID(object.user_ID);
      sessionStorage.setItem("sklad-user-token", object.token);
      axios.defaults.headers.common.Authorization = "Bearer " + object.token;
      this.logic(object);
      this.$router.push("/");
    },
    async getRegionalStorages(user_ID) {
      const { data } = await storagesRepository.get_regional_storages(user_ID);
      return data;
    },
    async getStorage(user_ID) {
      const { data } = await storagesRepository.get_single(user_ID);
      var array = [data];
      return array;
    },
    logic(result) {
      if (result.role === "Завсклад") {
        let storage = this.getStorage(result.user_ID);
        storage.then(stor => {
          this.load_storages(stor);
        });
      } else if (result.role === "Управляющий"|| result.role === "Офис-Ташкент") {
        let storage = this.getRegionalStorages(result.user_ID);
        storage.then(stor => {
          this.load_storages(stor);
        });
      }
    },

    loginButtonClicked() {
      if (this.login !== "" && this.password !== "") {
        axios({
          url: process.env.VUE_APP_API+"/login",
          data: {
            username: this.login,
            password: this.password
          },
          method: "POST"
        })
          .then(
            function(response) {
              if (response.data.message === "password did not match") {
                this.set_error_message(response.data.message);
              } else if (response.data.message === "user not found") {
                this.set_error_message(response.data.message);
              } else {
                this.set_credentials(response.data);
                this.error_occured = false;
              }
            }.bind(this)
          )
          .catch(function(response) {
            return response;
            // console.log(response);
          })
          .finally(function() {});
      }
    }
  }
};
</script>

<style>
.error_message {
  color: red;
}
</style>