import { BaseElement } from '../base/element.base';
import { BasePage } from '../base/page.base';
import { TB } from '../elements/textbox.element';
import { CB } from '../elements/checkbox.element';
import { Toggle } from '../elements/toggle.element';
import { Dropdown, StaticDropdown } from '../elements/dropdown.element';
import { recurse } from 'cypress-recurse';
import { isEqual } from 'lodash';

export default abstract class GenericPageWithLogger extends BasePage {
  constructor(pageName: string, urlPattern?: RegExp) {
    super(pageName, urlPattern);
  }

  protected clickOnElement(
    elementToClick: BaseElement,
    options: object | null = null,
  ) {
    this.logger.step(`Clicking on the [${elementToClick.entityName}]`);
    elementToClick.click(options);
    return this;
  }

  protected tickCheckbox(element: CB) {
    this.logger.step(`Tick the ${element.entityName}`);
    element.check();
    return this;
  }

  protected untickCheckbox(element: CB) {
    this.logger.step(`Untick the ${element.entityName}`);
    element.uncheck();
    return this;
  }

  protected verifyElementContainsText(
    element: BaseElement,
    expectedText: string,
  ) {
    this.logger.step(
      `Checking that the [${element.entityName}] contains text [${expectedText}]`,
    );
    element.assertContainsText(expectedText);
    return this;
  }

  protected verifyElementNotContainsText(
    element: BaseElement,
    expectedText: string,
  ) {
    this.logger.step(
      `Checking that the [${element.entityName} does not contain text [${expectedText}]`,
    );
    element.assertNotContainsText(expectedText);
    return this;
  }

  protected verifyElementTextIsVisible(
    element: BaseElement,
    expectedText: string,
    matchCase?,
  ) {
    this.logger.step(
      `Checking that the [${element.entityName}] shows text [${expectedText}]`,
    );
    element.getInstance().scrollIntoView();
    element.assertTextIsVisible(expectedText, matchCase);
    return this;
  }

  protected verifyElementHasText(element: BaseElement, expectedValue: string) {
    this.logger.step(
      `Verifying if the [${element.entityName}] has text [${expectedValue}]`,
    );
    element.assertHasText(expectedValue);
    return this;
  }

  protected verifyElementHasValue(element: BaseElement, expectedValue: string) {
    this.logger.step(
      `Verifying if the [${element.entityName}] has value [${expectedValue}]`,
    );
    element.assertHasValue(expectedValue);
    return this;
  }

  protected verifyElementExists(element: BaseElement) {
    this.logger.step(`Verifying that the [${element.entityName}] exists`);
    element.assertExists();
    return this;
  }

  protected verifyToggleSetToTrue(element: Toggle) {
    this.logger.step(
      `Verifying that the [${element.entityName}] is set to true`,
    );
    element.assertToggleSetToTrue();
    return this;
  }

  protected verifyToggleSetToFalse(element: Toggle) {
    this.logger.step(
      `Verifying that the [${element.entityName}] is set to false`,
    );
    element.assertToggleSetToFalse();
    return this;
  }

  protected slideToggle(element: Toggle) {
    this.logger.step(`Sliding  [${element.entityName}] toggle`);
    element.toggle();
    return this;
  }

  protected verifyElementDoesNotExist(element: BaseElement) {
    this.logger.step(
      `Verifying that the [${element.entityName}] does not exist`,
    );
    element.assertDoesNotExist();
    return this;
  }

  protected verifyElementIsVisible(element: BaseElement) {
    this.logger.step(`Checking that the [${element.entityName}] is visible`);
    element.assertIsVisible();
    return this;
  }

  protected verifyElementNotVisible(element: BaseElement) {
    this.logger.step(
      `Checking that the [${element.entityName}] is not visible`,
    );
    element.assertNotVisible();
    return this;
  }

  protected verifyElementIsEnabled(element: BaseElement) {
    this.logger.step(`Checking that the [${element.entityName}] is enabled`);
    element.assertIsEnabled();
    return this;
  }

  protected verifyElementIsDisabled(element: BaseElement) {
    this.logger.step(`Checking that the [${element.entityName}] is disabled`);
    element.assertIsDisabled();
    return this;
  }

  protected fillTextBoxField(field: TB, text: string) {
    this.logger.step(`Filling the [${field.entityName}] field with [${text}]`);
    field.clear().type(text);
    return this;
  }

  protected fillTextBoxFieldInputElement(field: TB, text: string) {
    this.logger.step(`Filling the [${field.entityName}] field with [${text}]`);
    field
      .clear()
      .type(text)
      .then((element) => {
        if (!isEqual(element.attr('value'), text)) {
          recurse(
            () => {
              this.reloadPage();
              return field.clear().type(text);
            },
            (result) => {
              return isEqual(result.attr('value'), text);
            },
            {
              delay: 1000,
              timeout: 5000,
            },
          );
        } else {
          return this;
        }
      });
    return this;
  }

  protected fillTextBoxFieldDivElement(field: TB, text: string) {
    this.logger.step(`Filling the [${field.entityName}] field with [${text}]`);
    field
      .clear()
      .type(text)
      .then((element) => {
        if (!isEqual(element.text(), text)) {
          recurse(
            () => {
              this.reloadPage();
              return field.clear().type(text);
            },
            (result) => {
              return isEqual(result.text(), text);
            },
            {
              delay: 1000,
              timeout: 5000,
            },
          );
        } else {
          return this;
        }
      });
    return this;
  }

  protected clearTextBoxFieldWithRecursion(field: TB) {
    this.logger.step(`Clearing the [${field.entityName}] field`);
    field.clear().then((element) => {
      if (!isEqual(element.text(), '')) {
        recurse(
          () => field.click().clear(),
          (result) => isEqual(result.text().length, 1),
          {
            delay: 1000,
            timeout: 5000,
          },
        );
      } else {
        return this;
      }
    });
    return this;
  }

  protected clearTextBoxField(field: TB) {
    this.logger.step(`Clearing the [${field.entityName}] field`);
    field.clear();
    return this;
  }

  protected verifyTextBoxIsEmpty(field: TB) {
    this.logger.step(`Checking that the [${field.entityName}] field is empty`);
    field.assertIsEmpty();
    return this;
  }

  protected selectOption(
    element: StaticDropdown,
    text: string,
    matchCase = { matchCase: true },
    forceClick = { force: true },
  ) {
    this.logger.step(`Selecting ${text} option`);
    element.select(text, matchCase, forceClick);
    return this;
  }

  protected verifyIsChecked(field: CB) {
    this.logger.step(`Checking the [${field.entityName}] is checked`);
    field.assertBeChecked();
    return this;
  }

  protected verifyIsNotChecked(field: CB) {
    this.logger.step(`Checking the [${field.entityName}] is not checked`);
    field.assertNotBeChecked();
    return this;
  }

  protected verifyDropdownSelectedValue(
    dropdown: Dropdown,
    expectedText: string,
  ) {
    this.logger.step(
      `Verifying if the [${dropdown.entityName}] has text: [${expectedText}]`,
    );
    dropdown.getInputBarInstance().then((inputBarElement) => {
      expect(inputBarElement.text()).to.be.eq(expectedText);
    });
    return this;
  }

  protected verifyAttributeEqualsValue(
    field: TB,
    attribute: string,
    expectedText: string,
  ) {
    this.logger.step(
      `Checking the [${field.entityName}] attribute of [${attribute}] has a value of '[${expectedText}]`,
    );
    field.assertAttributeEqualsValue(attribute, expectedText);
    return this;
  }

  protected verifyElementHasAttribute(field: TB, expectedAttribute: string) {
    this.logger.step(
      `Checking the [${field.entityName}] has an attribute of [${expectedAttribute}]`,
    );
    field.assertElementHasAttribute(expectedAttribute);
    return this;
  }
}
