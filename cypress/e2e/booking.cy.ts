/// <reference types="cypress" />

describe("testing e2e testing for booking", () => {
  it("should pick a room in the landing page and book", () => {
    cy.viewport(1280, 720);
    cy.visit("/");


    cy.contains(
      "The first industrial concept hotel in Iloilo with charming ambiance."
    ).should("be.visible");

    cy.wait(7000);

    cy.get(".border-input").click();

    cy.contains("4B - Queen").click();

    cy.get(".mt-3 > .inline-flex").click();

    cy.wait(5000);

    cy.get("input[placeholder='Full Name']").type("John Rofer Casio");
    cy.get("input[placeholder='Mobile Number (e.g., 09XXXXXXXXX)']").type(
      "09123123123"
    );
    cy.get("input[placeholder='your.email@example.com']").type(
      "jrofer.casio11@gmail.com"
    );
    cy.get("input[id='adult']").type("1");
    cy.get("input[id='children']").type("1");
    cy.get("#terms").click();

    cy.get(".bg-primary").click();

    cy.wait(5000);

    cy.contains("Name: John Rofer Casio").should("be.visible");
    cy.contains("Mobile: 09123123123").should("be.visible");
    cy.contains("Email: jrofer.casio11@gmail.com").should("be.visible");
    cy.contains("Adults: 1").should("be.visible");
    cy.contains("Children: 1").should("be.visible");

    cy.get('[for="r1"]').click();

    const image = "cypress/fixtures/SE LOGO.jpg";

    cy.get('input[type="file"]').selectFile(image, { force: true });

    cy.get(".justify-end > .inline-flex").click();

    cy.wait(10000);

    cy.location("pathname", { timeout: 10000 }).should("eq", "/");

    cy.task("deleteLatestBooking");
  });

  // it("should go to book page to book", () => {
  //   cy.viewport(1280, 720);

  //   cy.visit("/");

  //   cy.contains("Book").click();

  //   cy.get("input[placeholder='Full Name']").type("John Rofer Casio");
  //   cy.get("input[placeholder='Mobile Number (e.g., 09XXXXXXXXX)']").type(
  //     "09123123123"
  //   );
  //   cy.get("input[placeholder='your.email@example.com']").type(
  //     "jrofer.casio11@gmail.com"
  //   );
  //   cy.contains("Choose Your Room").click();
  //   cy.contains("201 - Single Standard").click({
  //     force: true,
  //   });

  //   cy.get("input[id='adult']").type("1");
  //   cy.get("input[id='children']").type("1");
  //   cy.get("#terms").click();

  //   cy.get(".bg-primary").click();

  //   cy.wait(5000);

  //   cy.task("deleteLatestBooking");
  // });
});
