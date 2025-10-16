import { BaseElement } from "../base/element.base";

/**
 * Implementation of table element
 */
export class Table extends BaseElement {
  /**
   * Clicks element within the table which contains the text
   * @param text {String} Text to search inside element
   */
  clickElementContainsText(element: string, text: string, options?: object) {
    this.getInstance().contains(element, text, options);
    this.getInstance().contains(element, text, options).scrollIntoView();
    this.getInstance().contains(element, text, options).click();
  }

  /**
   * Gets table cell which contains the text
   * @param text {String} Text to search inside cell
   */
  getTdContainsText(text: string, options: object | null = null) {
    if (options === null) {
      return this.getInstance().contains("td", text);
    }
    return this.getInstance().contains("td", text, options);
  }

  /**
   * Gets table body rows
   */
  getTableBodyRows() {
    return this.getInstance().find("tbody tr");
  }

  /**
   * Gets table body rows by specific row locator
   * @param rowLocator {String} Row locator
   */
  getTableBodyRow(rowLocator: string) {
    return this.getInstance().find(`tbody ${rowLocator}`);
  }

  /**
   * Gets first table row which contains the text
   * @param text {String} Text to search inside cell
   */
  getRowContainingText(text: string, options: object | null = null) {
    if (options === null) {
      return this.getInstance().contains("tr", text);
    }
    return this.getInstance().contains("tr", text, options);
  }

  /**
   * Gets all table rows with text
   * @param text {String} Text to search inside row
   */
  getAllRowsContainingText(text: string) {
    return this.getInstance().get(`tr:contains(${text})`);
  }

  /**
   * Gets table header which contains the text
   * @param text {String} Text to search inside cell
   */
  getHeaderContainingText(text: string) {
    return this.getInstance().contains("th", text);
  }

  /**
   * Gets a tale column content number by index
   * @param columnIndex {Number} Column position within the table
   */
  getColumnByIndex(columnIndex: number) {
    return this.getInstance().get(`td:nth-child(${columnIndex})`);
  }

  /**
   * Asserts if a targeted column contains a string
   * Is case insensitive by default, but this can be mandated if required
   * @param columnIndex {number} Column position in the table
   *        expectedText {string} The texted expected witin the column
   *        matchCase {boolean} Set to true if case is important
   */
  assertColumnCellsContainText(
    columnIndex: number,
    expectedText: string,
    matchCase = false
  ) {
    return this.getColumnByIndex(columnIndex).each((cell) => {
      cy.wrap(cell).contains(expectedText, { matchCase: matchCase });
    });
  }

  /**
   * Asserts if amount of header columns is equal to specific number
   * @param amount {number} Expected amount of elements found with passed locator
   */
  assertHeadersAmountIs(amount: number) {
    this.getInstance().find("th").should("have.length", amount);
  }

  /**
   * Asserts if headers contain expected columns names
   * @param expectedColumns {string[]} Expected columns names
   */
  assertHeadersContain(expectedColumns: string[]) {
    expectedColumns.forEach((columnName) => {
      this.getHeaderContainingText(columnName);
    });
  }
}
