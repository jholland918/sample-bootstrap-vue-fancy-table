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
import PageSizeSelect from '@/components/fancy-tables/PageSizeSelect';
import SearchInput from '@/components/fancy-tables/SearchInput';
import ExportButtons from '@/components/fancy-tables/ExportButtons';
import PaginationInfo from '@/components/fancy-tables/PaginationInfo';

// Additional features:
// https://datatables.net/examples/api/multi_filter.html
// https://datatables.net/examples/api/multi_filter_select.html
// https://datatables.net/examples/api/form.html
// https://datatables.net/examples/api/regex.html
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
            'page-size-select': { i18n, ...PageSizeSelect },
            'search-input': { i18n, ...SearchInput },
            'export-buttons': { i18n, ...ExportButtons },
            'pagination-info': { i18n, ...PaginationInfo },
        },
    };

    const items = [
        { isActive: true, age: 40, first_name: "John", last_name: "Smith", },
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
    ];

    const getManyItems = () => {
        // Get ASCII table with chars A thru Z.
        let items = [];
        let sequence = 0;
        for(let i = 65; i <= 90; i++) {
            sequence++;
            items.push({ sequence: sequence, char: String.fromCharCode(i)});
        }
        return items;
    };

    it('should render the table', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="{ items }">
                    <b-table :items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        });

        cy.get('table').should('be.visible');
    });

    it('should render the page size select', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="{ items }">
                    <page-size-select></page-size-select>
                    <b-table :items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        });

        cy.get('.page-size-select').should('be.visible');
        cy.get('.page-size-select > select').should('have.value', 10);
    });

    it('should render the pagination', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="{ items }">
                    <b-table :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      aria-controls="my-table"
                    ></b-pagination>
                </div>
            </base-table>`,
            data: function () {
                return {
                    perPage: 3,
                    currentPage: 1,
                    items: items
                }
            },
            computed: {
                rows() {
                    return this.items.length
                }
            }
        });

        cy.get('.pagination.b-pagination').should('be.visible');
        cy.get('.page-link').contains('2').should('be.visible');
    });

    it('should render the search input', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="scope">
                    <search-input v-model="scope.filter.value"></search-input>
                    <b-table :items="scope.items" :filter="scope.filter.value"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        }, { extensions });

        cy.get('.search-input').should('be.visible');
    });

    it('should render the export buttons', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="scope">
                    <export-buttons v-bind:get-data="scope.getData"></export-buttons>
                    <b-table :items="scope.items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            },
        }, { extensions });

        cy.get('.export-buttons').should('be.visible');
    });

    it('should render the pagination info', () => {


        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="scope">
                    <b-table :items="scope.items"></b-table>
                    <pagination-info></pagination-info>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        }, { extensions });

        cy.get('.pagination-info').should('be.visible');
    });

    it('should render all page controls', () => {
        mount({
            template: `<base-table v-bind:items="items" current-page="1" per-page="10">
                <div slot="default" slot-scope="scope">
                    <page-size-select v-model="scope.perPage.value"></page-size-select>
                    <b-table v-bind:items="scope.items" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value"></b-table>
                    <pagination-info v-bind:current-page="scope.currentPage.value" v-bind:per-page="scope.perPage.value" v-bind:total-rows="scope.totalRows"></pagination-info>
                    <b-pagination
                      v-model="scope.currentPage.value"
                      v-bind:total-rows="scope.totalRows"
                      v-bind:per-page="scope.perPage.value"
                    ></b-pagination>
                </div>
            </base-table>`,
            data: function () {
                return {                    
                    items: getManyItems(),
                }
            },
        }, { extensions });

        cy.get('.pagination-info').should('be.visible');
    });

    it.only('should render column search inputs', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="scope">
                    <b-table :items="scope.items" :filter="scope.columnFilter" :filter-function="scope.columnFilterFunc">
                        <template #head(age)="data">
                            {{ data.label }}
                            <b-form-input v-model="scope.filterModel[data.column]" placeholder="Searchy" size="sm" autocomplete="off"></b-form-input>
                        </template>
                        <template #head()="data">
                            {{ data.label }}
                            <b-form-input v-model="scope.filterModel[data.column]" placeholder="Searchie" size="sm" autocomplete="off"></b-form-input>
                        </template>
                    </b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        }, { extensions });

        //cy.get('.search-input').should('be.visible');
    });
});
