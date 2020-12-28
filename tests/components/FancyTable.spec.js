/// <reference types="cypress" />
import Vue from 'vue';
import '@/plugins/bootstrap-vue';
import { mount } from '@cypress/vue';
import BaseTable from '@/components/fancy-tables/base-table';
import PageSizeSelect from '@/components/fancy-tables/PageSizeSelect';
Vue.component('base-table', BaseTable);
Vue.component('page-size-select', PageSizeSelect);

describe('Fancy Tables', () => {
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

    it.only('should render the page size', () => {
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
});
