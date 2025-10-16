import { BaseElement } from "../base/element.base";

/**
 * Implementation of toggle element
 */

export abstract class TG extends BaseElement {
  /**
   * Moves toggle
   */
  toggle() {
    this.assertExists();
    this.getInstance().click();
  }

  /**
   * Confirms that the toggle is set to "false"
   */
  assertToggleSetToFalse() {
    return this.getInstance()
      .invoke("attr", "aria-checked")
      .should("eq", "false");
  }

  /**
   * Confirms that the toggle is set to "true"
   */
  assertToggleSetToTrue() {
    return this.getInstance()
      .invoke("attr", "aria-checked")
      .should("eq", "true");
  }
}
/**
 * Implementation of toggle element
 */
export class Toggle extends TG {}
