<template lang="pug">
v-app(id="inspire" white)
  v-navigation-drawer.nav_drawer.lighten(
    v-model='drawer' 
    persistent
    :mini-variant='mini'
    :temporary="temporary" 
    app
    width='250')
    v-list(dark v-for="(section, index) in sections" :key="index" dense)
      v-list-group( 
        v-if="index===8"
        :prepend-icon="section.icon"
        dense)
        template(v-slot:activator)
          v-list-tile
            v-list-tile-title.main_sections_font {{section.title}}
        v-list-tile(
          v-for="(product_section, inner_index) in product_sections" :key="inner_index"
          :to="product_section.link == '#' ? '' : product_section.link" 
          class="white--text"
          active-class="black")
          v-list-tile-action.pl-2
            v-icon {{product_section.icon}}
          v-list-tile-content
            v-list-tile-title {{product_section.title}}
      v-list-group( 
        v-else-if="index===7"
        :prepend-icon="section.icon"
        dense)
        template(v-slot:activator)
          v-list-tile
            v-list-tile-title.main_sections_font {{section.title}}
        v-list-tile(
          v-for="(department_sections, inner_index) in department_sections" :key="inner_index"
          :to="department_sections.link == '#' ? '' : department_sections.link" 
          class="white--text"
          active-class="black")
          v-list-tile-action.pl-2
            v-icon {{department_sections.icon}}
          v-list-tile-content
            v-list-tile-title {{department_sections.title}}      
      v-list-tile(
        v-else
        :to="section.link == '#' ? '' : section.link" 
        :class="[index===0 ? 'toolbar__item': '']"
        class="white--text"
        active-class="black")
        v-list-tile-action
          v-icon {{section.icon}}
        v-list-tile-content
          v-list-tile-title.main_sections_font {{section.title}} 
  v-toolbar.elevation-1(color='white' dark app)
    v-toolbar-side-icon.hamburger-icon(icon @click.stop='toggleDrawer' light)
    v-spacer
    a.staff(href='#') Зав-Склад
    a.staff(href='#') Нодир
    router-link.log-out(tag='a' :to="{ name: 'login'}" replace)
      i.fas.fa-sign-out-alt
  loader
  router-view
  
</template>
<script>
import loader from "./Loader";
function isMobile() {
  return window.innerWidth < 1025;
}
export default {
  name: "dashboard",
  components: {
    loader
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    toggleDrawer() {
      let mobile = isMobile();
      if (mobile) {
        this.drawer = !this.drawer;
        this.mini = false;
      } else {
        this.drawer = true;
        this.mini = !this.mini;
      }
    },
    onResize() {
      const mobile = isMobile();

      if (mobile) {
        if (this.drawer && this.mini) {
          this.drawer = false;
        }
        this.mini = false;
      } else {
        if (!this.drawer) {
          this.mini = true;
        }
        this.drawer = true;
      }
      this.temporary = mobile;
    }
  },
  data() {
    const mobile = isMobile();
    return {
      temporary: mobile,
      drawer: true,
      mini: false,
      first: true,
      selected_view: "Остаток",
      product_sections: [
        {
          title: "Товары",
          icon: "$vuetify.icons.goods",
          link: "/products"
        },
        {
          title: "Категории",
          icon: "style",
          link: "/categories"
        },
        {
          title: "Параметры",
          icon: "settings_ethernet",
          link: "/attributes"
        }
      ],
      department_sections: [
        {
          title: "Отделы",
          icon: "layers",
          link: "/departments"
        },
        {
          title: "Клиенты",
          icon: "$vuetify.icons.clients",
          link: "/clients"
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
      ],
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
          title: "Компании",
          icon: "domain",
          link: "/companies"
        },

        {
          title: "Пользователи",
          icon: "$vuetify.icons.manager_users_icon",
          link: "/users"
        },
        {
          title: "Отделы",
          icon: "layers",
          link: "/departments"
        },
        {
          title: "Товары",
          icon: "$vuetify.icons.goods",
          link: "/products"
        }
      ]
    };
  }
};
</script>
<style scoped>
.toolbar__item {
  margin-top: 56px;
}
.inner_section_item {
  margin-left: 56px;
}
.main_sections_font {
  font-size: 1.15em;
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
