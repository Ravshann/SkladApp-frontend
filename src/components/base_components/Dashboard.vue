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
        v-if="index===5 && user_access_level!==0"
        :prepend-icon="section.icon"
        dense)
        template(v-slot:activator)
          v-list-tile
            v-list-tile-title.main_sections_font_size {{section.title}}
        v-list-tile(
          v-for="(product_section, inner_index) in product_sections" :key="inner_index"
          :to="product_section.link == '#' ? '' : product_section.link" 
          class="white--text"
          active-class="black")
          v-list-tile-action(:class='{"pl-2": !mini}')
            v-icon {{product_section.icon}}
          v-list-tile-content
            v-list-tile-title {{product_section.title}}
      v-list-group( 
        v-else-if="index===6 && user_access_level!==0"
        :prepend-icon="section.icon"
        dense)
        template(v-slot:activator)
          v-list-tile
            v-list-tile-title.main_sections_font_size {{section.title}}
        v-list-tile(
          v-for="(department_sections, inner_index) in department_sections" :key="inner_index"
          :to="department_sections.link == '#' ? '' : department_sections.link" 
          class="white--text"
          active-class="black")
          v-list-tile-action(:class='{"pl-2": !mini}')
            v-icon {{department_sections.icon}}
          v-list-tile-content
            v-list-tile-title {{department_sections.title}}      
      v-list-tile(
        v-else
        :to="section.link == '#' ? '' : section.link" 
        :class="[index===0 ? 'toolbar__item': '']"
        class="white--text"
        active-class="black")
        v-list-tile-action.left_pad
          v-icon {{section.icon}}
        v-list-tile-content
          v-list-tile-title.main_sections_font_size {{section.title}} 
  v-toolbar.elevation-1(color='white' dark app)
    v-toolbar-side-icon.hamburger-icon(icon @click.stop='toggleDrawer' light)
    v-spacer
    v-btn(outline round  color="green") {{user_role}}
    v-btn(outline round  color="primary") {{username}}
    router-link.log-out(tag='a' :to="{ name: 'login'}" replace)
      i.fas.fa-sign-out-alt(@click="log_out")
  router-view
  loader
</template>
<script>
import loader from "./Loader";
import { mapMutations, mapGetters } from "vuex";
function isMobile() {
  return window.innerWidth < 1025;
}
export default {
  name: "dashboard",
  components: {
    loader
  },
  computed: {
    ...mapGetters({
      username: "logged_user/get_username",
      user_role: "logged_user/get_user_role",
      user_ID: "logged_user/get_user_ID"
    })
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.set_access_level();
    this.set_sections();
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    ...mapMutations({
      load_user_logging_status: "logged_user/load_user_status",
      load_user_token: "logged_user/load_user_token",
      load_user_role: "logged_user/load_user_role",
      load_username: "logged_user/load_username",
      load_user_ID: "logged_user/load_user_ID"
    }),

    log_out() {
      sessionStorage.removeItem("sklad-user-token");
      
      this.load_user_token("");
      this.load_user_role("");
      this.load_username("");
      this.load_user_ID(-1);
      let self = this;
      setTimeout(() => {
        this.load_user_logging_status(false);
        self.$router.go("/login");
      }, 2000);
    },
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
    },
    set_access_level() {
      if (this.user_role === "admin") {
        this.user_access_level = 2;
      } else if (
        this.user_role === "Офис" ||
        this.user_role === "Наблюдатель"
      ) {
        this.user_access_level = 1;
      } else if (
        this.user_role === "Управляющий" ||
        this.user_role === "Завсклад"
      ) {
        this.user_access_level = 0;
      }
    },
    set_sections() {
      if (this.user_access_level === 0)
        this.sections = [...this.basic_sections, this.clients_section];
      else if (this.user_access_level === 1)
        this.sections = [
          ...this.basic_sections,
          this.exchange_section,
          this.product_sections[0],
          this.department_sections[0],
          this.admin_sections[0]
        ];
      else if (this.user_access_level === 2 || this.user_access_level === 1)
        this.sections = [
          ...this.basic_sections,
          this.exchange_section,
          this.product_sections[0],
          this.department_sections[0],
          ...this.admin_sections
        ];
    }
  },

  data() {
    const mobile = isMobile();
    return {
      temporary: mobile,
      drawer: true,
      mini: false,
      user_access_level: 0,
      clients_section: {
        title: "Клиенты",
        icon: "$vuetify.icons.clients",
        link: "/clients"
      },
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
      admin_sections: [
        {
          title: "Пользователи",
          icon: "$vuetify.icons.manager_users_icon",
          link: "/users"
        },
        {
          title: "Компании",
          icon: "domain",
          link: "/companies"
        }
      ],
      basic_sections: [
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
          title: "Возвраты/Дефектные",
          icon: "$vuetify.icons.defects",
          link: "/returned"
        }
        // {
        //   title: "Дефектные",
        //   icon: "$vuetify.icons.defects",
        //   link: "/defected"
        // }
      ],
      sections: [],
      exchange_section: {
        title: "Перемещении",
        icon: "$vuetify.icons.movement",
        link: "/exchange"
      }
    };
  }
};
</script>
<style scoped>
.toolbar__item {
  margin-top: 60px;
}
.inner_section_item {
  margin-left: 56px;
}
.main_sections_font_size {
  font-size: 1.15em;
}

.left_pad {
  padding-left: 2px;
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
