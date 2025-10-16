import { BaseElement } from '../base/element.base';

/**
 * Abstract class that contains base logic for both usual and secure text boxes
 */
export abstract class TB extends BaseElement {
  /**
   * Clears textbox value
   */
  clear() {
    return this.getInstance().clear();
  }

  /**
   * Asserts if element is empty
   */
  assertIsEmpty() {
    this.getInstance().should('be.empty');
  }

  assertIsNotEmpty() {
    this.getInstance().should('not.be.empty');
  }

  /**
   * Types text into text box
   * @param text {String} Text to type
   */
  type(text: string) {
    this.assertExists();
    return this.getInstance().type(text);
  }
}

/**
 * Implementation of text box element
 */
export class TextBox extends TB {}

/**
 * Implementation of secure text box
 * Should be used when we're working with fields that may contain secure data / secrets (password field, sensitive data etc.)
 */
export class SecureTextBox extends TB {
  /**
   * Types text into secure text box
   * Logging of action (and the value typed) is disabled
   * @param text {String} Text that may contain secret information and should be hidden from the logs
   */
  type(text: string) {
    this.assertExists();
    return this.getInstance().type(text, { log: false });
  }
}
