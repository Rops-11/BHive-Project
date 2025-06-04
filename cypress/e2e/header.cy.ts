describe("Header Component", () => {
    beforeEach(() => {
        cy.viewport(1280, 800);
        cy.visit("/"); // Update this path if Header is not on the home page
    });

    it("shows desktop navigation links", () => {
        cy.contains("Home").should("be.visible");
        cy.contains("Facilities").should("be.visible");
        cy.contains("Rooms").should("be.visible");
        cy.contains("Book").should("be.visible");

        cy.get('img[alt="Bhive Hotel Logo"]').should("be.visible");
    });

    it("shows the mobile hamburger icon and logo on small screens", () => {
        cy.viewport("iphone-x");
        cy.visit("/");

        cy.get('img[alt="Bhive Hotel Mobile Logo"]').should("be.visible");
        cy.get("button").find("svg").should("exist");
    });

    
});
