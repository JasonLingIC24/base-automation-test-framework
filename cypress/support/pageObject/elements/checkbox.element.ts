import { BaseElement } from "../base/element.base";

/**
 * Abstract class that contains logic for checkboxes and radio buttons
 */

export abstract class CB extends BaseElement {
  /**
   * Ticks checkbox
   */
  check() {
    this.assertExists();
    this.getInstance().check();
  }

  /**
   * Untick checkbox
   */

  uncheck() {
    this.getInstance().uncheck();
  }

  /**
   * Confirms checkbox is not checked
   */
  assertNotBeChecked() {
    return this.getInstance().should("not.be.checked");
  }

  /**
   * Confirms checkbox is checked
   */

  assertBeChecked() {
    return this.getInstance().should("be.checked");
  }
}
/**
 * Implementation of checkbox element
 */
export class Checkbox extends CB {}
