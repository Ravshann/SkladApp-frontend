<template lang="pug">
div
  v-content
    h2.view-title &Ocy;&scy;&tcy;&acy;&tcy;&ocy;&kcy; &pcy;&ocy; {{getDate()}}
    v-layout(row='')
      v-text-field(v-model='search' append-icon='search' label='Поиск...' single-line='' hide-details='')
      v-spacer
      v-spacer
      v-spacer
      outgoing-record-form(@outgoing-record-event='updateDataTable')
      incoming-record-form(@incoming-record-event='updateDataTable')
      advanced-sort(:remainder_data='remainder_computed' :search='search')
      excel-generator(:json_data='remainder_computed')
  table-remainder(v-if='!isLoading' :remainder_data='remainder_computed' :search='search')

  //- <div>
  //-   <v-content>
  //-     <h2 class="view-title">Остаток по {{getDate()}}</h2>

  //-     <v-layout row>
  //-       <v-text-field
  //-         v-model="search"
  //-         append-icon="search"
  //-         label="Поиск..."
  //-         single-line
  //-         hide-details
  //-       ></v-text-field>

  //-       <v-spacer></v-spacer>
  //-       <v-spacer></v-spacer>
  //-       <v-spacer></v-spacer>
  //-       <outgoing-record-form @outgoing-record-event="updateDataTable"/>
  //-       <incoming-record-form @incoming-record-event="updateDataTable"/>
  //-       <advanced-sort :remainder_data="remainder_computed" :search="search"/>
  //-       <excel-generator :json_data="remainder_computed"/>
  //-     </v-layout>
  //-   </v-content>
  //-   <table-remainder v-if="!isLoading" :remainder_data="remainder_computed" :search="search"/>
  //- </div>
</template>

<script>
import TableRemainder from "./TableRemainder";
import OutgoingRecordForm from "./OutgoingRecordForm";
import IncomingRecordForm from "./IncomingRecordForm";
import AdvancedSort from "./AdvancedSort";
import ExcelGenerator from "./ExcelGenerator";
import RepositoryFactory from "../../services/RepositoryFactory";
const repository = RepositoryFactory.get("remainder");

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
  data() {
    return {
      isLoading: false,
      remainder_data: [],
      search: ""
    };
  },
  computed: {
    search_computed: {
      get() {
        return this.search;
      },
      set(data) {
        this.search = data;
      }
    },
    remainder_computed: {
      get() {
        return this.remainder_data;
      },
      set(arr) {
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
    async getRemainders() {
      this.isLoading = true;
      const { data } = await repository.get();
      this.isLoading = false;
      this.remainder_data = data;
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

<style scoped>
.main-drawer {
  width: 250px;
  background: black;
}

.view-title {
  text-align: center;
  margin-top: 25px;
}

.v-text-field {
  margin-left: 1%;
}
</style>
