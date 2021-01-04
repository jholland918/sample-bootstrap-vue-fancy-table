<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <base-table3
      :event-bus="eventBus"
      table="table"
      pagination="pagination"
      :current-page="2"
    >
      <div slot="default" slot-scope="scope">
        <b-table
          ref="table"
          :items="items"
          :fields="fields"
          :per-page="2"
        ></b-table>
        <b-pagination
          ref="pagination"
          v-model="scope.currentPage.value"
          :total-rows="3"
          :per-page="2"
          aria-controls="my-table"
        ></b-pagination>
      </div>
    </base-table3>
  </div>
</template>

<script>
import Vue from "vue";
import MyWidget from "./MyWidget";
import BaseTable3 from "./fancy-tables/base-table3";

export default {
  name: "HelloWorld",
  components: { MyWidget, BaseTable3 },
  props: {
    msg: String,
  },
  data: function () {
    return {
      eventBus: new Vue(),
      currentPage: 2,
      helloWorl: true,
      caption: "Muh Widget List",
      fields: [
        {
          key: "isActive",
          filter: {
            model: null,
            type: "select",
            selectOptions: [{ text: "All", value: null }, true, false],
          },
        },
        {
          key: "age",
          filter: {
            model: null,
            type: "select",
            selectOptions: [{ text: "All", value: null }],
          },
        },
        {
          key: "first_name",
          filter: { model: null },
        },
        {
          key: "last_name",
          filter: { model: null },
        },
      ],
      items: [
        {
          isActive: true,
          age: "92093",
          first_name: "Lola",
          last_name: "Ziems",
        },
        {
          isActive: false,
          age: "70",
          first_name: "Cobb",
          last_name: "Macourek",
        },
        {
          isActive: true,
          age: "380",
          first_name: "Randie",
          last_name: "Seago",
        },
      ],
    };
  },
  mounted() {
    this.eventBus.$emit("mounted");
  },
  methods: {
    joo() {
      console.log("joo");
    },
  },
};
</script>
