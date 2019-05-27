<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="nav_drawer lighten"
      v-model="drawer"
      :mini-variant="mini"
      fixed
      app
      width="235"
    >
      <v-list dark>
        <v-list-tile @click="" class="toolbar__item">
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
        <v-list-tile @click="">
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
        <v-list-tile @click="">
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
        <v-list-tile @click="">
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
        <v-list-tile @click="">
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
        <v-list-tile @click="">
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
        <v-list-tile @click="">
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
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" dark fixed app>
      <v-toolbar-side-icon icon @click.stop="mini = !mini" class="hamburger-icon" light ></v-toolbar-side-icon>
      <button class="button button__in"><i class="fas fa-long-arrow-alt-up"></i>  Расход</button>
      <button class="button button__out"><i class="fas fa-long-arrow-alt-down"></i> Приход</button>
      <v-spacer></v-spacer>
      <a href="#" class="staff">Зав-Склад</a>
      <a href="#" class="staff">Нодир</a>
      
      <router-link tag="a"  :to="{ name: 'login'}" class="log-out" replace>
        <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </v-toolbar>
    <v-content>
        <h2 class="page-title">Остаток по 29.03.2019</h2>
        <div class="search-block clearfix">
            <div class="search-block__left">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search ..."
                  single-line
                  hide-details
                >
                </v-text-field>
            </div>
            <div class="search-block__right clearfix">
                <button class="button search-filter"><i class="fas fa-sort-amount-down"></i> Фильтр с</button>
                <button class="button search-download"><i class="far fa-file-excel"></i> Скачать</button>
            </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1 product-table"
        >
            <template slot="headerCell" slot-scope="props">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    {{ props.header.text }}
                  </span>
                </template>
                <span>
                  {{ props.header.text }}
                </span>
              </v-tooltip>
            </template>
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.calories }}</td>
              <td class="text-xs-center">{{ props.item.fat }}</td>
              <td class="text-xs-center">{{ props.item.carbs }}</td>
              <td class="text-xs-center">{{ props.item.protein }}</td>
              <td class="text-xs-center">{{ props.item.iron }}</td>
            </template>
        </v-data-table>
    </v-content>
</v-app>
</template>

<script>

  export default {
    name: 'Remainder',
    data: () => ({
      search: '',
      drawer: null,
      mini: false,
      headers: [
          {
            text: 'No',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Товар', value: 'calories' },
          { text: 'Общ.Кол-во', value: 'fat' },
          { text: 'Склад', value: 'carbs' },
          { text: 'Количество', value: 'protein' },
          { text: '', value: 'iron' }
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%'
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%'
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%'
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%'
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%'
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%'
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%'
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%'
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%'
          }
        ]
    })
  }
</script>

<style>
  .main-drawer{
    width: 250px;
    background: black;
  }

  .toolbar__item{
    margin-top: 80px;
  }


  .button__in{
    background:#3f9b6c;
  }

  .button__in:hover{
    background:#157c5d;
    transition: background .9s ease;
  }

  .button__out{
    background:#369baa;
    margin-left: 10px;
  }

  .button__out:hover{
    background:#158399;
    transition: background .9s ease;
  }

  .staff{
    color:#000000;
    font-size: 15px;
    margin-right: 15px;
  }

  .log-out{
    color: #000000;
    text-decoration: none;
    font-size: 21px;
  }

  .page-title{
    text-align: center;
    margin-top: 25px;
  }

  .clearfix::after{
    content: " ";
    display: table;
    clear: both;
  }

  .search-block{
    padding: 15px;
    margin: 20px;
  }

  .search-input::after{
    color: inherit;
    content: attr(data-icon);
    font-family: 'FontAwesome';
    font-style: normal;
  }

  .search-block__left{
    max-width:400px;
    float: left;
  }

  .search-block__right{
    max-width:400px;
    float: right;
  }


  .button{
    width: 85px;
    min-height: 30px;
    border-radius: 5px;
  }

  .search-filter{
    margin-right: 15px;
    background: #9e48db;
    color: #fff;
    padding:0 3px;
  }

  .search-filter:hover{
    background: #96308c;
    transition: background .9s ease;
  }

  .search-download{
    margin-right: 0;
    background: #238765;
    color: #fff;
  }

  .search-download:hover{
    background: #28632d;
    transition: background .9s ease;
  }

  .product-table{
    border: 1px solid #728184;
    padding: 3px;
    margin: 7px;
    box-shadow: #157c5d 10px; 
  }

  
  
</style>
