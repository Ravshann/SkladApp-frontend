<template>
  <div>
    <v-content>
      <h2 class="page-title">Остаток по {{getDate()}}</h2>

      <v-layout row>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Поиск..."
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <outgoing-record-form @outgoing-record-event="updateDataTable"/>
        <incoming-record-form @incoming-record-event="updateDataTable"/>
        <advanced-sort :remainder_data="remainder_computed" :search="search"/>
        <excel-generator :json_data="remainder_computed"/>
      </v-layout>
    </v-content>
    <table-remainder :remainder_data="remainder_computed" :search="search"/>
  </div>
</template>

<script>
import TableRemainder from "./TableRemainder";
import OutgoingRecordForm from "./OutgoingRecordForm";
import IncomingRecordForm from "./IncomingRecordForm";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import axios from "axios";
export default {
  name: "Remainder",
  components: {
    TableRemainder,
    OutgoingRecordForm,
    IncomingRecordForm,
    AdvancedSort,
    ExcelGenerator
  },
  created() {
    this.getRemainders();
  },
  data: () => ({
    host: "http://www.sklad-app.tk",
    port: "8080",
    remainder_data: [],
    search: ""
  }),
  computed: {
    search_computed: {
      get: function() {
        return this.search;
      },
      set: function(data) {
        this.search = data;
      }
    },
    remainder_computed: {
      get: function() {
        return this.remainder_data;
      },
      set: function(arr) {
        this.remainder_data = arr;
      }
    }
  },
  methods: {
    getDate: function() {
      var cur_date_vue = new Date();
      var month = ("0" + (cur_date_vue.getMonth() + 1)).slice(-2);
      var date = ("0" + cur_date_vue.getDate()).slice(-2);
      var year = cur_date_vue.getFullYear();
      var date_formatted_vue = year + "/" + month + "/" + date;
      return date_formatted_vue;
    },
    getRemainders: function() {
      const url = this.host + ":" + this.port + "/remainder";
      var self = this;
      axios
        .get(url)
        .then(function(response) {
          self.remainder_data = response.data;
          console.log(self.remainder_data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateDataTable: function(object) {
      object.forEach(record => {
        if (record.inout_type_ID === 2) {
          var newArray = [];
          this.remainder_computed.forEach(data => {
            var newItem = data;
            if (newItem.productID === record.product_ID) {
              newItem.total += record.quantity;
              newItem.storageQuantities.forEach(pair => {
                if (pair.storageID === record.storage_ID)
                  pair.quantity += record.quantity;
              });
            }
            newArray.push(newItem);
          });
          this.remainder_computed = newArray;
        } else {
          var newArray = [];
          this.remainder_computed.forEach(data => {
            var newItem = data;
            if (newItem.productID === record.product_ID) {
              newItem.total -= record.quantity;
              newItem.storageQuantities.forEach(pair => {
                if (pair.storageID === record.storage_ID)
                  pair.quantity -= record.quantity;
              });
            }
            newArray.push(newItem);
          });
          this.remainder_computed = newArray;
        }
      });
    }
  }
};
</script>

<style>
.main-drawer {
  width: 250px;
  background: black;
}

.toolbar__item {
  margin-top: 80px;
}

.button__in {
  background: #3f9b6c;
}

.button__in:hover {
  background: #157c5d;
  transition: background 0.9s ease;
}

.button__out {
  background: #369baa;
  margin-left: 10px;
}

.button__out:hover {
  background: #158399;
  transition: background 0.9s ease;
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

.page-title {
  text-align: center;
  margin-top: 25px;
}

.clearfix::after {
  content: " ";
  display: table;
  clear: both;
}

.search-block {
  padding: 15px;
  margin: 20px;
}

.search-input::after {
  color: inherit;
  content: attr(data-icon);
  font-family: "FontAwesome";
  font-style: normal;
}

.search-block__left {
  max-width: 400px;
  float: left;
}

.search-block__right {
  max-width: 400px;
  float: right;
}

.button {
  width: 85px;
  min-height: 30px;
  border-radius: 5px;
}

.search-filter {
  margin-right: 15px;
  background: #9e48db;
  color: #fff;
  padding: 0 3px;
}

.search-filter:hover {
  background: #96308c;
  transition: background 0.9s ease;
}

.search-download {
  margin-right: 0;
  background: #238765;
  color: #fff;
}

.search-download:hover {
  background: #28632d;
  transition: background 0.9s ease;
}
.v-text-field {
  margin-left: 1%;
}
</style>
