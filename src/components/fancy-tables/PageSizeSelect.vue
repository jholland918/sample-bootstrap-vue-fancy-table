<i18n>
    {
        "es": {
            "Show": "Mostrar",
            "entries": "entradas"
        },
        "fr": {
            "Show": "Afficher",
            "entries": "entrées"
        }
    }
</i18n>
<template>
  <div class="page-size-select">
    {{ $t("Show") }}
    <b-form-select
      v-model="mutableValue"
      :options="options"
      v-on:input="$emit('input', mutableValue)"
    ></b-form-select>
    {{ $t("entries") }}
  </div>
</template>
<script>
export default {
  name: "page-size-select",
  props: {
    value: {
      type: Number,
      default: 10,
    },
    sizes: {
      type: Array,
      default: function () {
        return [5, 10, 25, 50, 100];
      },
    },
  },
  data() {
    return {
      mutableValue: this.value,
    };
  },
  computed: {
    options: function () {
      let sizes =
        this.sizes && this.sizes.length ? this.sizes : [5, 10, 25, 50, 100];

      let options = sizes.map((s) => {
        return { value: Number(s), text: s };
      });

      if (!options.find((o) => o.value == this.mutableValue)) {
        this.mutableValue = options[0].value;
      }

      return options;
    },
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