import { BaseEntity } from './entity.base';

/**
 * Base element, which contains base logic and interaction with all the specific elements.
 * Parent element for all specific web elements that are user in Page Object model.
 */
export class BaseElement extends BaseEntity {
  /**
   * Locator of base element, the same one which is user when calling:
   * cy.get(${locator});
   */
  private _locator: string;

  /**
   * Value that tracks if element should be located by xpath or not
   * False by default
   */
  private _isXPath: boolean;

  /**
   * Creates an instance of base element.
   * @param entityName {string} A name of web element (Login Button, Email Textbox etc.)
   * @param locator {string} Locator to get an element
   * @param isXPath {boolean} Flag if element should be located by XPath
   */
  constructor(entityName: string, locator: string, isXPath = false) {
    super(entityName);
    this._locator = locator;
    this._isXPath = isXPath;
  }

  /**
   * Locator getter
   */
  get locator() {
    return this._locator;
  }

  /**
   * Gets whether as cy chainable
   */
  get _asCyChainable() {
    return cy.get(this.locator);
  }

  /**
   * Gets instance to operate with it in child elements
   * @param [object] - a list of options that can be passed to locate and get an element
   * See https://docs.cypress.io/api/commands/get#Arguments
   * @returns cy.chainable instance
   */

  getInstance(options: object | null = null) {
    if (options === null) {
      return cy
        .waitUntil(
          () =>
            cy
              .get(this.locator)
              .as('thisElement')
              .wait(10) // for some reason this is needed, otherwise next line returns `true` even if click() fails due to detached element in the next step
              .then(($el) => Cypress.dom.isAttached($el)),
          { timeout: 1000, interval: 10 },
        )
        .get('@thisElement');
    }
    return cy
      .waitUntil(
        () =>
          cy
            .get(this.locator, options)
            .as('thisElement')
            .wait(10) // for some reason this is needed, otherwise next line returns `true` even if click() fails due to detached element in the next step
            .then(($el) => Cypress.dom.isAttached($el)),
        { timeout: 1000, interval: 10 },
      )
      .get('@thisElement', options);
  }

  /**
   * Checks if the element exists
   * @returns boolean
   */
  doesElementExist() {
    return cy.get('html').then((html) => {
      return html.find(this.locator).length !== 0;
    });
  }

  /**
   * Clicks base element
   */
  click(options: object | null = null) {
    this.assertExists();
    return options === null
      ? this.getInstance().click(options)
      : this.getInstance().click();
  }

  /**
   * Hovers over element
   */
  hover() {
    this.getInstance().trigger('mouseover', { force: true });
  }

  /**
   * Returns a boolean indicating whether an element is ATTACHED to the DOM
   */
  assertIsAttached() {
    return this.getInstance().then(($el) => {
      expect(Cypress.dom.isAttached($el)).to.be.true;
    });
  }

  /**
   * Returns a boolean indicating whether an element is DETACHED from the DOM
   */
  assertIsDetached() {
    return this.getInstance().then(($el) => {
      expect(Cypress.dom.isDetached($el)).to.be.true;
    });
  }

  /**
   * Asserts if element is visible on page
   */
  assertIsVisible() {
    this.getInstance().should('be.visible');
  }

  /**
   * Asserts if element is not visible on page
   */
  assertNotVisible() {
    this.getInstance().should('not.be.visible');
  }

  /**
   * Asserts if invalid data element / border is presented corrected
   */
  assertShownAsInvalid() {
    const baseStyle =
      'w-full text-sm focus:outline-none leading-5 rounded border';
    this.getInstance().should(
      'have.class',
      `${baseStyle} border-danger-600 focus:border-danger-600 focus:ring focus:ring-danger-600/20`,
    );
  }

  /**
   * Asserts if element exists
   */
  assertExists() {
    this.getInstance().should('exist');
  }

  /**
   * Asserts if element does not exist
   */
  assertDoesNotExist() {
    cy.waitUntil(() => {
      return Cypress.$(this.locator).length == 0;
    });
    cy.get(this.locator).should('not.exist');
  }

  /**
   * Asserts if element is enabled
   */
  assertIsEnabled() {
    this.logger.step(`Checking that [${this.entityName}] element is enabled`);
    this.getInstance().should('be.enabled');
  }

  /**
   * Asserts if element is disabled
   */
  assertIsDisabled() {
    this.logger.step(`Checking that [${this.entityName}] element is disabled`);
    this.getInstance().should('be.disabled');
  }

  /**
   * Asserts if element contains specific content which can be found with reg exp
   * @param regexp {RegExp} Pattern to search inside element
   */
  assertContainsRegExp(regexp: RegExp) {
    this.getInstance().contains(regexp);
  }

  /**
   * Asserts if element has text
   * @param text {string} Text to search inside element
   */
  assertHasText(text: string) {
    this.getInstance().should('have.text', text);
  }

  /**
   * Asserts if element contains text within a string
   * @param text {string} Text to search inside element
   */
  assertContainsText(text: string) {
    this.getInstance().should('contain.text', text);
  }

  /**
   * Asserts if element has value
   * @param value {any} Value to search inside element
   */
  assertHasValue(value) {
    this.getInstance().should('have.value', value);
  }

  /**
   * Asserts if element contains visible text
   * @param text {string} Text to search inside element
   */
  assertTextIsVisible(text: string, matchCase?) {
    this.getInstance().contains(text, matchCase).should('be.visible');
  }

  /**
   * Asserts if element doesn't contains text
   * @param text {string} Text that should not exist in element
   */
  assertNotContainsText(text: string) {
    this.getInstance().should('not.contain', text);
  }

  /**
   * Asserts if length of obtained elements is equal to specific number
   * @param length {number} Expected amount of elements found with passed locator
   */
  assertLengthIs(length: number) {
    this.getInstance().should('have.length', length);
  }

  /**
   * Asserts if length of obtained elements is equal to specific number
   * @param length {number} Expected amount of elements found with passed locator
   */
  assertLengthIsAtLeast(length: number) {
    this.getInstance().should('have.length.at.least', length);
  }

  /**
   * Gets value of web element
   * @returns value {string} A value of element
   */
  getValue() {
    return this.getInstance().invoke('val');
  }

  /**
   * Gets text of web element
   * @returns value {string} A text inside element
   */
  getText() {
    return this.getInstance().invoke('text');
  }

  /**
   * Checks an elements attribute
   * returns result
   */
  assertElementHasAttribute(text: string) {
    return this.getInstance().should('have.attr', text);
  }

  /**
   * Checks an element with value attribute has expected value
   * returns result
   */
  assertAttributeEqualsValue(attribute: string, value: string) {
    return this.getInstance().invoke('attr', attribute).should('eq', value);
  }
}
