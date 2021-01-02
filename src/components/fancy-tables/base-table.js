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
            columnFilterModel: {},
        };
    },
    computed: {
        totalRows: function () {
            return this.items.length;
        },
        columnFilter: function () {
            if (!Object.values(this.columnFilterModel).some(v => {
                // Intentionally skipping empty strings (""), nulls, undefined, and NaN values because we don't filter on those.
                return v || v === false || v === 0;
            })) {
                return null;
            }

            return this.columnFilterModel;
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
            columnFilter: this.columnFilter,
            columnFilterModel: this.columnFilterModel,
            columnFilterFunc: this.columnFilterFunc,
        });
    },
    mounted() {
        this.table = this.$children.find(c => c.$el.classList.contains("b-table"));

         this.table.computedFields.forEach((field) => {
             this.$set(this.columnFilterModel, field.key, null);
         });

        console.log('base-table mounted', this.table);
    },
    methods: {
        columnFilterFunc(item, criteria) {

            for (const property in criteria) {
                if (!criteria.hasOwnProperty(property)) {
                    continue;
                }

                let criterion = criteria[property];

                // We can't just check for falsy (eg `!criterion`) before skipping because there are some falsy values that might be legitimate filter criteria.
                if (criterion === '' || criterion === null || criterion === undefined) {
                    continue;
                }

                if (!item.hasOwnProperty(property)) {
                    return false;
                }

                let value = item[property];

                if (criterion === value) {
                    continue;
                }

                if (String(value).toLowerCase().indexOf(String(criterion).toLowerCase()) === -1) {
                    return false;
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