<i18n>
    {
        "es": {
            "Showing {0} to {1} of {2} entries": "Mostrando {0} a {1} de {2} entradas"
        },
        "fr": {
            "Showing {0} to {1} of {2} entries": "Affiche {0} à {1} de {2} entrées"
        }
    }
</i18n>

<template>
  <span class="pagination-info">{{
    $t("Showing {0} to {1} of {2} entries", [
      pageRowStart,
      pageRowEnd,
      totalRows,
    ])
  }}</span>
</template>

<script>
export default {
  name: "pagination-info",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    totalRows: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    pageRowStart: function () {
      return this.perPage * this.currentPage - (this.perPage - 1);
    },
    pageRowEnd: function () {
      let value = this.perPage * this.currentPage;
      return this.totalRows < value ? this.totalRows : value;
    },
  },
};
</script>
