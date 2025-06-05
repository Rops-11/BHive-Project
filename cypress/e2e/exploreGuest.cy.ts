/// <reference types="cypress" />

describe("explore all the pages", () => {
  it("should check all the data in the landing page", () => {
    cy.viewport(1280, 720);

    cy.visit("/");
    cy.intercept(
      "POST",
      "http://localhost:3000/api/utils/getRoomsAvailableThisDate"
    ).as("getRoomsAvailableThisDate");

    cy.scrollTo("bottom", { duration: 1000 });

    cy.wait("@getRoomsAvailableThisDate").then((interception) => {
      expect(interception.response?.statusCode).to.be.eq(200);
    });

    cy.contains(
      "The first industrial concept hotel in Iloilo with charming ambiance."
    )
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.get(".bottom-5 > .bg-white")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible"); // BookRoom.tsx

    cy.contains("Our Facilities")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains(
      "Indulge in exceptional experiences throughout our carefully curated spaces"
    )
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Benitos Cafe & Restaurant").should("be.visible");
    cy.contains("Rooms").should("be.visible");
    cy.contains("Bplace sunset bar").should("be.visible");

    cy.contains("Bhive Hotel")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Central Location")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Feels like Home").should("be.visible");

    // checks both the carousel and the hexagon images
    cy.get(".w-full.relative > .flex > :nth-child(1) > .object-cover").should(
      "be.visible"
    );
    cy.get(".w-full.relative > .flex > :nth-child(2) > .object-cover").should(
      "be.visible"
    );
    cy.get(".w-full.relative > .flex > :nth-child(3) > .object-cover").should(
      "be.visible"
    );

    cy.contains("© 2025 Bhive Dev team | All rights reserved")
      .scrollIntoView({
        duration: 1000,
      })
      .should("be.visible");

    cy.scrollTo("top", { duration: 1000 });
  });

  it("should go to facilities and check the page", () => {
    cy.viewport(1280, 720);
    cy.visit("/");

    cy.contains("Facilities").click();

    cy.location("pathname", { timeout: 10000 }).should("eq", "/facilities");

    cy.scrollTo("bottom", { duration: 1000 });

    cy.contains("Facilities at Bhive Hotel")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("All the things you need are here.")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Facilities and Amenities")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains(
      "Step into a haven of comfort and calm where nature and hospitality meet. Enjoy organic blends and baked treats at our earthy café, or unwind in the gentle hum of conversation at the rooftop bar, surrounded by greenery and soft lighting. Our cozy lounge, filled with natural textures and warm tones, invites you to pause, breathe, and feel at home. Whether you're journaling with a cup of tea or sharing stories with fellow travelers, each space is crafted to soothe the senses and nurture a sense of belonging."
    )
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Free High-Speed Wi-Fi")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains("24/7 Room Service")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains("Complimentary Breakfast")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains("Daily Housekeeping")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains("On-Site Parking")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");
    cy.contains("In-Room Smart TV")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("© 2025 Bhive Dev team | All rights reserved")
      .scrollIntoView({
        duration: 1000,
      })
      .should("be.visible");

    cy.scrollTo("top", { duration: 1000 });
  });

  it("should go to the rooms page and check the page out", () => {
    cy.viewport(1280, 720);
    cy.visit("/rooms");

    cy.intercept("GET", "http://localhost:3000/api/room").as("getAllRooms");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/rooms");

    cy.wait("@getAllRooms").then((interception) => {
      expect(interception.response?.statusCode).to.be.eq(200);
    });

    cy.scrollTo("bottom", { duration: 1000 });

    cy.contains("Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains(
      "Step into our beehive-inspired haven, where every room is a cozy cell in a vibrant hive. Discover unique spaces designed for comfort, connection, and an appreciation of beehive-inspired design."
    )
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Single Deluxe Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Single Standard Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Twin Bee Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Queen Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Suite Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("Family Suite Rooms")
      .scrollIntoView({ duration: 1000 })
      .should("be.visible");

    cy.contains("© 2025 Bhive Dev team | All rights reserved")
      .scrollIntoView({
        duration: 1000,
      })
      .should("be.visible");

    cy.scrollTo("top", { duration: 1000 });
  });

  it("should go to the book page and check the page out", () => {
    cy.viewport(1280, 720);
    cy.visit("/book");

    cy.intercept(
      "POST",
      "http://localhost:3000/api/utils/getRoomsAvailableThisDate"
    ).as("getRoomsAvailableThisDate");

    cy.wait("@getRoomsAvailableThisDate").then((interception) => {
      expect(interception.response?.statusCode).to.be.eq(200);
    });

    cy.location("pathname", { timeout: 10000 }).should("eq", "/book");

    cy.contains("Book Your Hotel").should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("Mobile Number").should("be.visible");
    cy.contains("Email Address").should("be.visible");
    cy.contains("Time of Stay").should("be.visible");
    cy.contains("Available Rooms").should("be.visible");
    cy.contains("Adults").should("be.visible");
    cy.contains("Children").should("be.visible");

    cy.get("#terms").should("be.visible");

    cy.contains("Room Preview").should("be.visible");

    cy.contains(
      "Select a room from the form on the left to see its details and images here."
    ).should("be.visible");
  });
});
