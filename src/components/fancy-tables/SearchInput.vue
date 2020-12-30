<template>
  <div class="search-input">
    <b-input-group size="sm">
      <b-form-input
        v-model="mutableValue"
        placeholder="Type to Search"
        v-on:input="$emit('input', mutableValue)"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          v-bind:disabled="!mutableValue"
          v-on:click="onClearClick"
          variant="secondary"
          >Clear</b-button
        >
      </b-input-group-append>
    </b-input-group>
  </div>
</template>
<script>
export default {
  name: "search-input",
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      mutableValue: this.value,
    };
  },
  methods: {
    onClearClick() {
      this.mutableValue = "";
      this.$emit("input", this.mutableValue);
    },
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