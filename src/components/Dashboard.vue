<template lang="pug">
v-app.white
  v-navigation-drawer.nav_drawer.lighten(v-model='drawer' :mini-variant='mini' fixed='' app='' width='235')
    v-list(dark='' v-for="(section, index) in sections" :key="index")
      v-list-tile(
        :to="section.link == '#' ? '' : section.link" 
        :class="[index===0 ? 'toolbar__item': '']"
        class="white--text"
        active-class="black")
        v-list-tile-action
          v-icon {{section.icon}}
        v-list-tile-content
          v-list-tile-title {{section.title}}
        v-list-tile-action
          v-icon arrow_forward_ios
  v-toolbar.elevation-1(color='white' dark='' fixed='' app='')
    v-toolbar-side-icon.hamburger-icon(icon='' @click.stop='mini = !mini' light='')
    v-spacer
    a.staff(href='#') Зав-Склад
    a.staff(href='#') Нодир
    router-link.log-out(tag='a' :to="{ name: 'login'}" replace='')
      i.fas.fa-sign-out-alt
  loader
  router-view
  
</template>
<script>
import loader from "./Loader"
export default {
  name: "dashboard",
  components: {
    loader
  },
  data: function() {
    return {
      drawer: null,
      mini: false,
      first: true,
      selected_view: "Остаток",
      sections: [
        {
          title: "Остаток",
          icon: "view_list",
          link: "/"
        },
        {
          title: "Расходы",
          icon: "$vuetify.icons.export",
          link: "/outgoing"
        },
        {
          title: "Приходы",
          icon: "$vuetify.icons.import",
          link: "/incoming"
        },
        {
          title: "Возвраты",
          icon: "$vuetify.icons.return",
          link: "/returned"
        },
        {
          title: "Дефектные",
          icon: "$vuetify.icons.defects",
          link: "/defected"
        },
        {
          title: "Клиенты",
          icon: "$vuetify.icons.clients",
          link: "/clients"
        },
        {
          title: "Товары",
          icon: "$vuetify.icons.goods",
          link: "/products"
        },
        {
          title: "Поставщики",
          icon: "local_shipping",
          link: "/suppliers"
        },
         {
          title: "Склады",
          icon: "home",
          link: "/storages"
        }
      ]
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
