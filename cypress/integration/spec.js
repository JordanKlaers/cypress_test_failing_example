	/// <reference types="cypress" />
import App from '../App.svelte';
import mount from 'cypress-svelte-unit-test';

describe('App component', () => {
	beforeEach(() => {
		mount(App)
	})
	it('contains a div that has "goodnight moon"', () => {
		cy.contains('div', 'Goodnight moon');
	})
})