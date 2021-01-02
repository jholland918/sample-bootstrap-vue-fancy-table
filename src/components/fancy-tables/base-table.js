export default {
    name: 'base-table',
    props: {
        fields: {
            type: Array,
        },
        items: {
            type: Array,
        },
        currentPage: {
            type: [Number, String],
            default: 1,
        },
        perPage: {
            type: [Number, String],
            default: 10,
        },
    },
    data() {
        return {
            /** Object wrapper for currentPage value to retain reactivity within $scopedSlots. */
            currentPageObj: {
                value: Number(this.currentPage)
            },
            /** Object wrapper for perPage value to retain reactivity within $scopedSlots. */
            perPageObj: {
                value: Number(this.perPage)
            },
            filterObj: {
                value: ''
            },
            isBusy: false
        };
    },
    computed: {
        totalRows: function () {
            return this.items.length;
        },
        columnFilter: function () {
            let fields = this.fields.filter(f => {
                // Intentionally skipping empty strings (""), nulls, undefined, and NaN values because we don't filter on those.
                return f.filter.model || f.filter.model === false || f.filter.model === 0;
            });

            return fields.length ? fields : null;
        }
    },
    render() {
        return this.$scopedSlots.default({
            getData: this.getData,
            items: this.items,
            fields: this.fields,
            isBusy: this.isBusy,
            totalRows: this.totalRows,
            currentPage: this.currentPageObj,
            perPage: this.perPageObj,
            filter: this.filterObj,
            columnFilter: this.columnFilter,
            columnFilterFunc: this.columnFilterFunc,
        });
    },
    mounted() {
        this.table = this.$children.find(c => c.$el.classList.contains("b-table"));
        console.log('base-table mounted', this.table);
    },
    methods: {
        columnFilterFunc(item, fields) {

            let count = fields.length;
            for (let i = 0; i < count; i++) {
                let field = fields[i];
                let filter = field.filter;
                
                console.log('filter');

                if (!item.hasOwnProperty(field.key)) {
                    return false;
                }

                let value = item[field.key];

                switch (filter.type) {
                    case 'select':
                        if (filter.model !== value) {
                            return false;
                        }
                        break;
                
                    default:
                        // Assume text
                        if (String(value).toLowerCase().indexOf(String(filter.model).toLowerCase()) === -1) {
                            return false;
                        }
                        break;
                }
            }

            return true; // if we got here then we should have a match
        },

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