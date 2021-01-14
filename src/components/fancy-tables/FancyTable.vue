<template>
  <base-table v-bind:current-page="currentPage" v-bind:per-page="perPage">
    <b-container slot="default" slot-scope="scope">
      <b-row class="mb-1">
        <b-col cols="4"
          ><page-size-select v-model="scope.perPage.value"></page-size-select
        ></b-col>
        <b-col cols="8" class="d-flex justify-content-end">
          <export-buttons v-if="showExportButtons"
            v-bind:get-data="scope.getData"
            class="mr-1"
          ></export-buttons>
          <search-input
            v-model="scope.filter.value"
            data-cy="search-input"
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
          <pagination-info style="font-size: .875rem;"
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
            size="sm"
            class="float-right"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </base-table>
</template>
<script>
import ExportButtons from "./ExportButtons.vue";
export default {
  components: { ExportButtons },
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
    showExportButtons: {
      type: Boolean,
      default: false
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