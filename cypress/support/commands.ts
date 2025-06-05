/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

/**
 * Custom command to perform a delete action.
 * Example usage: cy.deleteRegisteredUser('testuser@example.com')
 * You'll likely want to make this more specific, e.g., cy.deleteUserByEmail(email)
 * or cy.deleteItem(itemId)
 */
// Cypress.Commands.add("deleteBookings", () => {
// });


// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// It's good practice to export something to make this a module
// if you're not already importing/exporting other things.
// This helps TypeScript treat it as a module for augmentation.
export {};