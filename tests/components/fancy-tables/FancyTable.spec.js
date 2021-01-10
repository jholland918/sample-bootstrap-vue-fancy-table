/// <reference types="cypress" />
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { mount } from '@cypress/vue';
import '@/plugins/bootstrap-vue';
import '@/plugins/font-awesome';

import { library as fontawesome } from '@fortawesome/fontawesome-svg-core';
import { faFileCsv, faFileExcel, faFilePdf, faPrint, faFileAlt } from '@fortawesome/free-solid-svg-icons';
fontawesome.add(faFileCsv, faFileExcel, faFilePdf, faPrint, faFileAlt);

import BaseTable from '@/components/fancy-tables/base-table';
import FancyTable from '@/components/fancy-tables/FancyTable';
import PageSizeSelect from '@/components/fancy-tables/PageSizeSelect';
import SearchInput from '@/components/fancy-tables/SearchInput';
import ExportButtons from '@/components/fancy-tables/ExportButtons';
import PaginationInfo from '@/components/fancy-tables/PaginationInfo';

describe('Base Table', () => {
    Vue.use(VueI18n);

    const i18n = new VueI18n({
        locale: 'en',
        fallbackLocale: 'en',
        silentFallbackWarn: true,
        formatFallbackMessages: true,
        silentTranslationWarn: true,
        messages: {}
    });

    const extensions = {
        use: [VueI18n],
        components: {
            'base-table': { i18n, ...BaseTable },
            'fancy-table': { i18n, ...FancyTable },
            'page-size-select': { i18n, ...PageSizeSelect },
            'search-input': { i18n, ...SearchInput },
            'export-buttons': { i18n, ...ExportButtons },
            'pagination-info': { i18n, ...PaginationInfo },
        },
    };

    const basicItems = [{ "isActive": true, "age": 32, "first_name": "Lola", "last_name": "Ziems" },
    { "isActive": false, "age": 55, "first_name": "Cobb", "last_name": "Macourek" },
    { "isActive": true, "age": 27, "first_name": "Randie", "last_name": "Seago" }];

    it.only('should render the table', () => {
        // In this case, scope is not used but included in the template here to show what's available in a simple implementation. 
        // Really no one should be using the <base-table> like it's used here - they should just use <b-table> directly when no features of <base-table> are needed.
        mount({
            template: `<fancy-table v-bind:items="items"></fancy-table>`,
            data: function () {
                return {
                    items: [...basicItems, ...basicItems, ...basicItems, ...basicItems, ...basicItems]
                }
            }
        }, { extensions });
    });
});
