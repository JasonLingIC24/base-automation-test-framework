import { Button } from "./button.element";
import { CB } from "./checkbox.element";

/**
 * Implementation of radio button element (a group of buttons)
 */
export class RadioButton extends CB {
  /**
   * Creates an instance of radio button by name of the button group.
   * @param entityName {String} Element name
   * @param radioButtonName {string} Name of button group which is used to generate locator by name
   */
  constructor(entityName: string, radioButtonName: string) {
    const locator = `${radioButtonName}`;
    super(entityName, locator);
  }

  /**
   * Presses specific button from the radio group
   * @param [value] {string} Value of button on which click should be performed
   */
  check(value?: string) {
    const btn = new Button(
      `[${value}] Radio Option`,
      `${this.locator}${value ? `[value="${value}"]` : ""}`
    );
    btn.getInstance().parent("label").click();
  }

  /**
   * Confirms radio button is not checked
   */
  assertRadioNotBeChecked() {
    return this.getInstance().should("not.be.checked");
  }

  /**
   * Confirms radio button is checked
   */

  assertRadioBeChecked() {
    return this.getInstance().should("be.checked");
  }
}
