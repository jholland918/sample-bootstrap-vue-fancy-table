<template>
  <div class="page-size-select">
    Show
    <b-form-select v-model="selected" :options="options"></b-form-select>
    entries
  </div>
</template>
<script>
export default {
  name: "page-size-select",
  data() {
    return {
      selected: 10,
      options: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
    };
  },
};
</script>
<style scoped>
.page-size-select {
  display: flex;
  align-items: center;
}
.page-size-select > select {
  margin-left: 1rem;
  margin-right: 1rem;
  width: 5rem;
}
</style>