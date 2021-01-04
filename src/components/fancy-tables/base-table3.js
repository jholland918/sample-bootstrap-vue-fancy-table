import Vue from 'vue';
export default {
    functional: true,
    name: 'base-table3',
    props: {
        eventBus: {
            //type: Function,
            required: true
        },
        table: {
            type: String
        },
        pagination: {
            type: String
        },
        currentPage: {
            type: Number,
        }
    },
    render: function (createElement, context) {
        let scope = {};


        scope.currentPage = { value: context.props.currentPage };

        context.props.eventBus.$on('mounted', () => {
            
            let table = context.parent.$refs[context.props.table];
            let pagination = context.parent.$refs[context.props.pagination];

            table.currentPage = pagination.currentPage;

            console.log('braww', { table, pagination });

        });

        //scope.pagination = context.parent.$refs[context.props.pagination];

        return createElement('div', [context.scopedSlots.default(scope)]);
    },

};