import { BaseElement } from '../base/element.base';

/**
 * Implementation of select element
 */
export class Select extends BaseElement {
  /**
   * Selects specific option from select group
   * @param option {String} Value of option that should be selected
   */
  select(option: string) {
    this.assertExists();
    this.getInstance().select(option);
  }
}
