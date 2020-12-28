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
            getData: this.getData,
            items: this.items,
            contextChanged: this.contextChanged
        });
    },
    mounted() {
        this.table = this.$children.find(c => c.$el.classList.contains("b-table"));
        console.log('base-table mounted', this.table);
    },
    methods: {
        /**
         * Returns table data for export using any applied user sorting and filtering.
         * 
         * The `<b-table>` `items` prop gets computed into several other properties like this:
         * `(items || []) -> localItems -> filteredItems -> sortedItems -> paginatedItems -> computedItems`.
         * This method uses the `sortedItems` property in order to export the user's sorted and filtered data
         * because the properties later in the chain (`paginatedItems` and `computedItems`) will  only contain 
         * the current page of data and we're assuming the user will usually want the entire data set when exporting.
         * @summary Returns table data for export
         */
        getData() {
            console.log('table', this.table);
            
            let fields = this.table.computedFields;
            let items = (this.table.sortedItems || this.table.filteredItems || this.table.localItems || []).slice();

            let head = fields.map(f => f.label);

            let body = items.map((item) => {
                return fields.map((field) => {
                    return this.table.getFormattedValue(item, field);
                });
            });

            return { head, body };
        },
        contextChanged(ctx) {
            console.log('contextChanged', ctx);

        }
    }
};