<template>
  <div class="export-buttons">
    <b-button v-on:click="onCopyClick"
      ><font-awesome-icon :icon="['fas', 'copy']" /> Copy</b-button
    >
    <b-button v-on:click="onExcelClick"
      ><font-awesome-icon :icon="['fas', 'file-excel']" /> Excel</b-button
    >
    <b-button v-on:click="onCsvClick"
      ><font-awesome-icon :icon="['fas', 'file-csv']" /> CSV</b-button
    >
    <b-button v-on:click="onPdfClick"
      ><font-awesome-icon :icon="['fas', 'file-pdf']" /> PDF</b-button
    >
    <b-button v-on:click="onPrintClick"
      ><font-awesome-icon :icon="['fas', 'print']" /> Print</b-button
    >
  </div>
</template>
<script>
const getJsPDF = () => import("jspdf"); // lazy jspdf import
const getJspdfAutotable = () => import("jspdf-autotable"); // lazy jspdf-autotable import
const getXLSX = () => import("xlsx/xlsx.mini"); // lazy xlsx/xlsx.mini import

export default {
  name: "export-buttons",
  data() {
    return {
      text: "",
    };
  },
  methods: {
    onCopyClick() {
      console.log("onCopyClick");
    },
    onExcelClick() {
      console.log("onExcelClick");

      let data = [
        ["id", "name", "value"],
        [1, "sheetjs", 7262],
        [2, "js-xlsx", 6969],
      ];

      getXLSX().then((XLSX) => {
        var worksheet = XLSX.utils.aoa_to_sheet(data);
        var book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, worksheet, "SheetJS");
        XLSX.writeFile(book, `somefile.xlsx`);
      });
    },
    onCsvClick() {
      console.log("onCsvClick");
    },
    onPdfClick() {
      // These gets/thens lazy load the jsPDF library.
      getJsPDF()
        .then(({ jsPDF }) => getJspdfAutotable().then(() => jsPDF))
        .then((jsPDF) => {
          const doc = new jsPDF();
          doc.autoTable({
            head: [["Name", "Email", "Country2"]],
            body: [
              ["David", "david@example.com", "Sweden"],
              ["Castille", "castille@example.com", "Spain"],
            ],
          });

          doc.save("table.pdf");
        });
    },
    onPrintClick() {
      console.log("onPrintClick");
    },
  },
};
</script>
<style scoped>
.export-buttons > button {
  margin-right: 0.25rem;
}
</style>