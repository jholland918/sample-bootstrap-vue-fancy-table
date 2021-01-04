<template>
  <div>
    <h3>{{ caption }}</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "my-list",
  props: {
    caption: {
      type: String,
      default: "Hello...",
    },
    items: {
      type: Array,
    },
    filter: {
      type: String
    }
  },
};
</script>