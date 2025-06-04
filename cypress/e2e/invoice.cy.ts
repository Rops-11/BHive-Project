/// <reference types="cypress" />
import 'cypress-file-upload';

describe("InvoiceCard Component", () => {
  beforeEach(() => {
    // Mock API responses with booking details
    cy.intercept("POST", "/api/booking/check-room-availability", {
      statusCode: 200,
      body: { isAvailable: true },
    }).as("checkAvailability");

    cy.intercept("POST", "/api/booking/create-booking", req => {
      cy.log("Intercepted createBooking request", req); // Debugging log
      req.reply({
        statusCode: 200,
        body: {
          id: "mock-booking-id",
          details: {
            guestName: "Sheree",
            roomType: "Deluxe",
            checkInDate: "2025-06-10",
            checkOutDate: "2025-06-15",
            paymentType: "Partial",
          },
        },
      });
    }).as("createBooking");

    cy.intercept("POST", "/api/utils/getRoomsAvailableThisDate", {
      statusCode: 200,
      body: { rooms: [{ type: "Deluxe", id: 101 }] }, // Ensuring `rooms` is an array
    }).as("getRooms");

    // Visit booking page with increased timeout
    cy.visit("/book/invoice", { timeout: 15000 });

    // Ensure API calls complete
    cy.wait("@getRooms");
  });

  it("shows booking summary and proceeds with valid data", () => {
    // Trigger the booking creation request before waiting for it
    cy.contains("Confirm & Proceed").click();
    cy.wait("@createBooking", { timeout: 15000 });

    // Verify booking summary is loaded
    cy.get("body").should("contain.text", "Booking Summary");

    // Ensure file input exists before interacting
    cy.get("input[type='file']", { timeout: 10000 })
      .should("exist")
      .should("be.visible")
      .attachFile("proof.jpg");

    // Debugging: Ensure select dropdown appears
    cy.get("body").then($body => {
      if ($body.find("select[name='paymentType']").length > 0) {
        cy.log("Select paymentType found");
      } else {
        cy.log("Select paymentType NOT found");
      }
    });

    // Wait for payment type select and ensure correct options exist
    cy.get("select[name='paymentType']", { timeout: 15000 })
      .should("exist")
      .should("be.visible");

    cy.get("select[name='paymentType'] option").then(options => {
      const values = [...options].map(o => (o as HTMLOptionElement).value);
      cy.log("Available paymentType options: " + values.join(", "));
    });

    // Select valid payment type
    cy.get("select[name='paymentType']").select("Partial");

    // Click confirm button and ensure API calls complete successfully
    cy.contains("Confirm & Proceed").click();
    cy.wait("@checkAvailability");
    cy.wait("@createBooking");

    // Verify success messages
    cy.contains("Booking successful!");
    cy.contains("Redirecting you shortly...");
  });
});