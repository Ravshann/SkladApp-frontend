<template>
    
    <div id="app">

      
      <router-view @authenticated="setAuthenticated" />
    </div> 
    
  
</template>

<script>
import Remainder from './components/Remainder'
import Login from './components/Login'
export default {
  name: 'App',
  components: {
    Remainder,
    Login
  },
  data () {
    return {
      authenticated: false,
                mockAccount: {
                    login: "manadmin",
                    password: "manadmin"
                }
    }
  },
  mounted() {
            if(!this.authenticated) {
                this.$router.replace({ name: "login" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            }
        }
 
}
</script>

<style>
  


</style>

