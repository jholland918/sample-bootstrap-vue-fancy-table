export default {
    functional: true,
    props: {
        items: {
            type: Array
        },
        fields: {
            type: Array
        }
    },
    render: function (createElement, context) {
        let scope = {};

        console.log('render this', this);
        console.log('context', context);

        scope.items = context.props.items;
        scope.fields = context.props.fields;
        //scope.columnFilter = [];
        scope.columnFilter = {value: []};

        scope.updateColumnFilter = () => {
            console.log('updateColumnFilter');

            let fields = scope.fields.filter(f => {
                // Intentionally skipping empty strings (""), nulls, undefined, and NaN values because we don't filter on those.
                return f.filter.model || f.filter.model === false || f.filter.model === 0;
            });

            //scope.columnFilter = fields.length ? fields : null;
            if (fields.length) {
                console.log('updateColumnFilter 1', context);

                //scope.columnFilter = fields;

                //context.parent.$refs.table.filter = fields;

            } else {
                console.log('updateColumnFilter 2', scope.columnFilter === context.parent.$refs.table.filter);

                //scope.columnFilter = null;

                //context.parent.$refs.table.filter = null;



            }
        };

        scope.onFiltersChange = () => {
            console.log('context.parent.$refs.table ', context.parent.$refs.table);
            scope.updateColumnFilter();
        };

        scope.columnFilterFunc = (item, fields) => {
            console.log('columnFilterFunc');
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
        };

        return createElement('div', [context.scopedSlots.default(scope)]);
    },
    // These are accessed by $options.methods.* in functional components
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

    }
};