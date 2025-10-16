import { BaseElement } from '../base/element.base';
import { TextBox } from './textbox.element';
import { Label } from './label.element';

/**
 * Abstract class that contains base logic for both static and dynamic dropdowns
 */

export abstract class Dropdown extends BaseElement {
  private _optionsLocator: string;
  private _inputBar: Label | TextBox;

  constructor(
    entityName: string,
    elementFieldLocator: string,
    optionsLocator: string,
    inputBar: Label | TextBox,
    isXPath = false,
  ) {
    super(entityName, elementFieldLocator, isXPath);
    this._optionsLocator = optionsLocator;
    this._inputBar = inputBar;
  }

  /**
   * Selects specific option from dropdown list
   * @param listOption {String} Value of option that should be selected
   */
  select(
    listOption: string,
    matchCase = { matchCase: true },
    forceClick = { force: true },
  ) {
    this.inputBarElem.assertExists();
    this.getInputBarInstance().click(forceClick);
    cy.contains(this._optionsLocator, listOption, matchCase);
    cy.get(this._optionsLocator)
      .contains(listOption, matchCase)
      .click(forceClick);
  }

  /**
   * Gets input bar element
   */
  get inputBarElem() {
    return this._inputBar;
  }

  /**
   * Gets instance of input bar element
   */
  getInputBarInstance() {
    return this.inputBarElem.getInstance();
  }

  /**
   * Getter for options locator
   */
  get optionsLocator(): string {
    return this._optionsLocator;
  }

  /**
   * Checks if provided values are present in the dropdown
   * @param values {string[]} Values that should be present
   */
  verifyValuesArePresent(values: string[]) {
    this.getInputBarInstance().click({ force: true });
    values.forEach((value) => {
      cy.contains(this.optionsLocator, value).should('have.length', 1);
    });
    return this;
  }

  /**
   * Checks if dropdown input field is empty
   */
  verifyInputIsEmpty() {
    this.inputBarElem.getInstance().should('be.empty');
    return this;
  }
}

/**
 * Implementation of static dropdown element
 */
export class StaticDropdown extends Dropdown {}

/**
 * Implementation of dynamic dropdown element
 */
export class DynamicDropdown extends Dropdown {
  private _dropdownContentLocator: string;

  constructor(
    entityName: string,
    elementFieldLocator: string,
    optionsLocator: string,
    inputBar: Label | TextBox,
    dropdownContentLocator: string,
  ) {
    super(entityName, elementFieldLocator, optionsLocator, inputBar);
    this._dropdownContentLocator = dropdownContentLocator;
  }

  /**
   * Getter for dropdown content list locator
   */
  get dropdownContentLocator() {
    return this._dropdownContentLocator;
  }

  /**
   * Gets dropdown content list option which contains the text
   * @param text {String} Text to search inside dropdown content option
   */
  getDropdownOptionWithText(text: string) {
    this.verifyShowsMessage(text);
    return cy
      .get(this._dropdownContentLocator)
      .contains(this.optionsLocator, text);
    //
  }

  /**
   * Checks if dropdown content area contains the warning message
   * @param text {String} Text that should exist inside dropdown content area
   */
  verifyShowsMessage(text: string) {
    cy.get(this.dropdownContentLocator).should('contain.text', text);
    return this;
  }

  /**
   * Checks if the amount of search results matches target value
   * @param expectedAmount {number} Target amount of search options in dropdown content
   */
  checkResultsQuantityWithText(expectedAmount: number, text: string) {
    cy.get(this.optionsLocator)
      .should('have.length', expectedAmount)
      .each(($searchOption) => {
        cy.wrap($searchOption)
          .contains(text, { matchCase: false })
          .should('exist');
      });
    return this;
  }

  /**
   * Checks if the amount of search results matches target value
   * @param expectedAmount {number} Target amount of search options in dropdown content
   */
  checkResultsQuantity(expectedAmount: number) {
    cy.get(this._dropdownContentLocator)
      .find(this.optionsLocator)
      .should(($elem) => {
        expect($elem).to.have.length(expectedAmount);
      });
    return this;
  }

  /**
   * Get amount of search results
   */
  getResultsQuantity() {
    return cy.get(this._dropdownContentLocator).then((elements) => {
      return elements.length;
    });
  }

  /**
   * Checks if all search results contain the text
   * @param text {String} Text to search inside options of dropdown content
   */
  verifyAllResultsContain(text: string) {
    this.verifyShowsMessage(text);

    cy.get(this._dropdownContentLocator)
      .find(this.optionsLocator)
      .each(($elem) => {
        cy.wrap($elem).contains(text, { matchCase: false });
      });
    return this;
  }
}
