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
  <span>{{
    $t("Showing {0} to {1} of {2} entries", [
      pageRowStart,
      pageRowEnd,
      totalRows,
    ])
  }}</span>
</template>

<script>
export default {
  name: "PaginationInfo",
  props: {
    currentPage: Number,
    perPage: Number,
    totalRows: Number,
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
