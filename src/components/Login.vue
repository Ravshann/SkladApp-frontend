<template lang="pug">
v-app#inspire
  v-content
    v-container(fluid='' fill-height='')
      v-layout(align-center='' justify-center='')
        v-flex(xs12='' sm8='' md4='')
          v-card.elevation-12
            v-toolbar(dark='' color='primary')
              v-toolbar-title &Scy;&kcy;&lcy;&acy;&dcy;
            v-card-text
              v-form
                v-text-field(prepend-icon='person' name='login' label='Login' type='text' required='')
                v-text-field#password(prepend-icon='lock' name='password' label='Password' type='password' required='')
            v-card-actions
              v-spacer
              v-btn(color='primary' :disabled='loading') Login

  //- <v-app id="inspire">
  //-   <v-content>
  //-     <v-container fluid fill-height>
  //-       <v-layout align-center justify-center>
  //-         <v-flex xs12 sm8 md4>
  //-           <v-card class="elevation-12">
  //-             <v-toolbar dark color="primary">
  //-               <v-toolbar-title>Склад</v-toolbar-title>
  //-             </v-toolbar>
  //-             <v-card-text>
  //-               <v-form>
  //-                 <v-text-field 
  //-                 prepend-icon="person" 
  //-                 name="login" 
  //-                 label="Login" 
  //-                 type="text" 
  //-                 required
  //-                 >
  //-                 </v-text-field>

  //-                 <v-text-field 
  //-                 id="password" 
  //-                 prepend-icon="lock" 
  //-                 name="password" 
  //-                 label="Password" 
  //-                 type="password" 
  //-                 required
  //-                 >
  //-                 </v-text-field>
  //-               </v-form>
  //-             </v-card-text>
  //-             <v-card-actions>
  //-               <v-spacer></v-spacer>
  //-               <v-btn color="primary" :disabled="loading">
  //-                 Login
  //-               </v-btn>
  //-             </v-card-actions>
  //-           </v-card>
  //-         </v-flex>
  //-       </v-layout>
  //-     </v-container>
  //-   </v-content>
  //- </v-app>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    //
  })
};
</script>

<style>
</style>