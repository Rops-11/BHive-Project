declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to delete a registered user by their identifier.
       * @example cy.deleteRegisteredUser('test@example.com')
       */
      deleteBookings(): Chainable<void>; // Or Chainable<any> or Chainable<Response<any>> if it returns something

      // Add other custom commands here if you have them:
      // login(email: string, password: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    }
    // If your command overwrites an existing one, you might not need a new entry
    // but ensure the signature matches if you're changing it.
    // interface Chainable {
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    // }
  }
}

// Make sure this file is treated as a module.
// An empty export statement can achieve this if there are no other exports.
export {};