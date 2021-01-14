<template>
  <div class="export-buttons">
    <b-dropdown size="sm">
      <template #button-content>
        <font-awesome-icon :icon="['fas', 'file-export']" /> Export
      </template>
      <b-dropdown-item v-on:click="onExcelClick"><font-awesome-icon :icon="['fas', 'file-excel']" /> Excel</b-dropdown-item>
      <b-dropdown-item v-on:click="onCsvClick"><font-awesome-icon :icon="['fas', 'file-csv']" /> CSV</b-dropdown-item>
      <b-dropdown-item v-on:click="onTextClick"><font-awesome-icon :icon="['fas', 'file-alt']" /> Text</b-dropdown-item>
      <b-dropdown-item v-on:click="onPdfClick"><font-awesome-icon :icon="['fas', 'file-pdf']" /> PDF</b-dropdown-item>
      <b-dropdown-item v-on:click="onPrintClick"><font-awesome-icon :icon="['fas', 'print']" /> Print</b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script>
// These `const getSomeLib = () => import("some-lib");` statements are used for lazy loading libraries.
// This is beneficial for the PDF and Excel libraries since they are large and are not necessarily used
// every time the user visits a page with this control.
const getJsPDF = () => import("jspdf");
const getJspdfAutotable = () => import("jspdf-autotable");
const getXLSX = () => import("xlsx/xlsx.mini");

export default {
  name: "export-buttons",
  props: {
    filename: {
      type: String,
      default: "Export",
      validator: function (value) {
        return value.length > 0;
      },
    },
    getData: {
      type: Function,
      required: true,
    },
    controlType: {
      type: String,
      validator: function (value) {
        return ["dropdown", "buttons"].indexOf(value) > -1;
      },
      default: "dropdown",
    },
  },
  methods: {
    onPdfClick() {
      getJsPDF()
        .then(({ jsPDF }) => getJspdfAutotable().then(() => jsPDF))
        .then((jsPDF) => {
          let data = this.getData();

          const doc = new jsPDF();
          doc.autoTable({
            head: [data.head],
            body: data.body,
          });

          doc.save(`${this.filename}.pdf`);
        });
    },
    onTextClick() {
      this.exportWithSheetJs("txt");
    },
    onExcelClick() {
      this.exportWithSheetJs("xlsx");
    },
    onCsvClick() {
      this.exportWithSheetJs("csv");
    },
    onPrintClick() {
      getXLSX().then((XLSX) => {
        let header = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${this.filename}</title>
            <style>
              body{
                font-family: sans-serif;
              }
              #table1 {
                border: 2px solid #000000;
                width: 100%;
                text-align: left;
                border-collapse: collapse;
              }
              #table1 td, #table1 th {
                border: 1px solid #000000;
                padding: 5px 4px;
              }
              #table1 tbody td {
                font-size: 13px;
              }
              #table1 tr:first-child {
                background: #CFCFCF;
                border-bottom: 2px solid #000000;
              }
              #table1 tr:first-child td {
                font-size: 15px;
                font-weight: bold;
                color: #000000;
                text-align: left;
              }
            </style>
          </head>
          <body>`;

        let data = this.getData();
        let aoa = data.body;
        aoa.unshift(data.head);

        let sheet = XLSX.utils.aoa_to_sheet(aoa);
        let html = XLSX.utils.sheet_to_html(sheet, {
          id: "table1",
          header: header,
        });

        // Use timestamp for the window name so multiple export clicks don't reuse the same window.
        let printWindow = window.open("", `export-${new Date().getTime()}`);
        printWindow.document.write(html);
      });
    },
    exportWithSheetJs(extension) {
      getXLSX().then((XLSX) => {
        let data = this.getData();
        let aoa = data.body;
        aoa.unshift(data.head);

        let sheet = XLSX.utils.aoa_to_sheet(aoa);
        let book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, sheet, "Sheet1");
        XLSX.writeFile(book, `${this.filename}.${extension}`);
      });
    },
  },
};
</script>
<style scoped>
.export-buttons > button {
  margin-right: 0.25rem;
}
</style>