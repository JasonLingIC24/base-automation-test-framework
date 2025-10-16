export default class Logger {
  private entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  step(message: string) {
    cy.log('');
    cy.log('--- [STEP] ---');
    cy.log(`--- [${this.entityName}] ${message}`);
    cy.log('');
  }

  debug(message: string) {
    console.log(`[${this.entityName}] ${message}`);
  }
}
