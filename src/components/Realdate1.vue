<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Остаток по {{format_date(date)}}</v-toolbar-title>
    </v-toolbar>

    <v-layout row>
      <v-text-field v-model="search" append-icon="search" label="Поиск..." single-line hide-details></v-text-field>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-btn color="#36BD9C" dark @click="dialog1 = true">Расход</v-btn>
      <v-btn color="primary" dark @click="dialog2 = true">Приход</v-btn>
      <v-btn color="#967ADC" dark @click="dialog3 = true">Сортировать</v-btn>
      <download-excel
        :data="excelData"
        :fields="json_fields"
        worksheet="My Worksheet"
        name="filename.xls"
      >
        <v-btn color="#00897B" dark @click="dialog4 = true">Скачать</v-btn>
      </download-excel>

      <v-dialog
        v-model="dialog1"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card title>
          <v-toolbar card dark color="#36BD9C">
            <v-btn icon dark @click="dialog1 = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Расход</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="dialog1 = false">Сохранить</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="date"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="К этой дате"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="ex_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(ex_date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
            <v-autocomplete
              v-model="ex_client_name"
              :items="clientdata"
              label="Получатель"
              prepend-icon="person"
              persistent-hint
              item-text="client_name"
            ></v-autocomplete>

            <v-autocomplete
              v-model="ex_product_name"
              :items="realdata"
              label="Наименование товара"
              prepend-icon="sort"
              persistent-hint
              item-text="product_name"
            ></v-autocomplete>

            <v-autocomplete
              v-model="ex_store_name"
              :items="realdata"
              label="Склад"
              prepend-icon="home"
              persistent-hint
              item-text="store_name"
            ></v-autocomplete>

            <v-text-field
              v-model="ex_quantity"
              name="ex_quantity"
              id="ex_quantity"
              label="Количество"
              prepend-icon="edit"
              :items="realdata"
              item-text="quantity"
              placeholder="0"
            ></v-text-field>

            <v-btn fab dark color="indigo" justify-center @click.prevent="add">
              <v-icon dark>add</v-icon>
            </v-btn>

            <v-data-table :headers="headers1" :items="tableData">
              <template v-slot:items="props">
                <td sortable="true">{{ props.item.number }}</td>
                <td class="text-xs-left">{{ props.item.ex_product_name }}</td>
                <td class="text-xs-left">{{ props.item.ex_quantity }}</td>
                <td class="text-xs-left">{{ props.item.ex_store_name }}</td>
                <td class="text-xs-left">{{ props.item.ex_client_name }}</td>
                <td class="text-xs-left">{{ props.item.ex_date }}</td>
              </template>
            </v-data-table>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card title>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog2 = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Приход</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="dialog2 = false">Добавить</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>Something</v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog3" max-width="500px" scrollable>
        <v-card>
          <v-card-title>Сортировать по</v-card-title>

          <v-card-text>
            <v-autocomplete
              v-model="search"
              :items="realdata"
              label="Наименование товара"
              persistent-hint
              item-text="product_name"
            ></v-autocomplete>

            <v-autocomplete
              v-model="search"
              :items="realdata"
              label="Kатегория"
              persistent-hint
              item-text="category"
            ></v-autocomplete>

            <v-autocomplete
              v-model="search"
              :items="realdata"
              label="Склад"
              persistent-hint
              item-text="store_name"
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click="close">ЗАКРЫТЬ</v-btn>
            <v-btn color="primary" @click="close">СОРТИРОВАТЬ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-data-table
      :headers="headers"
      :items="realdata"
      :search="search"
      :rows-per-page-items="[25,50]"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.product_name }}</td>
        <td class="text-xs-left" style="bold">{{ props.item.category }}</td>
        <td class="text-xs-left">{{ props.item.total_quantity }}</td>
        <td class="text-xs-left">{{ props.item.store_name }}</td>
        <td class="text-xs-left">{{ props.item.quantity }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "realdate1",
  data: () => ({
    // sortKey: 'category',
    // reverse: false,

    search: "",
    date_time: new Date().toISOString().substr(0, 10),
    menu: false,
    date: new Date().toISOString().substr(0, 10),
    dialog: false,
    dialog1: false,
    dialog2: false,
    dialog3: false,

    sortIndex: -1,
    sorteddata: [],

    editedIndex: -1,
    editedItem: {
      product_id: 0,
      product_name: "",
      category: "",
      total_quantity: 0,
      store_name: "",
      quantity: 0
    },
    defaultItem: {
      product_id: 0,
      product_name: "",
      category: "",
      total_quantity: 0,
      store_name: "",
      quantity: 0
    },

    headers: [
      {
        text: "Наименование товара",
        align: "left",
        sortable: false,
        value: "product_name"
      },
      { text: "Kатегория", value: "category" },
      { text: "Общ. кол-во", value: "total_quantity" },
      { text: "Склад", value: "store_name" },
      { text: "Количество", value: "quantity" }
    ],

    headers1: [
      {
        text: "N#",
        align: "left",
        sortable: false,
        value: "number"
      },
      {
        text: "Наименование товара",
        sortable: false,
        value: "product_name"
      },
      {
        text: "Количество",
        value: "quantity"
      },
      {
        text: "Склад",
        value: "store_name"
      },
      {
        text: "Получатель",
        value: "client_name"
      },
      {
        text: "Дата",
        value: "date"
      }
    ],
    realdata: [],
    clientdata: [],

    exportdata: [],
    nextBarId: 1,
    ex_client_region: "",
    ex_client_name: "",
    ex_product_name: "",
    ex_store_name: "",
    ex_quantity: "",
    ex_date: new Date().toISOString().substr(0, 10),

    json_fields: {
      "Наименование товара": "product_name",
      Kатегория: "category",
      "Общ. кол-во": "total_quantity",
      Склад: "store_name",
      Количество: "quantity"
    },
    json_data: [],
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8"
        }
      ]
    ]
  }),

  computed: {
    excelData() {
      return this.realdata;
    },
    tableData() {
      return this.exportdata;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD.MM.YY");
      }
    },
    initialize() {
      (this.clientdata = [
        {
          client_region: "Ташкент",
          client_name: "Муслимов Д"
        },
        {
          client_region: "Ташкент",
          client_name: "Жамшид Бозор"
        }
      ]),
        (this.realdata = [
          {
            product_id: 0,
            product_name: "Allroad 12,00R20 АR588",
            category: "шина",
            total_quantity: 120,
            store_name: "Терминал",
            quantity: 120
          },
          {
            product_id: 1,
            product_name: "Aptany 165/70R12 RP203",
            category: "шина",
            total_quantity: 100,
            store_name: "Основной",
            quantity: 100
          },
          {
            product_id: 2,
            product_name: "Austone 12R22,5 АТ209",
            category: "шина",
            total_quantity: 250,
            store_name: "Основной",
            quantity: 250
          },
          {
            product_id: 3,
            product_name: "DISK DOHC Мах Кора",
            category: "диск",
            total_quantity: 500,
            store_name: "Основной",
            quantity: 500
          }
        ]);
    },

    editItem(item) {
      this.editedIndex = this.realdata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog3 = true;
    },
    close() {
      this.dialog3 = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save_edited() {
      if (this.editedIndex > -1) {
        Object.assign(this.realdata[this.editedIndex], this.editedItem);
      } else {
        this.realdata.push(this.editedItem);
      }
      this.close();
    },

    add: function(event) {
      var newRow = {
        number: this.nextBarId++,
        ex_product_name: this.ex_product_name,
        ex_store_name: this.ex_store_name,
        ex_quantity: this.ex_quantity,
        ex_client_name: this.ex_client_name,
        ex_date: this.ex_date
      };
      this.exportdata.push(newRow);
      this.ex_product_name = "";
      this.ex_store_name = "";
      this.ex_quantity = "";
      this.ex_client_name = "";
    }

    // updateSortedTable (sortKey) {
    //     this.reverse = (this.sortKey == sortKey) ? ! this.reverse : false;
    //     this.sortKey = sortKey;
    //     this.close()

    // }
  }
};
</script>

<style scoped>
.v-text-field >>> .v-input__control {
  margin-left: 5%;
}
</style>