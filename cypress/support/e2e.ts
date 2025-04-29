import '@testing-library/cypress/add-commands';

// Custom command to select a vehicle
Cypress.Commands.add('selectVehicle', (year: string, make: string, model: string) => {
  cy.get('select#year').select(year);
  cy.get('select#make').select(make);
  cy.get('select#model').select(model);
});

// Custom command to enter route information
Cypress.Commands.add('enterRoute', (origin: string, destination: string, stops: string[] = []) => {
  cy.get('input[placeholder="Enter origin address"]').type(origin);
  cy.get('input[placeholder="Enter destination address"]').type(destination);
  
  stops.forEach((stop, index) => {
    cy.get('button.add-stop').click();
    cy.get(`input[placeholder="Stop ${index + 1}"]`).type(stop);
  });
});

// Custom command to set gas price
Cypress.Commands.add('setGasPrice', (price: string) => {
  cy.get('input#gasPrice').clear().type(price);
});

// Custom command to calculate route
Cypress.Commands.add('calculateRoute', () => {
  cy.get('button.calculate-button').click();
});

// Add TypeScript types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      selectVehicle(year: string, make: string, model: string): Chainable<void>;
      enterRoute(origin: string, destination: string, stops?: string[]): Chainable<void>;
      setGasPrice(price: string): Chainable<void>;
      calculateRoute(): Chainable<void>;
    }
  }
} 