/// <reference types="cypress" />
import Vue from 'vue';
import { mount } from '@cypress/vue';
import '@/plugins/bootstrap-vue';
import '@/plugins/font-awesome';

import { library as fontawesome } from '@fortawesome/fontawesome-svg-core';
import { faFileCsv, faFileExcel, faFilePdf, faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
fontawesome.add(faFileCsv, faFileExcel, faFilePdf, faCopy, faPrint);

import BaseTable from '@/components/fancy-tables/base-table';
import PageSizeSelect from '@/components/fancy-tables/PageSizeSelect';
import SearchInput from '@/components/fancy-tables/SearchInput';
import ExportButtons from '@/components/fancy-tables/ExportButtons';
Vue.component('base-table', BaseTable);
Vue.component('page-size-select', PageSizeSelect);
Vue.component('search-input', SearchInput);
Vue.component('export-buttons', ExportButtons);

describe('Base Table', () => {
    const items = [
        { isActive: true, age: 40, first_name: "John", last_name: "Smith", },
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
        { isActive: true, age: 38, first_name: "Jami", last_name: "Carney" },
    ];

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
                <div slot="default" slot-scope="{ items }">
                    <search-input></search-input>
                    <b-table :items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        });

        cy.get('.search-input').should('be.visible');
    });

    it.only('should render the export buttons', () => {
        mount({
            template: `<base-table :items="items">
                <div slot="default" slot-scope="{ items }">
                    <export-buttons></export-buttons>
                    <b-table :items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: items
                }
            }
        });

        cy.get('.export-buttons').should('be.visible');
    });
});
