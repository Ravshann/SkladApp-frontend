<template>
  <div id="app">
    <router-view @authenticated="setAuthenticated"/>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  data() {
    return {
      authenticated: false,
      mockAccount: {
        login: "manadmin",
        password: "manadmin"
      }
    };
  },
  mounted() {
    // if (!this.authenticated) {
    //   this.$router.replace({ name: "login" });
    // }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      this.authenticated = false;
    }
  }
};
</script>

<style>
</style>

