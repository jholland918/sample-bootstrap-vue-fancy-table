export default {
    name: 'base-table',
    props: {
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
            /** Object indexed by field key with filter text for each column */
            filterModel: {},
        };
    },
    computed: {
        totalRows: function () {
            return this.items.length;
        },
        columnFilter: function () {
            console.log('---filter2---');

            if (!Object.values(this.filterModel).some(v => v)){
                return null;
            }

            return this.filterModel;
        }
    },
    render() {
        return this.$scopedSlots.default({
            getData: this.getData,
            items: this.items,
            totalRows: this.totalRows,
            currentPage: this.currentPageObj,
            perPage: this.perPageObj,
            filter: this.filterObj,
            filterModel: this.filterModel,
            columnFilterFunc: this.columnFilterFunc,
            columnFilter: this.columnFilter,
            clicky: this.clicky
        });
    },
    mounted() {
        this.table = this.$children.find(c => c.$el.classList.contains("b-table"));

        // this.table.computedFields.forEach((computedField) => {
        //     this.$set(this.columnFilters, computedField.key, '');
        // });

        console.log('base-table mounted', this.table);
    },
    methods: {
        clicky() {
            //this.columnFilters.push('afdfdddddddddd');
            //this.columnFilters = [...this.columnFilters];
            //this.columnFilters['q'] = 'qq';
        },
        //the original item row record data object. Treat this argument as read-only.
        //the content of the filter prop (could be a string, RegExp, array, or object)
        columnFilterFunc(row, filter) {
            console.log('row', row);
            console.log('filter', filter);

            return true; // true if row matches filter criteria, else false...

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