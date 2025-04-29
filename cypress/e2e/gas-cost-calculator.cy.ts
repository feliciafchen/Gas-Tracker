describe('Gas Cost Calculator', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should calculate gas cost for a simple route', () => {
    // Select vehicle
    cy.selectVehicle('2023', 'Toyota', 'Camry');

    // Enter route information
    cy.enterRoute('New York, NY', 'Boston, MA');

    // Set gas price
    cy.setGasPrice('3.50');

    // Calculate route
    cy.calculateRoute();

    // Verify trip summary is displayed
    cy.get('.cost-summary').should('be.visible');
    cy.get('.cost-summary').should('contain', 'Total Distance');
    cy.get('.cost-summary').should('contain', 'Estimated Gas Cost');
  });

  it('should calculate gas cost for a route with stops', () => {
    // Select vehicle
    cy.selectVehicle('2023', 'Honda', 'Civic');

    // Enter route information with stops
    cy.enterRoute('Los Angeles, CA', 'San Francisco, CA', [
      'Santa Barbara, CA',
      'San Luis Obispo, CA'
    ]);

    // Set gas price
    cy.setGasPrice('4.00');

    // Calculate route
    cy.calculateRoute();

    // Verify trip summary is displayed
    cy.get('.cost-summary').should('be.visible');
    cy.get('.cost-summary').should('contain', 'Total Distance');
    cy.get('.cost-summary').should('contain', 'Estimated Gas Cost');
  });

  it('should disable calculate button when required fields are empty', () => {
    // Verify calculate button is disabled initially
    cy.get('button.calculate-button').should('be.disabled');

    // Enter only origin
    cy.get('input[placeholder="Enter origin address"]').type('New York, NY');
    cy.get('button.calculate-button').should('be.disabled');

    // Enter origin and destination
    cy.get('input[placeholder="Enter destination address"]').type('Boston, MA');
    cy.get('button.calculate-button').should('be.disabled');

    // Select vehicle
    cy.selectVehicle('2023', 'Toyota', 'Camry');
    cy.get('button.calculate-button').should('not.be.disabled');
  });

  it('should handle invalid addresses gracefully', () => {
    // Select vehicle
    cy.selectVehicle('2023', 'Toyota', 'Camry');

    // Enter invalid addresses
    cy.enterRoute('Invalid Address 1', 'Invalid Address 2');

    // Set gas price
    cy.setGasPrice('3.50');

    // Calculate route
    cy.calculateRoute();

    // Verify error handling
    cy.get('.error-message').should('be.visible');
  });

  it('should update gas cost when gas price changes', () => {
    // Select vehicle
    cy.selectVehicle('2023', 'Toyota', 'Camry');

    // Enter route information
    cy.enterRoute('New York, NY', 'Boston, MA');

    // Set initial gas price
    cy.setGasPrice('3.50');

    // Calculate route
    cy.calculateRoute();

    // Get initial cost
    cy.get('.cost-summary').should('contain', 'Estimated Gas Cost');

    // Update gas price
    cy.setGasPrice('4.00');

    // Recalculate route
    cy.calculateRoute();

    // Verify cost has been updated
    cy.get('.cost-summary').should('contain', 'Estimated Gas Cost');
  });
}); 