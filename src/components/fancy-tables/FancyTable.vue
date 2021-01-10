<template>
  <base-table v-bind:current-page="currentPage" v-bind:per-page="perPage">
    <b-container slot="default" slot-scope="scope">
      <b-row>
        <b-col
          ><page-size-select v-model="scope.perPage.value"></page-size-select
        ></b-col>
        <b-col>
          <search-input
            v-model="scope.filter.value"
            data-cy="search-input"
            class="float-right"
          ></search-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table
            v-bind:items="items"
            v-bind:per-page="scope.perPage.value"
            v-bind:current-page="scope.currentPage.value"
            v-bind:filter="scope.filter.value"
          ></b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <pagination-info
            v-bind:current-page="scope.currentPage.value"
            v-bind:per-page="scope.perPage.value"
            v-bind:total-rows="scope.totalRows"
          ></pagination-info>
        </b-col>
        <b-col>
          <b-pagination
            v-model="scope.currentPage.value"
            v-bind:total-rows="scope.totalRows"
            v-bind:per-page="scope.perPage.value"
            class="float-right"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </base-table>
</template>
<script>
export default {
  name: "fancy-table",
  props: {
    items: {
      type: Array,
    },
    fields: {
      type: Array,
    },
    currentPage: {
      type: [Number, String],
      default: 1,
    },
    perPage: {
      type: [Number, String],
      default: 10,
    },
  },
};
</script>
<style>
.outer {
  background-color: #eee;
}
.inner {
  background-color: yellow;
}
</style>