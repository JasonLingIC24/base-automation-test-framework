import { BaseElement } from "../base/element.base";

/**
 * Implementation of list items element
 */
export class ListItems extends BaseElement {
  private _itemLocator: string;

  constructor(
    entityName: string,
    listLocator: string,
    itemLocator: string = "li"
  ) {
    super(entityName, listLocator);
    this._itemLocator = itemLocator;
  }
  /**
   * Gets all list items
   */
  getAllItems() {
    return this.getInstance().children(this._itemLocator);
  }

  /**
   * Gets item from list by its index or containing text
   * @param text {String} Text to search in item
   * @param index {number} Index of item
   * @param options {object} Cypress options object to change the default behavior
   */
  getItem(index: number);
  getItem(text: string, options?: object);
  getItem(itemPointer: unknown, options?: object) {
    if (typeof itemPointer == "number") {
      return this.getAllItems().eq(itemPointer);
    }
    return this.getInstance().contains(
      this._itemLocator,
      itemPointer as string,
      options
    );
  }

  /**
   * Asserts if actual list length match expected Length
   * @param expectedLength {number} Expected list length
   */
  assertListLength(expectedLength: number) {
    return this.getAllItems().should("have.length", expectedLength);
  }

  /**
   * Gets list item which contains the text
   * @param text {String} Text to search inside of a list
   */
  getLiContainsText(text: string, options: object | null = null) {
    if (options === null) {
      return this.getInstance().contains(this._itemLocator, text);
    }
    return this.getInstance().contains(this._itemLocator, text, options);
  }
}
