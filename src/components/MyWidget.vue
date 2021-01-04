<template functional>
  <div>
    <h2>My Widget Panel</h2>

    <b-button
      @click="
        $options.methods.onClick(
          props,
          children,
          slots,
          scopedSlots,
          data,
          parent,
          listeners
        )
      "
      >Clicky</b-button
    >
    <!-- <my-list :caption="props.caption" :items="props.items"></my-list> -->
    <slot></slot>
  </div>
</template>
<script>

/*
    <!-- <my-widget my-list-ref="myList" :caption="caption" @click="joo">
      <div slot="default" slot-scope="scope">
        <p>moo</p>
        <my-list ref="myList" :caption="scope.caption" :items="items"></my-list>
      </div>
    </my-widget> -->
*/

// https://vuejs.org/v2/guide/render-function.html#Functional-Components
export default {
  name: "my-widget",
  functional: true,
  props: {
    // https://github.com/vuejs/vue/issues/8350
    myListRef: {
      type: String
    },
    caption: {
      type: String,
    },
    items: {
      type: Array,
    },
  },
  render: function (createElement, context) {
    let scope = {};

    scope.caption = context.props.caption;

    return createElement("div", [context.scopedSlots.default(scope)]);
  },
  methods: {
    // access using $options.methods.onClick
    onClick(props, children, slots, scopedSlots, data, parent, listeners) {
      console.log("context", {
        props,
        children,
        slots,
        scopedSlots,
        data,
        parent,
        listeners,
      });
      parent.caption = "farts";

      console.log('scopedSlots.default()', scopedSlots.default());

      let myList = parent.$refs[props.myListRef];

      console.log("myList", myList);
    },
  },
};
</script>