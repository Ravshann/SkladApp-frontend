<template>
  <v-app class="white">
    <v-navigation-drawer
      class="nav_drawer lighten"
      v-model="drawer"
      :mini-variant="mini"
      fixed
      app
      width="235"
    >
      <v-list dark>
        <v-list-tile class="toolbar__item">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Остаток</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.export'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Расходы</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.import'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Приходы</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.return'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Возвраты</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.defects'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Деффектные</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.clients'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Клиенты</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.goods'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Товары</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>local_shipping</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Поставщики</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-text="'$vuetify.icons.right_arrow'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" dark fixed app>
      <v-toolbar-side-icon icon @click.stop="mini = !mini" class="hamburger-icon" light></v-toolbar-side-icon>

      <v-spacer></v-spacer>
      <a href="#" class="staff">Зав-Склад</a>
      <a href="#" class="staff">Нодир</a>

      <router-link tag="a" :to="{ name: 'login'}" class="log-out" replace>
        <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </v-toolbar>

    <remainder/>
    <!-- <realdate1/> -->
  </v-app>
</template>
<script>
import remainder from "./remainder_component/Remainder";
import realdate1 from "./Realdate1";
export default {
  name: "dashboard",
  components: {
    remainder,
    realdate1
  },
  data: function() {
    return {
      drawer: null,
      mini: false
    };
  }
};
</script>
<style scoped>
.toolbar__item {
  margin-top: 80px;
}

.staff {
  color: #000000;
  font-size: 15px;
  margin-right: 15px;
}

.log-out {
  color: #000000;
  text-decoration: none;
  font-size: 21px;
}
</style>
