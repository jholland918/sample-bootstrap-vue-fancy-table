export default {
    name: 'base-table',
    props: {
        exampleProp: {
            type: String,
        },
        items: {
            type: Array,
        }
    },
    render() {
        return this.$scopedSlots.default({
            items: this.items,
            exampleProp: this.exampleProp,
        });
    }
};