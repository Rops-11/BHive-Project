
/// <reference types="cypress" />

describe('Login With Google Page', () => {
  beforeEach(() => {
    cy.visit('/auth'); 
  });

  it('should display the logo, title, description, and Google sign-in button', () => {
    // Logo
    cy.get('img[alt="BHive Logo"]').should('be.visible');

    // Title
    cy.contains('Welcome Back!').should('be.visible');

    // Description
    cy.contains('Sign in with your Google account to continue.').should('be.visible');

    // Sign In Button
    cy.contains('Sign In With Google').should('be.visible');
  });


  //calls to mock google sign-in action
  it('should trigger the sign-in form action on click', () => {
    cy.intercept('POST', '/api/auth/callback').as('googleAuth');

    cy.contains('Sign In With Google').click();
  });

  it('should display current year in the footer', () => {
    const currentYear = new Date().getFullYear().toString();
    cy.get('footer').should('contain.text', currentYear);
  });

  it ('should have a responsive design', () => {
    cy.viewport('iphone-x'); 
    cy.get('img[alt="BHive Logo"]').should('be.visible');
    cy.contains('Welcome Back!').should('be.visible');
    cy.contains('Sign in with your Google account to continue.').should('be.visible');
    cy.contains('Sign In With Google').should('be.visible');
  });
});
