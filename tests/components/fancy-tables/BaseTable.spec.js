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

    const basicItems = [{ "isActive": true, "age": 32, "first_name": "Lola", "last_name": "Ziems" },
    { "isActive": false, "age": 55, "first_name": "Cobb", "last_name": "Macourek" },
    { "isActive": true, "age": 27, "first_name": "Randie", "last_name": "Seago" }];

    const getItemsByCount = (count) => {
        let output = [];
        for (let i = 1; i <= count; i++) {
            output.push({ id: i });
        }
        return output;
    };

    const getManyItems = () => {
        // Get ASCII table with chars A thru Z.
        let items = [];
        let sequence = 0;
        for (let i = 65; i <= 90; i++) {
            sequence++;
            items.push({ sequence: sequence, char: String.fromCharCode(i) });
        }
        return items;
    };

    it('should render the table', () => {
        // In this case, scope is not used but included in the template here to show what's available in a simple implementation. 
        // Really no one should be using the <base-table> like it's used here - they should just use <b-table> directly when no features of <base-table> are needed.
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <b-table v-bind:items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: basicItems
                }
            }
        }, { extensions });

        cy.get('table').should('be.visible');
        cy.get('table > tbody').find('tr').should('have.length', 3);
    });

    it('should render the page size select', () => {
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <page-size-select v-model="scope.perPage.value"></page-size-select>
                    <b-table v-bind:items="items" v-bind:per-page="scope.perPage.value"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: getItemsByCount(12)
                }
            }
        }, { extensions });

        cy.get('.page-size-select').should('be.visible');
        cy.get('.page-size-select > select').should('have.value', 10);
        cy.get('table > tbody').find('tr').should('have.length', 10);

        // Ensure the table is reactive to page size changes
        cy.get('.page-size-select > select').select("5");
        cy.get('table > tbody').find('tr').should('have.length', 5);
    });

    it('should render the pagination', () => {
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <b-table v-bind:items="items" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value"></b-table>
                    <b-pagination
                      v-model="scope.currentPage.value"
                      v-bind:total-rows="scope.totalRows"
                      v-bind:per-page="scope.perPage.value"
                    ></b-pagination>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: getItemsByCount(21)
                }
            },
            computed: {
                rows() {
                    return this.items.length
                }
            }
        }, { extensions });

        cy.get('table > tbody').find('tr').should('have.length', 10);
        cy.get('.pagination.b-pagination').should('be.visible');
        cy.get('.page-link').should('have.length', 7); // 7 length = 2 previous buttons + 3 page buttons + 2 next buttons
        cy.get('tbody > tr:first-child').should('contain.text', '1');

        // Click page 2 and verify table is reactive
        cy.get('.page-link').contains('2').click();
        cy.get('tbody > tr:first-child').should('contain.text', '11');
    });

    it('should render the search input', () => {
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <search-input v-model="scope.filter.value"></search-input>
                    <b-table :items="items" :filter="scope.filter.value"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: [{ id: 1, foo: 'aaa', bar: 'xyz' }, { id: 2, foo: 'zzz', bar: 'aaa' }, { id: 3, foo: 'bbb', bar: 'yyy' }]
                }
            }
        }, { extensions });

        cy.get('.search-input').should('be.visible');

        // it searches across multiple fields
        cy.get('.search-input input').type('aaa');
        cy.get('tbody > tr').should('have.length', 2);
        cy.get('tbody > tr:nth-child(1)').should('contain.text', '1');
        cy.get('tbody > tr:nth-child(2)').should('contain.text', '2');

        // it clears the search criteria when the clear button is clicked
        cy.get('.search-input button').click();
        cy.get('.search-input input').should('have.value', '');
        cy.get('tbody > tr').should('have.length', 3);

        // it doesn't show rows for search text that doesn't exist in items
        cy.get('.search-input input').type('should not find this');
        cy.get('tbody > tr').should('have.length', 0);
    });

    it('should render the export buttons', () => {
        mount({
            template: `<base-table ref="sut">
                <div slot="default" slot-scope="scope">
                    <export-buttons v-bind:get-data="scope.getData"></export-buttons>
                    <b-table v-bind:items="items"></b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }, { id: 3, name: 'baz' }]
                }
            },
        }, { extensions }).then(() => {
            // It's a bit iffy to test file downloads at this time so we're just going to check that the export-buttons
            // control is visable and the getData function returns expected data from the <b-table> control.
            cy.get('.export-buttons').should('be.visible');

            let sut = Cypress.vue.$refs.sut;
            let data = sut.getData();
            expect(data.head).to.eql(['Id', 'Name']);
            expect(data.body).to.eql([[1, 'foo'], [2, 'bar'], [3, 'baz']]);
        });
    });

    it('should render the pagination info', () => {
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <b-table v-bind:items="items" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value"></b-table>
                    <pagination-info v-bind:current-page="scope.currentPage.value" v-bind:per-page="scope.perPage.value" v-bind:total-rows="scope.totalRows"></pagination-info>
                </div>
            </base-table>`,
            data: function () {
                return {
                    items: basicItems
                }
            }
        }, { extensions });

        cy.get('.pagination-info').should('be.visible');
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 3 of 3 entries');
    });

    it('should render all paging controls', () => {
        mount({
            template: `<base-table current-page="1" per-page="10">
                <div slot="default" slot-scope="scope">
                    <page-size-select v-model="scope.perPage.value"></page-size-select>
                    <b-table v-bind:items="items" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value"></b-table>
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
        cy.get('table > tbody').find('tr').should('have.length', 10);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 10 of 26 entries');
        cy.get('.page-link').should('have.length', 7); // 7 length = 2 previous buttons + 3 page buttons + 2 next buttons

        // Ensure paging controls are reactive to page size changes
        cy.get('.page-size-select > select').select("5");
        cy.get('table > tbody').find('tr').should('have.length', 5);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 5 of 26 entries');
        cy.get('.page-link').should('have.length', 9); // 9 length = 2 previous buttons + 4 page buttons + 1 ellipsis button + 2 next buttons
    });

    it('should render column search inputs', () => {
        mount({
            template: `<base-table>
                <div slot="default" slot-scope="scope">
                    <b-table :items="items" :fields="fields" :filter="scope.columnFilter" :filter-function="scope.columnFilterFunc">
                    <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Loading...</strong>
                    </div>
                  </template>
                        <template #head(isActive)="data">
                            {{ data.label }}
                            <b-form-select v-model="data.field.filter.model" size="sm" :options="data.field.filter.selectOptions" data-cy="active-filter"></b-form-select>
                        </template>
                        <template #head(age)="data">
                            {{ data.label }}
                            <b-form-select v-model="data.field.filter.model" size="sm" :options="data.field.filter.selectOptions" data-cy="age-filter"></b-form-select>
                        </template>
                        <template #head(first_name)="data">
                            {{ data.label }}
                            <b-form-input v-model="data.field.filter.model" placeholder="Searchie" size="sm" autocomplete="off" data-cy="first-name-filter"></b-form-input>
                        </template>
                        <template #head(last_name)="data">
                            {{ data.label }}
                            <b-form-input v-model="data.field.filter.model" placeholder="Searchie" size="sm" autocomplete="off" data-cy="last-name-filter"></b-form-input>
                        </template>
                    </b-table>
                </div>
            </base-table>`,
            data: function () {
                return {
                    fields: [
                        {
                            key: 'isActive',
                            filter: {
                                model: null,
                                type: 'select',
                                selectOptions: [{ text: 'All', value: null }, true, false]
                            }
                        },
                        {
                            key: 'age',
                            filter: {
                                model: null,
                                type: 'select',
                                selectOptions: [{ text: 'All', value: null }, ...Array.from(new Set(basicItems.map(i => i.age))).sort()]
                            }
                        },
                        {
                            key: 'first_name',
                            filter: { model: null }
                        },
                        {
                            key: 'last_name',
                            filter: { model: null }
                        },
                    ],
                    items: basicItems,
                    selected: ''
                }
            }
        }, { extensions });

        // Ensure controls are visible and correctly initialized
        cy.get('[data-cy="active-filter"]').should((el) => {
            expect(el).to.be.visible;
            let options = el.find('option');
            expect(options).to.have.length(3);
            expect(options.filter(':contains("All")')).to.exist;
            expect(options.filter('[value="true"]')).to.exist;
            expect(options.filter('[value="false"]')).to.exist;
        });

        cy.get('[data-cy="age-filter"]').should((el) => {
            expect(el).to.be.visible;
            let options = el.find('option');
            expect(options).to.have.length(4);
            expect(options.filter(':contains("All")')).to.exist;
            expect(options.filter('[value="27"]')).to.exist;
            expect(options.filter('[value="32"]')).to.exist;
            expect(options.filter('[value="55"]')).to.exist;
        });

        cy.get('[data-cy="first-name-filter"]').should('be.visible');
        cy.get('[data-cy="last-name-filter"]').should('be.visible');

        // Test a single filter
        cy.get('tbody').find('tr').should('have.length', 3);
        cy.get('[data-cy="active-filter"]').select('false');
        cy.get('tbody').find('tr').should('have.length', 1);
        cy.get('tbody').find('tr:first-child').should('contain.text', 'false');
        cy.get('[data-cy="active-filter"]').select('');
        cy.get('tbody').find('tr').should('have.length', 3);

        // Test combined filters across columns
        cy.get('[data-cy="first-name-filter"]').type('a');
        cy.get('tbody').find('tr').should('have.length', 2); // Should be Lola Ziems and Randi Seago
        cy.get('[data-cy="last-name-filter"]').type('z');
        cy.get('tbody').find('tr').should('have.length', 1); // Should be Lola Ziems
    });

    it('should update paging controls when global filtering is applied', () => {
        mount({
            template: `<base-table current-page="1" per-page="10">
                <div slot="default" slot-scope="scope">
                    <search-input v-model="scope.filter.value" data-cy="search-input"></search-input>
                    <page-size-select v-model="scope.perPage.value"></page-size-select>
                    <b-table v-bind:items="items" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value" :filter="scope.filter.value"></b-table>
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
        cy.get('table > tbody').find('tr').should('have.length', 10);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 10 of 26 entries');
        cy.get('.page-link').should('have.length', 7); // 7 length = 2 previous buttons + 3 page buttons + 2 next buttons

        cy.get('[data-cy="search-input"]').type('a');
        cy.get('table > tbody').find('tr').should('have.length', 1);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 1 of 1 entries');
    });

    it('should update paging controls when column filtering is applied', () => {
        mount({
            template: `<base-table current-page="1" per-page="5">
                <div slot="default" slot-scope="scope">
                    <page-size-select v-model="scope.perPage.value"></page-size-select>
                    <b-table v-bind:items="items" v-bind:fields="fields" v-bind:per-page="scope.perPage.value" v-bind:current-page="scope.currentPage.value" :filter="scope.columnFilter" :filter-function="scope.columnFilterFunc">
                        <template #head(isActive)="data">
                            {{ data.label }}
                            <b-form-select v-model="data.field.filter.model" size="sm" :options="data.field.filter.selectOptions" data-cy="active-filter"></b-form-select>
                        </template>
                        <template #head(age)="data">
                            {{ data.label }}
                            <b-form-select v-model="data.field.filter.model" size="sm" :options="data.field.filter.selectOptions" data-cy="age-filter"></b-form-select>
                        </template>
                        <template #head(first_name)="data">
                            {{ data.label }}
                            <b-form-input v-model="data.field.filter.model" placeholder="Searchie" size="sm" autocomplete="off" data-cy="first-name-filter"></b-form-input>
                        </template>
                        <template #head(last_name)="data">
                            {{ data.label }}
                            <b-form-input v-model="data.field.filter.model" placeholder="Searchie" size="sm" autocomplete="off" data-cy="last-name-filter"></b-form-input>
                        </template>
                    </b-table>
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
                    fields: [
                        {
                            key: 'isActive',
                            filter: {
                                model: null,
                                type: 'select',
                                selectOptions: [{ text: 'All', value: null }, true, false]
                            }
                        },
                        {
                            key: 'age',
                            filter: {
                                model: null,
                                type: 'select',
                                selectOptions: [{ text: 'All', value: null }, ...Array.from(new Set(basicItems.map(i => i.age))).sort()]
                            }
                        },
                        {
                            key: 'first_name',
                            filter: { model: null }
                        },
                        {
                            key: 'last_name',
                            filter: { model: null }
                        },
                    ],
                    items: [...basicItems, ...basicItems, ...basicItems],
                }
            },
        }, { extensions });

        cy.get('.pagination-info').should('be.visible');
        cy.get('table > tbody').find('tr').should('have.length', 5);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 5 of 9 entries');
        cy.get('.page-link').should('have.length', 6); // 6 length = 2 previous buttons + 2 page buttons + 2 next buttons

        cy.get('[data-cy="last-name-filter"]').type('z');
        cy.get('table > tbody').find('tr').should('have.length', 3);
        cy.get('.pagination-info').should('contain.text', 'Showing 1 to 3 of 3 entries');
    });
});
