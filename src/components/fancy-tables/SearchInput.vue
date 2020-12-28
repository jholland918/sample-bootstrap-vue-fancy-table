<template>
  <div class="search-input">
    Search
    <b-form-input v-model="text" placeholder="Enter search text"></b-form-input>
  </div>
</template>
<script>
export default {
  name: "search-input",
  data() {
    return {
      text: "",
    };
  },
};
</script>
<style scoped>
.search-input {
  display: flex;
  align-items: center;
  max-width: 200px;
}
.search-input > input {
    margin-left: 0.5rem;
}
</style>